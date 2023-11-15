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
    }

    function updateTask(
        uint _taskId,
        string memory _title,
        string memory _content,
        bool _isImportant,
        bool _completed
    ) public {
        require(_taskId > 0 && totalTaskCount >= _taskId);

        tasks[_taskId].title = _title;
        tasks[_taskId].content = _content;
        tasks[_taskId].isImportant = _isImportant;
        tasks[_taskId].completed = _completed;
    }

    function deleteTask(uint _taskId) public {
        require(_taskId > 0 && totalTaskCount >= _taskId);

        tasks[_taskId] = tasks[taskCount];
        delete tasks[taskCount];
        taskCount--;
    }
}
