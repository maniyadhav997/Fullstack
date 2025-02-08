const express = require("express");
const { request } = require("http");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();


const dbPath = path.join(__dirname, "simpleTodo.db");

app.use(express.json());

let db;

const intialiseDbandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(4000, () => {
      console.log("Server is started on port 4000");
    });
  } catch (error) {
    console.error(`Error initializing database and server: ${error.message}`);
    process.exit(1);
  }
};

intialiseDbandServer();

app.get('/todos',async (request, response) => {
  const getTodos = `SELECT * FROM todos;`
  const todos =await db.all(getTodos);
  response.send(todos)

})

app.delete('/todos/:id', async (request, response) => {
  const {id} = request.params;
  const deleteTodos = `DELETE FROM todos WHERE id= ${id};`
   await db.run(deleteTodos)
   response.send("Todo Deleted")
})

app.post('/todos', async (request, response) => {
  const {title} = request.body;
  const postQuery = `INSERT INTO todos (title)
    VALUES ('${title}');`
  await db.run(postQuery)
  response.send("Todo Added Successfully")
})