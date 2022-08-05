import { Order } from "models/order";
import { User } from "models/user";
import { Product } from "models/product";
import {
  createPreferenceMP,
  getMerchantOrder,
} from "lib/connections/mercadopago";
import { getProductByID } from "./products";
import { sendPaymentConfirmation } from "lib/connections/sendgrid";

type CreateOrderRes = {
  url: string;
  orderId: string;
};

export async function createOrder(
  userId: string,
  productId: string,
  additionalInfo
): Promise<CreateOrderRes> {
  const product = await getProductByID(productId);
  console.log("🚀 ~ file: orders.ts ~ line 20 ~ product", product);

  if (product.error) {
    throw `Product not found. ${product.error}`;
  }

  if (!product.stock) {
    throw `Out of stock.`;
  }

  // 1) Generamos orden de compra en nuestra DB - Firestore
  // Quien compra (userId) - Que compra (productId) - Datos adicionales de la compra
  const now = new Date();

  const newOrderObj = {
    additionalInfo,
    productId,
    userId,
    createdAt: now,
    status: "pending",
  };

  const newOrder = await Order.createNewOrder(newOrderObj);
  console.log(newOrder.id, "newOrder.id - doc id");

  // 2) Generar preferencia en MP (min. 22 - 27) (ver createPreferenceMP())
  const preferenceData = {
    items: [
      {
        title: product.title,
        description: "Mouse negro",
        picture_url: "http://www.myapp.com/myimage.jpg",
        category_id: "4444",
        quantity: 1,
        currency_id: "ARS",
        unit_price: product.price,
      },
    ],
    back_urls: {
      success: "https://apx.school/",
      pending: "https://apx.school/discord",
      failure: "https://apx.school/blog",
    },
    external_reference: newOrder.id,
    notification_url: "https://pagos-mp.vercel.app/api/webhooks/mercadopago",
  };

  const pref = await createPreferenceMP(preferenceData);

  return { url: pref.body.init_point, orderId: newOrder.id };
}

export async function getUserOrdersById(id: string): Promise<any> {
  const userOrders = await Order.getUserOrders(id);

  return userOrders;
}

export async function getOrderById(orderId: string): Promise<any> {
  const orderData = await Order.getOrder(orderId);

  return orderData;
}

export async function updateOrder(topic: string, id): Promise<any> {
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);

    if (order.body.order_status === "paid") {
      const orderId = order.body.external_reference;

      const myOrder = new Order(orderId);
      await myOrder.pullOrder();

      myOrder.data.status = "paid";
      myOrder.data.gatewayOrder = order.body;
      const now = new Date();
      myOrder.data.updatedAt = now;

      const userRef = new User(myOrder.data.userId);
      await userRef.pullUser();
      await sendPaymentConfirmation(userRef.data.email);

      await Product.updateProductByID(myOrder.data.productId); // Actualizo Airtable, totalUnitsSold

      await myOrder.pushOrder(); // Actualizamos el estado/status de la orden

      return { order_status: order.body.order_status, order };
    } else {
      console.log("order_status: ", order.body.order_status);
    }
  } else {
    console.log("topic: ", topic, "no merchant_order as topic");
  }
}
