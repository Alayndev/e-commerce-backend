import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import methods from "micro-method-router";
import { getProductByID } from "controllers/products";

// GET /products/{id}: Obtiene toda data de un producto.
async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  const { productId }: any = req.query;
  const productData = await getProductByID(productId);

  if (productData.error) {
    res.status(400).send({ productData });
  } else {
    res.send({ productData });
  }
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
