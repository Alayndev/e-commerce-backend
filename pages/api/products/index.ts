import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import methods from "micro-method-router";
import { getProductByID } from "controllers/products";
import * as yup from "yup";
import { validateQuery } from "lib/middlewares/schemasMiddlewares";

let querySchema = yup
  .object()
  .shape({
    productId: yup.string().required("productId required by body"),
  })
  .noUnknown(true)
  .strict();

// GET /products/{id}: Obtiene toda data de un producto.
async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  const { productId }: any = req.query;

  try {
    const productData = await getProductByID(productId);
    res.send({ productData });
  } catch (error) {
    res.status(400).send({ error });
  }
}

const handler = methods({
  get: getHandler,
});

export default validateQuery(querySchema, authMiddleware(handler));
