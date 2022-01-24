import { MongoClient } from "mongodb";
import { uri, dbName } from "../config/config.js";

let db = null;

const client = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });

export default async function connectToDB() {
  try {
    await client.connect();
  } catch(err) {
    console.log('failed to connect DB', err.stack);
  }
}

db = client.db(dbName);

export const todosCollection = db.collection("todos");