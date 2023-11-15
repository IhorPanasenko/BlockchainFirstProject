const TodoList = artifacts.require("TodoList");

contract("TodoList", (accounts) => {
  let todoListInstance;

  before(async () => {
    todoListInstance = await TodoList.deployed();
  });

  it("should create a new task", async () => {
    const initialTaskCount = await todoListInstance.taskCount();

    await todoListInstance.createTask("New Task Title", "New Task Content", true);

    const updatedTaskCount = await todoListInstance.taskCount();
    assert.equal(updatedTaskCount.toNumber(), initialTaskCount.toNumber() + 1, "Task count should increase by 1");
  });

  it("should update a task", async () => {
    await todoListInstance.createTask("New Task Title", "New Task Content", true);
    const taskId = 1;

    const originalTask = await todoListInstance.tasks(taskId);
    await todoListInstance.updateTask(taskId, "Updated Title", "Updated Content", false, true);

    const updatedTask = await todoListInstance.tasks(taskId);
    assert.equal(updatedTask.title, "Updated Title", "Title should be updated");
    assert.equal(updatedTask.content, "Updated Content", "Content should be updated");
    assert.equal(updatedTask.isImportant, false, "isImportant should be updated");
    assert.equal(updatedTask.completed, true, "completed should be updated");
  });

  it("should delete a task", async () => {
    await todoListInstance.createTask("New Task Title", "New Task Content", true);
    const taskId = 1;

    const initialTaskCount = await todoListInstance.taskCount();
    await todoListInstance.deleteTask(taskId);

    const updatedTaskCount = await todoListInstance.taskCount();
    assert.equal(updatedTaskCount.toNumber(), initialTaskCount.toNumber() - 1, "Task count should decrease by 1");
  });
});
