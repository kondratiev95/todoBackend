import { ObjectId } from "mongodb";

export const updateUI = async (todosCollection, res) => {
    const array = await todosCollection.find({}).toArray();
    res.end(JSON.stringify(array));
}
export const addData = async (todosCollection, body, res) => {
    const newTodoItem = {
        completed: false,
        value: JSON.parse(body).trim()
    }
    await todosCollection.insertOne(newTodoItem);
    updateUI(todosCollection, res);
}
export const removeItem = async (todosCollection, body, res) => {
    const id = new ObjectId(JSON.parse(body));
    await todosCollection.deleteOne({_id: id});
    updateUI(todosCollection, res);
}
export const toggleItem = async (todosCollection, body, res) => {
    const id = new ObjectId(JSON.parse(body));
    const currentItem = await todosCollection.findOne({_id: id});
    await todosCollection.findOneAndUpdate({_id: id}, {$set: {completed: !currentItem.completed}})
    updateUI(todosCollection, res);
}
export const toggleAll = async (todosCollection, body, res) => {
    if(JSON.parse(body)) {
        await todosCollection.updateMany({}, {$set: { completed: false}});
        updateUI(todosCollection, res);
    } else {
        await todosCollection.updateMany({}, {$set: { completed: true}});
        updateUI(todosCollection, res);
    }
}
export const deleteCompleted = async (todosCollection, res) => {
    await todosCollection.deleteMany({completed : true});
    updateUI(todosCollection, res);
}
export const editTodo = async (todosCollection, body, res) => {
    const obj = JSON.parse(body);
    const id = new ObjectId(obj.id);
    await todosCollection.updateOne({_id: id}, {$set: { value: obj.value}});
    updateUI(todosCollection, res);
}
 