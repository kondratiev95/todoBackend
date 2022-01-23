import { ObjectId } from "mongodb";
import { todosCollection } from "./connectDB.js";

export const getTodos = async (ctx) => {
    const array = await todosCollection.find({}).toArray();
    if(array) {
        ctx.body = "Hello world";
    } else {
        throw new Error('Could not get data');
    }
     
}
export const addData = async (ctx) => {
    const newTodoItem = {
        completed: false,
        value: JSON.parse(ctx.body).trim()
    }
    await todosCollection.insertOne(newTodoItem);
    getTodos(ctx);
}
export const removeItem = async (todosCollection, body, res) => {
    const id = new ObjectId(JSON.parse(body));
    await todosCollection.deleteOne({_id: id});
    getTodos(todosCollection, res);
}
export const toggleItem = async (todosCollection, body, res) => {
    const id = new ObjectId(JSON.parse(body));
    const currentItem = await todosCollection.findOne({_id: id});
    await todosCollection.findOneAndUpdate({_id: id}, {$set: {completed: !currentItem.completed}})
    getTodos(todosCollection, res);
}
export const toggleAll = async (todosCollection, body, res) => {
    if(JSON.parse(body)) {
        await todosCollection.updateMany({}, {$set: { completed: false}});
        getTodos(todosCollection, res);
    } else {
        await todosCollection.updateMany({}, {$set: { completed: true}});
        getTodos(todosCollection, res);
    }
}
export const deleteCompleted = async (todosCollection, res) => {
    await todosCollection.deleteMany({completed : true});
    getTodos(todosCollection, res);
}
export const editTodo = async (todosCollection, body, res) => {
    const obj = JSON.parse(body);
    const id = new ObjectId(obj.id);
    await todosCollection.updateOne({_id: id}, {$set: { value: obj.value}});
    getTodos(todosCollection, res);
}
 