import Koa from "koa";
import cors from "@koa/cors";
import koaBody from "koa-body";
import { port, hostname } from "../config/config.js";
import router from '../router/router.js';
import connectToDB from "../connectToDB/connectToDB.js";

const app = new Koa();
app.use(koaBody());
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

connectToDB();

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
