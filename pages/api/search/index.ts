import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getLimitAndOffset } from "helpers/requests";
import { productsIndex } from "lib/connections/algolia";
import * as yup from "yup";
import { authMiddleware } from "lib/middlewares/authMiddleware";
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

// Todo: MVC
// Algolia Pagination: https://www.algolia.com/doc/api-reference/api-parameters/page/ || https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/pagination/js/#pagination-at-indexing-time
// Endpoint para buscar products en Algolia
async function searchProducts(req: NextApiRequest, res: NextApiResponse) {
  const { finalLimit, finalOffset } = getLimitAndOffset(req, 10, 20); // DUDA: Como averiguo el total? 3er parámetro de getLimitAndOffset(); - Marce les pone valores random por defecto (video desafio min. 2 a 11) pero eso es cualquiera - Sequelize: findAndCountAll() nos sirve count para las Pagination Response devolver el total SIN traer innecesariamente todos los items y traer SOLO los solicitados y aun así poder poner el total de esa lista con total: count.

  const wordToSearch: string = req.query.q as string;

  const results = await productsIndex.search(wordToSearch, {
    offset: finalOffset, // NO incluye al offset, te da desde offset + 1. Por ejemplo si offset: 15, length: 2 --> Te da records 16 y 17

    length: finalLimit, // length === limit --> Cant. de items/records/products
  });

  console.log(results, "results");

  res.status(200).json({
    results: results.hits,

    pagination: {
      offset: finalOffset,
      limit: finalLimit,
      total: results.nbHits, // nbHits porque si por ejemplo busco "mate uruguayo" quiero saber cuantos nbHits hay para esa busqueda para paginar y NO cuantos items en total hay en la DB (que incluye celulares y auriculares y etc. de items)
    },
  });
}

const handler = methods({
  get: searchProducts,
});

export default validateQuery(querySchema, authMiddleware(handler));
