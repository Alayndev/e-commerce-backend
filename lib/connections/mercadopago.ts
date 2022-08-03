import mercadopago from "mercadopago";

const MP_TOKEN: string = process.env.MP_TOKEN as string;

mercadopago.configure({
  access_token: MP_TOKEN, 
});

export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id); 
  //console.log(res, "res");

  return res;
}

// Crear preferencia
export async function createPreferenceMP(data) {
  const res = await mercadopago.preferences.create(data);
  //console.log(res, "res");

  return res;
}
