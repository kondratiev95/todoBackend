import * as Koa from "koa";
import * as cors from "@koa/cors";
import * as koaBody from "koa-body";
import { port, hostname } from "../config/config";
import router from '../router/router';
import connectToDB from "../connectToDB/connectToDB";

const app: Koa = new Koa();
app.use(koaBody());
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

connectToDB();

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
