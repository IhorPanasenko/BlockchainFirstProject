// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {

    uint public taskCount = 0;
    uint public totalTaskCount = 0;

    struct Task {
        uint id;
        string title;
        string content;
        bool isImportant;
        bool completed;
    }

    mapping(uint => Task) public tasks;
    mapping(uint => uint) public taskIndexMapping; // Mapping from task ID to task index

    constructor() {
        createTask("This is the first task", "Sample Content", true);
    }

    function createTask(
        string memory _title,
        string memory _content,
        bool _isImportant
    ) public {
        taskCount++;
        totalTaskCount++;
        tasks[taskCount] = Task(
            totalTaskCount,
            _title,
            _content,
            _isImportant,
            false
        );
        taskIndexMapping[totalTaskCount] = taskCount;
    }

    function updateTask(
        uint _taskId,
        string memory _title,
        string memory _content,
        bool _isImportant,
        bool _completed
    ) public {
        uint taskIndex = taskIndexMapping[_taskId];
        require(taskIndex > 0 && totalTaskCount >= _taskId);

        tasks[taskIndex].title = _title;
        tasks[taskIndex].content = _content;
        tasks[taskIndex].isImportant = _isImportant;
        tasks[taskIndex].completed = _completed;
    }

    function deleteTask(uint _taskId) public {
        uint taskIndex = taskIndexMapping[_taskId];
        require(taskIndex > 0 && totalTaskCount >= _taskId);

        tasks[taskIndex] = tasks[taskCount];
        delete tasks[taskCount];
        //delete taskIndexMapping[_taskId];
        taskCount--;
    }
}
