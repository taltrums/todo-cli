import fs from 'fs';
import { Command, program } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const todoFilePath = path.join(__dirname, 'todos.json');


const loadTodos = () => {
  try {
    const todosJson = fs.readFileSync(todoFilePath, 'utf-8');
    return JSON.parse(todosJson);
  } catch (err) {
    console.error("Failed to load todos:", err);
    return [];
  }
};



const saveTodos = (todos) => {
  const todosJson = JSON.stringify(todos, null, 2);

  fs.writeFileSync(todoFilePath, todosJson, 'utf-8', (err) => {
    if (err) {
      console.error("Failed to save todos:", err);
    } else {
      console.log("Todos saved successfully.");
    }
  });
};


// const todos = [
//   {
//     text: 'Go to Gym',
//     done: true
//   }, 
//   {
//     text: 'Write a program',
//     done: false
//   }, 
//   {
//     text: 'Sleep',
//     done: false
//   }
// ];


// saveTodos(todos);

program
  .name('todo')
  .description('Manage your todos')
  .version('0.0.1');

program
  .command('list')
  .description('List all todos')
  .action(() => {
    const todos = loadTodos();
    if (todos.length == 0) {
      console.log(chalk.bold('No todos found.'));
    }
    console.log(chalk.bold('Your Todos:'));
    todos.forEach((todo, index) => {
      const status = todo.done ? chalk.green('✔') : chalk.red('✘');
      console.log(`${chalk.cyan(index + 1)}: ${status} ${chalk.white(todo.text)}`);
    });
  });

program
  .command('add')
  .description('Add a new todo')
  .argument('<text>', 'The text of the todo')
  .action((todo) => {
    const todos = loadTodos();
    todos.push({ text: todo, done: false });
    saveTodos(todos);
    console.log(chalk.green(`Added todo: ${todo}`));
  });


program
  .command('delete')
  .description('Delete a todo')
  .argument('[index]', 'The index of the todo to delete')
  .action((index) => {
    const todos = loadTodos();
    if (index < 1 || index > todos.length) {
      console.log(chalk.red(`Invalid index: ${index}`));
    } else {
      todos.splice(index - 1, 1);
      saveTodos(todos);
      console.log(chalk.green(`Deleted todo at index ${index}`));
    }
  });


program
  .command('done')
  .description('Mark a todo as done')
  .argument('[index]', 'The index of the todo to mark as done')
  .action((index) => {
    const todos = loadTodos();
    if (index < 1 || index > todos.length) {
      console.log(chalk.red(`Invalid index: ${index}`));
    } else {
      todos[index - 1].done = true;
      saveTodos(todos);
      console.log(chalk.green(`Marked todo at index ${index} as done`));
    }
  });


program
  .command('clear')
  .description('Clear all todos')
  .action(() => {
    saveTodos([]);
    console.log(chalk.green('Cleared all todos'));
  });



  program.parse(process.argv);