import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import { createOrder } from "controllers/orders";
import * as yup from "yup";
import {
  validateBody,
  validateQuery,
} from "lib/middlewares/schemasMiddlewares";

// ! Yup: Definimos los schemas para validar query/body. Primero que nada validamos que query/body tengan los datos/campos requeridos con los tipos requeridos. De no ser así, cortamos el flujo
let querySchema = yup.object().shape({
  productId: yup.string().required("productId required by query"), // El mensaje que se va a mostrar en errors
});

// Con .noUnknown(true).strict(); NO permitimos otros datos/campos
let bodySchema = yup
  .object()
  .shape({
    color: yup.string().required("color required by body"),
    shipping_address: yup
      .string()
      .required("shipping_address required by body"),
  })
  .noUnknown(true)
  .strict();

// POST /order?productId={id}:  Este un endpoint seguro, chequea el token y recupera la data del user de la db. Recibe por query param el id del producto a comprar (productId) y adicionalmente toda la data extra sobre esta compra en el body. Por ejemplo: detalles del envío, modificaciones sobre el producto como tamaño, color etc. Genera la orden en nuestra base de datos (un registro en la collection orders) y a continuación la preferencia en MercadoPago. Para poder reconocer esta orden más adelante vamos a utilizar el campo external_reference para indicarle el id de la orden de nuestra DB. Además vamos a setear la URL de nuestro hook en el campo notification_url. Este endpoint debe responder con la URL a donde debemos redirigir al user.
async function createPreference(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  const { productId } = req.query as any;

  try {
    const { url } = await createOrder(userData.userId, productId, req.body);

    // Este endpoint debe responder con la URL a donde debemos redirigir al user.
    res.status(200).json({ url });
  } catch (error) {
    res.status(400).json({ message: error });
  }
}

const handler = methods({
  post: createPreference,
});

// Asi se ponen 3 middlewares con los parametros para c/u
// ! Primero que nada validamos que query/body tengan los datos/campos requeridos con los tipos requeridos. De no ser así, cortamos el flujo
export default validateQuery(
  querySchema,
  validateBody(bodySchema, authMiddleware(handler))
);

// Funcionamiento del endpoint:
// 1) Defino los schemas con Yup para query y body y valido los mismos con sus respectivos middlewares
// 2) authMiddleware valida que el haya token y que sea valido
// 3) handler/createPreference/View deriva al Controller
// 4) Controller genera orden de compra en nuestra DB y preferencia de MP. Devuelve url si todo sale bien o error que agarra el catch
// 5) Respondemos en la View. Envolvemos en un try/catch y respondemos la url para redireccionar al user si todo sale bien o respondemos el error
