import { ObjectId } from "mongodb";
import { todosCollection } from "../connectToDB/connectToDB";
import {Context} from 'koa';
import { getUserId } from "../utils/utils";

export const getTodos = async (ctx: Context) => {

    const accessToken = ctx.header.authorization.split(' ')[1]
    const userId = getUserId(accessToken)
    const array = await todosCollection.find({userId}).toArray();
    console.log(array);

    if(array) {
        ctx.body = array;
    } else {
        throw new Error('Could not get data');
    }
}

export const addData = async (ctx: Context) => {
    // console.log(ctx);
    const accessToken = ctx.header.authorization.split(' ')[1]
    const userId = getUserId(accessToken)
    
    const newTodoItem = {
        completed: false,
        value: JSON.parse(ctx.request.body).trim(),
        userId,
    }
    const resObj = await todosCollection.insertOne(newTodoItem);
    const res = {
        ...newTodoItem,
        _id: resObj.insertedId.toString()
    }
    ctx.body = res;
}

export const removeItem = async (ctx: Context) => {
    const id = new ObjectId(JSON.parse(ctx.request.body));
    await todosCollection.deleteOne({_id: id});
    ctx.body = ctx.request.body;
}

export const toggleItem = async (ctx: Context) => {
    const id = new ObjectId(JSON.parse(ctx.request.body));
    const currentItem = await todosCollection.findOne({_id: id});
    await todosCollection.findOneAndUpdate({_id: id}, {$set: {completed: !currentItem.completed}})
    ctx.body = id;
}

export const toggleAll = async (ctx: Context) => {
    const accessToken = ctx.header.authorization.split(' ')[1]
    const userId = getUserId(accessToken)

    if(JSON.parse(ctx.request.body)) {
        await todosCollection.updateMany({userId}, {$set: { completed: false}});
        await getTodos(ctx);
    } else {
        await todosCollection.updateMany({userId}, {$set: { completed: true}});
        await getTodos(ctx);
    }
}

export const deleteCompleted = async (ctx: Context) => {
    const accessToken = ctx.header.authorization.split(' ')[1]
    const userId = getUserId(accessToken)

    await todosCollection.deleteMany({
        userId,
        completed: true
    });
    await getTodos(ctx);
}

export const editTodo = async (ctx: Context) => {
    const obj = JSON.parse(ctx.request.body);
    const id = new ObjectId(obj.id);
    await todosCollection.updateOne({_id: id}, {$set: { value: obj.value}});
    ctx.body = ctx.request.body;
}
 
 