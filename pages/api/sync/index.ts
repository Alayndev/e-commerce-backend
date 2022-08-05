// Archivo encargado de sincronizar Airtable y Algolia - Se ejecuta cada un minuto con Cron Job
import { NextApiRequest, NextApiResponse } from "next";

import { base } from "lib/connections/airtable";
import { productsIndex } from "lib/connections/algolia";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    base("Products")
      .select({
        pageSize: 5,
      })
      .eachPage(
        async function page(records, fetchNextPage) {
          // Algolia: Guardamos estos records en Algolia
          const objects = records.map((r) => {
            return {
              objectID: r.id,
              ...r.fields,
            };
          });

          await productsIndex.saveObjects(objects);

          // console.log(objects, "objects");

          // console.log("Página");

          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }

          // console.log("Terminó");

          res.status(200).json({ message: "Sync completed", ok: true });
        }
      );
  } catch (error) {
    res.status(500).send({ message: "Sync failed. " + error  });
  }
}
