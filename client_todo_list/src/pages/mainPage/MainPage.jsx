import React, { useState, useEffect } from "react";
import { web3, todoListContract } from "../../web3";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Form, Button, Modal } from "react-bootstrap";
import "./MainPage.css";

function MainPage() {
  const [loading, setLoading] = useState(true);
  const [taskCount, setTaskCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskIsImportant, setNewTaskIsImportant] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [completionStatus, setCompletionStatus] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsModalShow, setTaskDetailsModalShow] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notCompletedTasks, setNotCompletedTasks] = useState([]);


  useEffect(() => {
    loadTasks();
    setLoading(false);
  }, []);

  const loadTasks = async () => {
    setLoading(true);

    try {
      const count = await todoListContract.methods.taskCount().call();
      console.log(parseInt(count, 10));
      setTaskCount(parseInt(count, 10));

      const taskPromises = [];

      for (let i = count; i >= 1; i--) {
        taskPromises.push(todoListContract.methods.tasks(i).call());
      }

      const loadedTasks = await Promise.all(taskPromises);
      setNotCompletedTasks(loadedTasks.filter((task) => !task.completed));
      setCompletedTasks(loadedTasks.filter((task) => task.completed));
      setTasks(loadedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    const accounts = await web3.eth.getAccounts();

    await todoListContract.methods
      .createTask(newTaskTitle, newTaskContent, newTaskIsImportant)
      .send({
        from: accounts[0],
        gas: 99999999,
      });

    setNewTaskTitle("");
    setNewTaskContent("");
    setNewTaskIsImportant(false);
    setShowCreateModal(false);
    loadTasks();
  };

  const openUpdateModal = (taskId) => {
    setSelectedTaskId(taskId);

    var selectedTask = tasks.find(
      (task) => parseInt(task.id, 10) === parseInt(taskId, 10)
    );
    console.log(parseInt(taskId, 10));
    console.log(selectedTask);
    console.log(selectedTask.title);
    setNewTaskTitle(selectedTask.title);
    setNewTaskContent(selectedTask.content);
    setNewTaskIsImportant(selectedTask.isImportant);
    setCompletionStatus(selectedTask.completed);

    setUpdateModalShow(true);
  };

  const updateTask = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Updating task")

    await todoListContract.methods
      .updateTask(
        selectedTaskId,
        newTaskTitle,
        newTaskContent,
        newTaskIsImportant,
        completionStatus
      )
      .send({
        from: accounts[0],
        gas: 99999999,
      }).then(()=>{
        console.log("Then: ")
        setNewTaskTitle("");
        setNewTaskContent("");
        setNewTaskIsImportant(false);
        setCompletionStatus(false);
        setUpdateModalShow(false);
        loadTasks();
      })
  };

  const cancelUpdateTask = () => {
    setNewTaskTitle("");
    setNewTaskContent("");
    setNewTaskIsImportant(false);
    setCompletionStatus(false);
    setUpdateModalShow(false);
    setUpdateModalShow(false);
  };

  const deleteTask = async (taskId, taskTitle) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete task ${taskTitle} ?`
    );
    if (shouldDelete) {
      const accounts = await web3.eth.getAccounts();

      await todoListContract.methods.deleteTask(taskId).send({
        from: accounts[0],
        gas: 99999999,
      });

      loadTasks();
    }
  };

  const openTaskDetailsModal = (task) => {
    setSelectedTask(task);
    setTaskDetailsModalShow(true);
  };

  //const notCompletedTasks = tasks.filter((task) => !task.completed);
 // const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Todo List</h1>
      <Button
        variant="primary"
        onClick={() => setShowCreateModal(true)}
        className="mb-3 p-5 pt-3 pb-3"
      >
        Create New Task
      </Button>
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header className="bg-dark" closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-info">
          <Form className="text-dark mb-4 bg-warning m-3 p-3 border rounded border-3 border-primary">
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                className="mb-3"
                type="text"
                placeholder="Enter new task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                className="mb-3"
                type="text"
                placeholder="Enter new task content"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Is Important"
                checked={newTaskIsImportant}
                onChange={(e) => setNewTaskIsImportant(e.target.checked)}
              />
            </Form.Group>
            <div className="d-flex justify-content-around">
              <Button
                className="p-5 pt-2 pb-2"
                variant="primary"
                onClick={createTask}
              >
                Add Task
              </Button>
              <Button
                className="p-5 pt-2 pb-2"
                variant="info"
                onClick={() => {
                  setShowCreateModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="">
          <p>Total tasks: {taskCount}</p>
          <div className="row">
            <div className="col-md-6">
              <h2>Not Completed Tasks ({notCompletedTasks.length})</h2>
              {notCompletedTasks?.map((task) => (
                <Card
                  key={task.id}
                  className={`mb-4 ${
                    task.isImportant ? "bg-danger" : "bg-info"
                  }`}
                >
                  <Card.Body>
                    <div
                      className="d-flex justify-content-center "
                      onClick={() => openTaskDetailsModal(task)}
                      style={{ cursor: "pointer" }}
                    >
                      <Card.Title>{task.title}</Card.Title>
                    </div>
                    {task.isImportant && (
                      <div className="text-center text-warning ms-2">
                        Important
                      </div>
                    )}
                    <div className="d-flex justify-content-around m-2">
                      <Button
                        className="p-5 pt-3 pb-3"
                        variant="primary"
                        onClick={() => openUpdateModal(task.id)}
                      >
                        Update
                      </Button>
                      <Button
                        className="p-5 pt-3 pb-3"
                        variant={`${task.isImportant ? "warning" : "danger"}`}
                        onClick={() => deleteTask(task.id, task.title)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div className="col-md-6">
              <h2>Completed Tasks ({completedTasks.length})</h2>
              {completedTasks.map((task) => (
                <Card key={task.id} className="mb-4 bg-primary">
                  <Card.Body>
                    <div
                      className="d-flex justify-content-center"
                      onClick={() => openTaskDetailsModal(task)}
                      style={{ cursor: "pointer" }}
                    >
                      <Card.Title>{task.title}</Card.Title>
                    </div>
                    {task.isImportant && (
                      <div className="text-center text-danger ms-2">
                        Important
                      </div>
                    )}
                    <div className="d-flex justify-content-around m-2">
                      <Button
                        className="p-5 pt-3 pb-3"
                        variant="light"
                        onClick={() => openUpdateModal(task.id)}
                      >
                        Update
                      </Button>
                      <Button
                        className="p-5 pt-3 pb-3"
                        variant="danger"
                        onClick={() => deleteTask(task.id, task.title)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
          <Modal
            show={taskDetailsModalShow}
            onHide={() => setTaskDetailsModalShow(false)}
          >
            <Modal.Header className="bg-dark" closeButton>
              <Modal.Title>Task Details</Modal.Title>
            </Modal.Header>
            <Modal.Body
              className={`${
                selectedTask?.isImportant ? "bg-warning" : "bg-primary"
              }`}
            >
              {selectedTask && (
                <div>
                  <p>Title: {selectedTask.title}</p>
                  <p>Content: {selectedTask.content}</p>
                  <p>Is Important: {selectedTask.isImportant ? "Yes" : "No"}</p>
                  <p>Completed: {selectedTask.completed ? "Yes" : "No"}</p>
                </div>
              )}
            </Modal.Body>
          </Modal>
          <Modal
            className="text-dark"
            show={updateModalShow}
            onHide={cancelUpdateTask}
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Task</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-secondary">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter new task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter new task content"
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Is Important"
                    checked={newTaskIsImportant}
                    onChange={(e) => setNewTaskIsImportant(e.target.checked)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Is Completed"
                    checked={completionStatus}
                    onChange={(e) => setCompletionStatus(e.target.checked)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-around">
                  <Button
                    className="m-3 p-5 pt-2 pb-2"
                    variant="primary"
                    onClick={updateTask}
                  >
                    Update
                  </Button>
                  <Button
                    className="m-3 p-5 pt-2 pb-2"
                    variant="info"
                    onClick={cancelUpdateTask}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default MainPage;
