import mercadopago from "mercadopago";

const MP_TOKEN: string = process.env.MP_TOKEN as string;

mercadopago.configure({
  access_token: MP_TOKEN, // Token de produccion del usuario/cuenta de prueba del vendedor. Gist: https://gist.github.com/zapaiamarce/9f1e7ee7e5852e5c3f4c7ebc6ceb76e3
});

export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id); // Agarramos la merchant_order por el id que recibimos por query cuando le pega MP a notification_url. "La orden es una intención de compra" - orden/orden de compra === preferencia/intención de compra/pago (min. 14:50 Desafio) - Lo que hacemos es agarrar la orden de compra que genera MP a partir de que generamos una preferencia ya sea pegandole a la API directamente o con la libreria como en createPreferenceMP()
  //console.log(res, "res");

  return res;
}

// Crear preferencia
export async function createPreferenceMP(data) {
  const res = await mercadopago.preferences.create(data);
  //console.log(res, "res");

  return res;
}
