import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import methods from "micro-method-router";
import { getUserOrdersById } from "controllers/orders";

// GET /me/orders: Devuelve todas mis ordenes con sus status.
async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  const userOrders = await getUserOrdersById(userData.userId);

  res.send(userOrders);
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
