import { ObjectId } from "mongodb";
import { todosCollection } from "../connectToDB/connectToDB.js";

export const getTodos = async (ctx) => {
    const array = await todosCollection.find({}).toArray();
    if(array) {
        ctx.body = array;
    } else {
        throw new Error('Could not get data');
    }  
}

export const addData = async (ctx) => {
    const newTodoItem = {
        completed: false,
        value: JSON.parse(ctx.request.body).trim()
    }
    await todosCollection.insertOne(newTodoItem);
    await getTodos(ctx);
}

export const removeItem = async (ctx) => {
    const id = new ObjectId(JSON.parse(ctx.request.body));
    await todosCollection.deleteOne({_id: id});
    await getTodos(ctx);
}

export const toggleItem = async (ctx) => {
    const id = new ObjectId(JSON.parse(ctx.request.body));
    const currentItem = await todosCollection.findOne({_id: id});
    await todosCollection.findOneAndUpdate({_id: id}, {$set: {completed: !currentItem.completed}})
    await getTodos(ctx);
}

export const toggleAll = async (ctx) => {
    if(JSON.parse(ctx.request.body)) {
        await todosCollection.updateMany({}, {$set: { completed: false}});
        await getTodos(ctx);
    } else {
        await todosCollection.updateMany({}, {$set: { completed: true}});
        await getTodos(ctx);
    }
}

export const deleteCompleted = async (ctx) => {
    await todosCollection.deleteMany({completed : true});
    await getTodos(ctx);
}

export const editTodo = async (ctx) => {
    const obj = JSON.parse(ctx.request.body);
    const id = new ObjectId(obj.id);
    await todosCollection.updateOne({_id: id}, {$set: { value: obj.value}});
    await getTodos(ctx);
}
 