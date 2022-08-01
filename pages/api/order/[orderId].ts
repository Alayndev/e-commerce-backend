import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import methods from "micro-method-router";
import { getOrderById } from "controllers/orders";

// GET /order/{orderId}: Devuelve una orden con toda la data incluyendo el estado de la orden.
async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  const { orderId }: any = req.query;
  const orderData = await getOrderById(orderId);

  res.send({ orderData });
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
