import { ObjectId } from "mongodb";
import { todosCollection, usersCollection } from "../connectToDB/connectToDB";
import {Context} from 'koa';

export const getTodos = async (ctx: Context) => {
    const array = await todosCollection.find({}).toArray();
    if(array) {
        ctx.body = array;
    } else {
        throw new Error('Could not get data');
    }  
}

export const addData = async (ctx: Context) => {
    const newTodoItem = {
        completed: false,
        value: JSON.parse(ctx.request.body).trim()
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
    if(JSON.parse(ctx.request.body)) {
        await todosCollection.updateMany({}, {$set: { completed: false}});
        await getTodos(ctx);
    } else {
        await todosCollection.updateMany({}, {$set: { completed: true}});
        await getTodos(ctx);
    }
}

export const deleteCompleted = async (ctx: Context) => {
    await todosCollection.deleteMany({completed : true});
    await getTodos(ctx);
}

export const editTodo = async (ctx: Context) => {
    const obj = JSON.parse(ctx.request.body);
    const id = new ObjectId(obj.id);
    await todosCollection.updateOne({_id: id}, {$set: { value: obj.value}});
    ctx.body = ctx.request.body;
}
 
export const sendCredentials = async(ctx: Context) => {
    const obj = JSON.parse(ctx.request.body);
    const res = await usersCollection.insertOne(obj);
    console.log(res);
}