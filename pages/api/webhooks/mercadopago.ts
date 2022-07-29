import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/connections/mercadopago";
import { sendEmail } from "lib/connections/sendgrid";
import methods from "micro-method-router";
import { Order } from "models/order";

async function getOrder(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;

  console.log(id, "id", topic, "topic");

  if (topic == "merchant_order") {
    console.log("topic: ", topic);

    const order = await getMerchantOrder(id);

    if (order.body.order_status === "paid") {
      const orderId = order.body.external_reference;

      const myOrder = new Order(orderId); 
      await myOrder.pullOrder(); 

      myOrder.data.status = "paid"; 
      myOrder.data.gatewaysOrder = order.body; 
      const now = new Date();
      myOrder.data.updatedAt = now; 

      await myOrder.pushOrder(); // Actualizamos el estado/status de la orden

      // Todo: Mandar email a quien compró
      // sendEmail("pepe@gmail", 200);
      // sendEmailInterno("Alguien compró algo, hay que procesar el pedido y hacer algo en efecto");

      // IMPORTANTE (min. 18 Teoria): Siempre hay que responde status 200 o 201, sino MP le sigue pegando a notification_url hasta obtene respuesta porque NO sabe si la URL fue notificada
      // https://www.mercadopago.com.ar/developers/es/docs/notifications/ipn
      res.status(200).send({ order_status: order.body.order_status, order });
    } else {
      console.log("order_status: ", order.body.order_status); // ! DUDA: Aca lo mismo, cual sería el else {} de este if {}. Porque "paid" creo que es solamente cuando el pago es efectivo con APRO
    }
  } else {
    // ! DUDA: En Vercel Functions del endpoint /webhooks/mercadopago podemos ver errores debido a que a este endpoint tambien le pega MP y el topic NO es merchant_order, sino que es type/topic=payment, que respondemos en este caso? O no importa ese error?
    // Respondemos 200
    console.log("topic: ", topic, "no merchant_order as topic");

    res.status(200).send({ message: "no merchant_order as topic" });
  }
}

export default methods({
  post: getOrder,
});
