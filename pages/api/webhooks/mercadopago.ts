import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { updateOrder } from "controllers/orders";

async function getOrder(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic }: any = req.query;

  try {
    const res = await updateOrder(topic, id);

    res.status(200).send(res);
  } catch (error) {
    // Siempre res 200 con MP
    res.status(200).send({ error });
  }
}

export default methods({
  post: getOrder,
});
