const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Function to initialize tasks file with an empty array if it's empty
function initializeTasksFile() {
    try {
        if (!fs.existsSync(TASKS_FILE)) {
            fs.writeFileSync(TASKS_FILE, '[]');
            console.log("Tasks file initialized successfully.");
        }
    } catch (err) {
        console.error("Error initializing tasks file:", err);
    }
}

// Initialize tasks file
initializeTasksFile();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function loadTasks() {
    try {
        const tasksData = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(tasksData);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // File doesn't exist or is empty, return empty array
            return [];
        }
        console.error("Error loading tasks:", err);
        return [];
    }
}

function saveTasks(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error("Error saving tasks:", err);
    }
}

function addTask(task) {
    const tasks = loadTasks();
    tasks.push({ task, completed: false });
    saveTasks(tasks);
    console.log("Task added successfully!");
}

function viewTasks() {
    const tasks = loadTasks();
    console.log("Tasks:");
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. [${task.completed ? 'X' : ' '}] ${task.task}`);
    });
}

function markTaskAsComplete(index) {
    const tasks = loadTasks();
    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = true;
        saveTasks(tasks);
        console.log("Task marked as complete!");
    } else {
        console.error("Invalid task index!");
    }
}

function removeTask(index) {
    const tasks = loadTasks();
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        console.log("Task removed successfully!");
    } else {
        console.error("Invalid task index!");
    }
}

function prompt() {
    rl.question("Enter command (add/view/mark/remove/exit): ", (command) => {
        switch (command.toLowerCase()) {
            case 'add':
                rl.question("Enter task: ", (task) => {
                    addTask(task);
                    prompt();
                });
                break;
            case 'view':
                viewTasks();
                prompt();
                break;
            case 'mark':
                rl.question("Enter task index to mark as complete: ", (index) => {
                    markTaskAsComplete(parseInt(index) - 1);
                    prompt();
                });
                break;
            case 'remove':
                rl.question("Enter task index to remove: ", (index) => {
                    removeTask(parseInt(index) - 1);
                    prompt();
                });
                break;
            case 'exit':
                rl.close();
                break;
            default:
                console.log("Invalid command!");
                prompt();
                break;
        }
    });
}

// Start the application
console.log("Welcome to Task Manager!");
prompt();
