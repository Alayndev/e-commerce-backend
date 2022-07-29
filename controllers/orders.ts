// yup dwf-m9
import { Order } from "models/order";
import { createPreferenceMP } from "lib/connections/mercadopago";

type CreateOrderRes = {
  url: string;
};

// TODO: Hacerlo posta para subirlo a GitHub
// Simula la coll products de Firestore
const products = {
  1234: {
    title: "Mate de APX",
    price: 230,
  },
};

// Controller con parametros de entrada y de salida tipados
export async function createOrder(
  userId: string,
  productId: string,
  aditionalInfo
): Promise<CreateOrderRes> {
  const product = products[productId]; // Simula buscar el producto en la coll products de Firestore

  if (!product) {
    throw "Product not found";
  }

  // ! 1) Generamos orden de compra en nuestra DB - Firestore (20 - 22)
  // TODO: (min. 21) Controller que verifique que un mismo user NO compre dos veces el mismo producto, where(). Pero estaría mal? O abría que avisarle solamente? Puede comprar 2 veces el mismo producto
  // Quien compra (userId) - Que compra (productId) - Datos adicionales de la compra 
  const now = new Date();

  const newOrderObj = {
    aditionalInfo,
    productId,
    userId,
    createdAt: now,
    status: "pending", // (min. 30) Al crear la order esta está en status pending así el user puede ver que products tiene por pagar, o podemos desde el e-commerce recorrer las ordenes de un user y mandarle un email de que le quedo este product por pagar/en el carrito
  };

  const newOrder = await Order.createNewOrder(newOrderObj);
  console.log(
    newOrder.id,
    "para seguir local o Vercel Functions y ver si se actualiza"
  );

  // ! 2) Generar preferencia en MP (min. 22 - 27) (ver createPreferenceMP())
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
    notification_url: "https://pagos-mp.vercel.app/api/webhooks/mercadopago", // Tras hacer deploy con Vercel, ponemos este Endpoint para que le pegue MP.     // IMPORTANTE: (min. 12:30 Teoria Intencio de compra) notification_url: Es el endpoint de nuestra API al cual la API de MercadoPago le va a pegar para informarle que algo paso con la preferencia/intencion de compra creada. Nomenclaturas convencionales de este endpoint: POST /ipn - POST /webhooks/mercadopago
  };

  const pref = await createPreferenceMP(preferenceData);

  return { url: pref.body.init_point };
}
