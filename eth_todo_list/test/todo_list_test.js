const TodoList = artifacts.require("TodoList");

contract("TodoList", (accounts) => {
  let todoListInstance;

  before(async () => {
    todoListInstance = await TodoList.deployed();
  });

  it("should create a new task", async () => {
    const initialTaskCount = await todoListInstance.taskCount();
    await todoListInstance.createTask("New Task", "Task Content", false);
    const newTaskCount = await todoListInstance.taskCount();

    assert.equal(newTaskCount, initialTaskCount.toNumber() + 1, "Task count should increase by 1");
  });

  it("should update an existing task", async () => {
    const taskId = 1; // Assuming there's at least one task created in the constructor
    const newTitle = "Updated Task";
    const newContent = "Updated Content";
    const isImportant = false;
    const completed = true;

    await todoListInstance.updateTask(taskId, newTitle, newContent, isImportant, completed);

    const updatedTask = await todoListInstance.tasks(taskId);

    assert.equal(updatedTask.title, newTitle, "Task title should be updated");
    assert.equal(updatedTask.content, newContent, "Task content should be updated");
    assert.equal(updatedTask.isImportant, isImportant, "Task importance should be updated");
    assert.equal(updatedTask.completed, completed, "Task completion status should be updated");
  });

  it("should delete an existing task", async () => {
    const taskId = 2; // Assuming there's at least two tasks created in the constructor
    const initialTaskCount = await todoListInstance.taskCount();

    await todoListInstance.deleteTask(taskId);

    const newTaskCount = await todoListInstance.taskCount();
    assert.equal(newTaskCount, initialTaskCount.toNumber() - 1, "Task count should decrease by 1");
  });
});
