import * as http from "http";
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
  getData,
  updateUI
} from "./handlers.js";
import { setHeaders } from "./header.js";

const server = http.createServer((request, response) => {
  setHeaders(response);

  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) console.log("can not connect to database");

      const db = client.db(dbName);
      const todos = db.collection("todos");
      let body = "";

      request.on('data', (chunk) => {
        body += chunk;
        if (request.method === "POST") {

          if(request.url === ENDPOINTS.addData) {
            addData(todos,body, response);
          } 
          else if(request.url === ENDPOINTS.removeItem) {
            removeItem(body, todos, response);
          } 
          else if(request.url === ENDPOINTS.toggleItem) {
            toggleItem(todos, body, response);
          } 
          else if(request.url === ENDPOINTS.toggleAll) {
            toggleAll(body, todos, response);
          } 
          else if(request.url === ENDPOINTS.deleteCompleted) {
            deleteCompleted(todos, response);
          } 
          else if(request.url === ENDPOINTS.editTodo) {
            editTodo(body, todos, response);
          }
          
        }
      })
      if(request.method === "GET") {
        updateUI(todos, response);
      }
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
