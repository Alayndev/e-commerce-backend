// Archivo encargado de sincronizar Airtable y Algolia - Se ejecuta cada un minuto con Cron Job
import { NextApiRequest, NextApiResponse } from "next";

import { base } from "lib/connections/airtable";
import { productsIndex } from "lib/connections/algolia";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  base("Products")
    .select({
      pageSize: 5, // Traigo 5 records por página/ejecusión de la función hasta que se terminen los records ya que utlizo fetchNextPage();. La dif con maxRecords es que si hago maxRecords: 5, me trae 5 y listo. Mientras que con pageSize me trae de a 5 hasta que se termine la lista al utilizar fetchNextPage(); y pedir nuevamente 5 (con maxRecords NO funciona fetchNextPage();). Entonces eachPage() será del tamaño de pageSize
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
}
