import { ObjectId } from "mongodb";

export const updateUI = async (todos, res) => {
    const array = await todos.find({}).toArray();
    res.end(JSON.stringify(array));
}
export const addData = async (todos, body, res) => {
    const newTodoItem = {
        completed: false,
        value: JSON.parse(body)
    }
    await todos.insertOne(newTodoItem);
    updateUI(todos, res);
}
export const removeItem = async (todos, body, res) => {
    const id = new ObjectId(JSON.parse(body));
    await todos.deleteOne({_id: id});
    updateUI(todos, res);
}
export const toggleItem = async (todos, body, res) => {
    const id = new ObjectId(JSON.parse(body));
    const currentItem = await todos.findOne({_id: id});
    await todos.findOneAndUpdate({_id: id}, {$set: {completed: !currentItem.completed}})
    updateUI(todos, res);
}
export const toggleAll = async (todos, body, res) => {
    if(JSON.parse(body)) {
        await todos.updateMany({}, {$set: { completed: false}});
        updateUI(todos, res);
    } else {
        await todos.updateMany({}, {$set: { completed: true}});
        updateUI(todos, res);
    }
}
export const deleteCompleted = async (todos, res) => {
    await todos.deleteMany({completed : true});
    updateUI(todos, res);
}
export const editTodo = async (todos, body, res) => {
    const obj = JSON.parse(body);
    const id = new ObjectId(obj.id);
    await todos.updateOne({_id: id}, {$set: { value: obj.value}});
    updateUI(todos, res);
}
 