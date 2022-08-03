import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getLimitAndOffset } from "helpers/requests";
import * as yup from "yup";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import { getProducts, getProductsTotal } from "controllers/products";
import { validateQuery } from "lib/middlewares/schemasMiddlewares";

let querySchema = yup
  .object()
  .shape({
    q: yup.string().required("q required by body"),
    limit: yup.string(),
    offset: yup.string(),
  })
  .noUnknown(true)
  .strict();

// GET /search?q=query&offset=0&limit=10: Endpoint para buscar products en Algolia. Buscar productos en nuestra base de datos. Chequea stock y todo lo necesario.
async function searchProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const wordToSearch: string = req.query.q as string;
    const { nbHits } = await getProductsTotal(wordToSearch);

    const { finalLimit, finalOffset } = getLimitAndOffset(req, 10, nbHits);

    const results = await getProducts(wordToSearch, finalOffset, finalLimit);

    res.status(200).json({
      results: results.hits,
      resultsTotal: results.hits.length,

      pagination: {
        offset: finalOffset,
        limit: finalLimit,
        total: results.nbHits,
      },
    });
  } catch (error) {
    res.status(400).send({ error });
  }
}

const handler = methods({
  get: searchProducts,
});

export default validateQuery(querySchema, authMiddleware(handler));
