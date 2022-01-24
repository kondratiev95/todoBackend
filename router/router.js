import Router from "@koa/router";
import { ENDPOINTS } from "../config/apiConstants.js";
import * as handlers from "../app/handlers.js";

const router = new Router();

router.get(ENDPOINTS.getItems, async(ctx) => {
    await handlers.getTodos(ctx);
  });
  router.post(ENDPOINTS.addData, async(ctx) => {
    await handlers.addData(ctx);
  });
  router.post(ENDPOINTS.removeItem, async(ctx) => {
    await handlers.removeItem(ctx);
  });
  router.post(ENDPOINTS.toggleItem, async(ctx) => {
    await handlers.toggleItem(ctx);
  });
  router.post(ENDPOINTS.toggleAll, async(ctx) => {
    await handlers.toggleAll(ctx);
  });
  router.post(ENDPOINTS.deleteCompleted, async(ctx) => {
    await handlers.deleteCompleted(ctx);
  });
  router.post(ENDPOINTS.editTodo, async(ctx) => {
    await handlers.editTodo(ctx);
  });

  export default router;