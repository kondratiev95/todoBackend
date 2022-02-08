import Router from "@koa/router";
import { ENDPOINTS } from "../config/apiConstants";
import * as todoHandlers from "../app/todoHandlers";
import * as authHandlers from "../app/authHandlers";
import { SetValueType, SetIdType, KoaContext, SetToggleAllType, TodosObjectType, SetEditTodoObjType  } from "../ts/types";
import { verifyToken } from "../app/authHandlers";

const router = new Router();

router.get(ENDPOINTS.getItems,verifyToken, async(ctx: KoaContext<TodosObjectType>) => {
  await todoHandlers.getTodos(ctx);
});
router.post(ENDPOINTS.addData,verifyToken, async(ctx:  KoaContext<SetValueType>) => {
  await todoHandlers.addData(ctx);
});
router.post(ENDPOINTS.removeItem,verifyToken, async(ctx: KoaContext<SetIdType>) => {
  await todoHandlers.removeItem(ctx);
});
router.post(ENDPOINTS.toggleItem,verifyToken, async(ctx: KoaContext<SetIdType>) => {
  await todoHandlers.toggleItem(ctx);
});
router.post(ENDPOINTS.toggleAll,verifyToken, async(ctx: KoaContext<SetToggleAllType>) => {
  await todoHandlers.toggleAll(ctx);
});
router.post(ENDPOINTS.deleteCompleted,verifyToken, async(ctx: KoaContext) => {
  await todoHandlers.deleteCompleted(ctx);
});
router.post(ENDPOINTS.editTodo,verifyToken, async(ctx: KoaContext<SetEditTodoObjType>) => {
  await todoHandlers.editTodo(ctx);
});
router.post(ENDPOINTS.signup, async(ctx: KoaContext) => {
  await authHandlers.sendCredentials(ctx);
})
router.post(ENDPOINTS.signin, async(ctx: KoaContext) => {
  await authHandlers.sendLoginData(ctx);
})

export default router;