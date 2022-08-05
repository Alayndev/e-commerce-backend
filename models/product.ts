import { productsIndex } from "lib/connections/algolia";
import { base } from "lib/connections/airtable";

class Product {
  id: string;

  constructor(id) {
    this.id = id;
  }

  static async getProductByObjectID(objectID) {
    try {
      const res = await productsIndex.getObject(objectID);
      // console.log("getProductByObjectID ~ res", res);

      return res;
    } catch (error) {
      //   console.log(error, "error");

      return { error: error.message };
    }
  }

  static async updateProductByID(producId: string) {
    try {
      base("Products").find(producId, async function (err, record: any) {
        if (err) {
          console.error(err);
          throw `${err}`;
        }

        await record.patchUpdate({
          totalUnitsSold: record.fields.totalUnitsSold + 1,
        });
      });
    } catch (error) {
      //   console.log(error, "error");

      return { error: error.message };
    }
  }

  static async getProducts(
    wordToSearch: string,
    finalOffset: number,
    finalLimit: number
  ) {
    try {
      const results = await productsIndex.search(wordToSearch, {
        offset: finalOffset,

        length: finalLimit,
      });

      return results;
    } catch (error) {
      //   console.log(error, "error");

      return { error: error.message };
    }
  }

  static async countAllProducts(wordToSearch: string) {
    try {
      const results = await productsIndex.search(wordToSearch);

      return results;
    } catch (error) {
      //   console.log(error, "error");

      return { error: error.message };
    }
  }
}

export { Product };
