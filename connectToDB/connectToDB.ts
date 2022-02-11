import { MongoClient, MongoClientOptions } from "mongodb";
import { uri, dbName } from "../config/config";

let db = null;
const client = new MongoClient(uri);

export default async function connectToDB() {
  try {
    await client.connect();
  } catch(err) {
    console.log('failed to connect DB', err.stack);
  }
}
db = client.db(dbName);

export const todosCollection = db.collection("todos");

export const usersCollection = db.collection("users");