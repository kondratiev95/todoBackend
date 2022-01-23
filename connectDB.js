import { MongoClient } from "mongodb";
import { dbName, uri } from "./config.js";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export default async function connectDB() {
    await client.connect();
}

export const db = client.db(dbName);

export const todosCollection = db.collection("todos");

 