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
}

export { Product };
