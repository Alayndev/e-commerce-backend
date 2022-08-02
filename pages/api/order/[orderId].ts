import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import methods from "micro-method-router";
import { getOrderById } from "controllers/orders";
import * as yup from "yup";
import { validateQuery } from "lib/middlewares/schemasMiddlewares";

let querySchema = yup
  .object()
  .shape({
    orderId: yup.string().required("orderId required by body"),
  })
  .noUnknown(true)
  .strict();

// GET /order/{orderId}: Devuelve una orden con toda la data incluyendo el estado de la orden.
async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId }: any = req.query;
  const orderData = await getOrderById(orderId);

  if (orderData.error) {
    res.status(400).send({ orderData });
  } else {
    res.send({ orderData });
  }
}

const handler = methods({
  get: getHandler,
});

export default validateQuery(querySchema, authMiddleware(handler));
