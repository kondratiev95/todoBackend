import * as Router from "@koa/router";
import { ENDPOINTS } from "../config/apiConstants";
import * as handlers from "../app/handlers";
import { SetValueType, SetIdType, KoaContext, SetToggleAllType, TodosObjectType, SetEditTodoObjType  } from "../ts/types";

const router = new Router();

router.get(ENDPOINTS.getItems, async(ctx: KoaContext<TodosObjectType>) => {
    await handlers.getTodos(ctx);
  });
router.post(ENDPOINTS.addData, async(ctx:  KoaContext<SetValueType>) => {
  await handlers.addData(ctx);
});
router.post(ENDPOINTS.removeItem, async(ctx: KoaContext<SetIdType>) => {
  await handlers.removeItem(ctx);
});
router.post(ENDPOINTS.toggleItem, async(ctx: KoaContext<SetIdType>) => {
  await handlers.toggleItem(ctx);
});
router.post(ENDPOINTS.toggleAll, async(ctx: KoaContext<SetToggleAllType>) => {
  await handlers.toggleAll(ctx);
});
router.post(ENDPOINTS.deleteCompleted, async(ctx: KoaContext) => {
  await handlers.deleteCompleted(ctx);
});
router.post(ENDPOINTS.editTodo, async(ctx: KoaContext<SetEditTodoObjType>) => {
  await handlers.editTodo(ctx);
});

export default router;