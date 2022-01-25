import { Context, Request } from 'koa';

interface KoaRequest<RequestBody = any> extends Request {
    body?: RequestBody;
}

export interface KoaContext<RequestBody = any, ResponseBody = any> extends Context {
    request: KoaRequest<RequestBody>;
    body: ResponseBody;
}

export interface KoaResponseContext<ResponseBody> extends KoaContext<any, ResponseBody> {}

export type SetValueType = {
    body: string
}

export type SetIdType = {
    body: string
}

export type TodosObjectType = {
    _id: string,
    value: string,
    completed: boolean
}

export type SetToggleAllType = {
    body: boolean
}

export type SetEditTodoObjType = {
    body: {
        _id: string,
        value: string
    }
}
