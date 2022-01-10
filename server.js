import http from "http";
import { MongoClient } from "mongodb";
import  { ENDPOINTS } from "./apiConstants.js";
import { port, hostname, dbName, uri } from "./config.js";
import { 
  addData, 
  removeItem, 
  toggleItem, 
  toggleAll, 
  deleteCompleted, 
  editTodo,
  updateUI
} from "./handlers.js";
import { setHeaders } from "./headers.js";

let db = null;

const client = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
async function connectToDB() {
  try {
    await client.connect();
    db = client.db(dbName);
  } catch(err) {
    console.log('failed to connect DB', err.stack);
  }
}

const server = http.createServer();

server.on('request', (req, res) => {
  let body = "";
  setHeaders(res);
  const todosCollection = db.collection("todos");

  if(req.method === "GET") {
    updateUI(todosCollection, res);
  }

  req.on('data', chunk => {
    body += chunk;

    if(req.method === "POST") {
      switch(req.url) {
        case ENDPOINTS.addData:
          addData(todosCollection,body,res);
          break;
        case ENDPOINTS.removeItem:
          removeItem(todosCollection,body,res);
          break;
        case ENDPOINTS.toggleItem:
          toggleItem(todosCollection,body,res);
          break;
        case ENDPOINTS.toggleAll:
          toggleAll(todosCollection,body,res);
          break;
        case ENDPOINTS.deleteCompleted:
          deleteCompleted(todosCollection, res);
          break;
        case ENDPOINTS.editTodo:
          editTodo(todosCollection,body,res);
          break;
        default:
          res.writeHead(404, 'Not found', {'content-type' : 'text/plain'});
          res.end();
          break;
      }
    }
  })
  req.on('error', () => {
    res.writeHead(400, 'Could not get data', {'content-type' : 'text/plain'});
    res.end();
  })
});

connectToDB();

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
