import algoliasearch from "algoliasearch";

const ALGOLIA_APP_ID: string = process.env.ALGOLIA_APP_ID as string;
const ALGOLIA_ADMIN_API_KEY: string = process.env
  .ALGOLIA_ADMIN_API_KEY as string;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
const productsIndex = client.initIndex("products");

export { productsIndex };
