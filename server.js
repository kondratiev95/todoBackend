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
connectToDB();

const server = http.createServer();

server.on('request', (req, res) => {
  let body = "";
  setHeaders(res);
  const todos = db.collection("todos");

  if(req.method === "GET") {
    updateUI(todos, res);
  }

  req.on('data', chunk => {
    body += chunk;

    if(req.method === "POST") {
      switch(req.url) {
        case ENDPOINTS.addData:
          addData(todos,body,res);
          break;
        case ENDPOINTS.removeItem:
          removeItem(todos,body,res);
          break;
        case ENDPOINTS.toggleItem:
          toggleItem(todos,body,res);
          break;
        case ENDPOINTS.toggleAll:
          toggleAll(todos,body,res);
          break;
        case ENDPOINTS.deleteCompleted:
          deleteCompleted(todos, res);
          break;
        case ENDPOINTS.editTodo:
          editTodo(todos,body,res);
          break;
        default:
          updateUI(todos, res);
          break;
      }
    }
  })
  req.on('error', () => {
    res.end(JSON.stringify('Error 400, could not get data'));
  })
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
