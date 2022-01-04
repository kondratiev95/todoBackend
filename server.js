import * as http from "http";
import { MongoClient, ObjectId } from "mongodb";
import  { ENDPOINTS } from "./apiConstants.js";
import { port, hostname, dbName, uri } from "./config.js";

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/plain");
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  response.setHeader("Access-Control-Allow-Credentials", true);

  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.log("can not connect to database");
      }
      const db = client.db(dbName);
      const todos = db.collection("todos");

      request.on('data', (chunk) => {
        let body = "";
        body += chunk;
        
        function updateUI() {
          todos.find().toArray((err, user) => {
            response.end(JSON.stringify(user));
          });
        }

        if (request.method === "POST") {
          if(request.url === ENDPOINTS.addData) {
            const newTodoItem = {
              completed: false,
              value: JSON.parse(body)
            }
            todos.insertOne(newTodoItem);
            updateUI();
          } 
          else if(request.url === ENDPOINTS.removeItem) {
            const id = new ObjectId(JSON.parse(body));
            todos.deleteOne({_id: id});
            updateUI();
          } 
          else if(request.url === ENDPOINTS.toggleItem) {
            async function toggleItem() {
              const id = new ObjectId(JSON.parse(body));
              const currentItem = await todos.findOne({_id: id});
              todos.findOneAndUpdate({_id: id}, {$set: {completed: !currentItem.completed}})
              updateUI();
            }
            toggleItem();
          } 
          else if(request.url === ENDPOINTS.toggleAll) {
            if(JSON.parse(body)) {
              todos.updateMany({}, {$set: { completed: false}});
              updateUI();
            } else {
              todos.updateMany({}, {$set: { completed: true}});
              updateUI();
            }
          } 
          else if(request.url === ENDPOINTS.deleteCompleted) {
            todos.deleteMany({completed : true});
            updateUI();
          } 
          else if(request.url === ENDPOINTS.editTodo) {
            const obj = JSON.parse(body);
            const id = new ObjectId(obj.id);
            todos.updateOne({_id: id}, {$set: { value: obj.value}});
            updateUI()
          }
        }
      })
      if(request.method === "GET") {
        db.collection("todos").find().toArray((err, user) => {
          err ? console.log('error', err) : null;
          response.end(JSON.stringify(user));
        });
      }
    }
  );
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
