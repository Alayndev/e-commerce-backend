import Airtable from "airtable";

const AIRTABLE_API_KEY: string = process.env.AIRTABLE_API_KEY as string;
const AIRTABLE_BASE_ID: string = process.env.AIRTABLE_BASE_ID as string;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export { base };
