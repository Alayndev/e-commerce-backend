import { productsIndex } from "lib/connections/algolia";

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

  static async getProducts(wordToSearch: string, finalOffset: number, finalLimit: number) {
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

  static async countAllProducts() {
    try {
      const results = await productsIndex.search("");

      return results;
    } catch (error) {
      //   console.log(error, "error");

      return { error: error.message };
    }
  }
}

export { Product };
