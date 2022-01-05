import { ObjectId } from "mongodb";

export const updateUI = (todos, response) => {
    todos.find().toArray((err, user) => {
        err ? console.log('error', err) : null;
        response.end(JSON.stringify(user));
    });
}
export const addData = (todos, body, response) => {
    const newTodoItem = {
        completed: false,
        value: JSON.parse(body)
    }
    todos.insertOne(newTodoItem);
    updateUI(todos, response);
}
export const removeItem = (body, todos, response) => {
    const id = new ObjectId(JSON.parse(body));
    todos.deleteOne({_id: id});
    updateUI(todos, response);
}
export const toggleItem = (todos, body, response) => {
    async function toggleItem() {
        const id = new ObjectId(JSON.parse(body));
        const currentItem = await todos.findOne({_id: id});
        todos.findOneAndUpdate({_id: id}, {$set: {completed: !currentItem.completed}})
        updateUI(todos, response);
    }
    toggleItem();
}
export const toggleAll = (body, todos, response) => {
    if(JSON.parse(body)) {
        todos.updateMany({}, {$set: { completed: false}});
        updateUI(todos, response);
    } else {
        todos.updateMany({}, {$set: { completed: true}});
        updateUI(todos, response);
    }
}
export const deleteCompleted = (todos, response) => {
    todos.deleteMany({completed : true});
    updateUI(todos, response);
}
export const editTodo = (body, todos, response) => {
    const obj = JSON.parse(body);
    const id = new ObjectId(obj.id);
    todos.updateOne({_id: id}, {$set: { value: obj.value}});
    updateUI(todos, response);
}
 