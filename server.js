import Koa from "koa";
import KoaRouter from "@koa/router";
import bodyParser from "koa-bodyparser"
import cors from "@koa/cors"

import { ENDPOINTS } from "./apiConstants.js";
import { port, hostname } from "./config.js";
// import {  addData, removeItem, toggleItem, toggleAll, deleteCompleted, editTodo, getTodos } from "./handlers.js";

import * as handlers from "./handlers.js"

import connectDB from "./connectDB.js";

const app = new Koa();
const router = new KoaRouter();
app.use(bodyParser());
app.use(cors());

connectDB();

app.use(router.routes()).use(router.allowedMethods());

router.get(ENDPOINTS.getItems, async(ctx) => {
  console.log('Geeet', ctx)
  ctx.response.body = 'Hello'
})

router.post(ENDPOINTS.addData, async(ctx) => {
  console.log('ADD_DATA', ctx.response)
  await handlers.addData(ctx);
})

// server.on("request", (req, res) => {
//   let body = "";
//   setHeaders(res);
//   const todosCollection = db.collection("todos");

//   if (req.method === "GET") {
//     getTodos(todosCollection, res);
//   }

//   req.on("data", (chunk) => {
//     body += chunk;

//     if (req.method === "POST") {
//       switch (req.url) {
//         case ENDPOINTS.addData:
//           addData(todosCollection, body, res);
//           break;
//         case ENDPOINTS.removeItem:
//           removeItem(todosCollection, body, res);
//           break;
//         case ENDPOINTS.toggleItem:
//           toggleItem(todosCollection, body, res);
//           break;
//         case ENDPOINTS.toggleAll:
//           toggleAll(todosCollection, body, res);
//           break;
//         case ENDPOINTS.deleteCompleted:
//           deleteCompleted(todosCollection, res);
//           break;
//         case ENDPOINTS.editTodo:
//           editTodo(todosCollection, body, res);
//           break;
//         default:
//           res.writeHead(404, "Not found", { "content-type": "text/plain" });
//           res.end();
//           break;
//       }
//     }
//   });
//   req.on("error", () => {
//     res.writeHead(500, "Could not get data", { "content-type": "text/plain" });
//     res.end();
//   });
// });


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
