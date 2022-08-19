// import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
// import * as requestUtils from "../utils/requestUtils.js";
import { doze } from 'https://deno.land/x/doze/mod.ts';


import { executeQuery } from "../database/database.js";

const MAX_LENGTH = 140;

// const responseDetails = {
//   headers: { "Content-Type": "text/html;charset=UTF-8" },
// };

const initial_todos = [
  {
    id: 2,
    content: "Exercise 4.04: Project v1.8",
  },
  {
    id: 3,
    content: "Exercise 4.05: Project v1.9",
  },
  {
    id: 4,
    content: "Exercise 4.06: Project v2.0",
  },
  {
    id: 5,
    content: "Exercise 4.08: Project v2.1",
  },
  {
    id: 6,
    content: "Part 5",
  },
];

let db_present = false;
let db_init_in_progress = false;

const initTodoTable = async () => {
  if (db_init_in_progress){
    return;
  }
  db_init_in_progress = true;
  while (!db_present){
    try {  
      // let item;
      let db1_response = await executeQuery(
        `CREATE TABLE IF NOT EXISTS todos(
          id SERIAL PRIMARY KEY,
          content VARCHAR(140)
        );`,
      );
      console.log("db setup response:\n", db1_response);

      db1_response = await executeQuery(
        `ALTER TABLE todos ADD COLUMN IF NOT EXISTS
          "done" BOOLEAN NOT NULL DEFAULT FALSE;`,
      );
      console.log("db add new column response:\n", db1_response);
      
      db1_response = await executeQuery(
        `SELECT COUNT(content) FROM
          todos
        ;`,
      );
      if ('error' in db1_response){
        throw 'db NOT ready 1!';
      }

      // console.log("number of rows...", db1_response);
      // { rows: [ { count: 1n } ] }
      const n = Number(db1_response.rows[0].count);
      console.log("...Number of rows:", n);

      // array.forEach((value) => {
      //   console.log(value);
      // });

      if (n < 1) {
        initial_todos.forEach(async (item) => {
          // console.log("item is:", item);
          // console.log(item.id, " , ", item.content);
          // Adding a few initial Todos, if db empty
          db1_response = await executeQuery(
            `INSERT INTO todos (content) VALUES ('${item.content}');`,
          );
          // console.log("response was", db1_response);
        });
      }
      if ('error' in db1_response){
        throw 'db NOT ready 2!';
      }

      db1_response = await executeQuery(
        `SELECT COUNT(content) FROM
          todos
        ;`,
      );
      if ('error' in db1_response){
        throw 'db NOT ready 3!';
      }

      console.log('almost done');
      db_init_in_progress = false;
      db_present = true;
      console.log('db setup done!');
  

    } catch(e) {
      console.log('error:', e)
      await doze(5);
      // console.log('error: after doze!')
    }
  }
};

const dbAlive = async () => {
  // console.log("inner health check", db_present);

  if (!db_present) {
    console.log('db not present error...');
    if (!db_init_in_progress){
      initTodoTable();
    }
    return 500
  }

  try {
    const db1_response = await executeQuery(
      `SELECT COUNT(content) FROM
        todos
      ;`,
    );
    if ('error' in db1_response){
      throw 'db NOT ready @dbAlive!';
    }
  } catch(e) {
    console.log('healthz err', e);
    db_present = false;
    return 500
  }
  return 200;
};


// const listTodos = async ({ request, response }) => {
// const listTodos = async ({ response }) => {
const listTodos = async ({ request }) => {
  // console.log("remember curly braces!");
  console.log("GET requeset to:", request.url.href);

  let _db_todos = [];
  const db_response = await executeQuery(
    `SELECT * FROM
      todos
      ORDER BY id
    ;`,
  );

  // console.log("response all todos:\n", db_response);
  // const data = {
  //   todos: db_todos,
  // };

  _db_todos = db_response.rows;
  return _db_todos;
  // response.headers.set('Content-Type', 'application/json')
  // return initial_todos;
  // response.body = initial_todos; // auto json!
  // return new Response(JSON.stringify(todos), jsonResponseDetails);
};

const getTodo = async ({ params, response }) => {
  // console.log("GET requeset to...");
  console.log("Parameters were as follows:");
  console.log(params);
  console.log(`The value of the id extracted from path is: ${params.id}`);
  try {
    let _db_todos = [];
    const nid = +(params.id);
    console.log("PUT requeset to id", nid);
    if (isNaN(nid)){
      throw 'bad id';
    }
    const db_response = await executeQuery(
      `SELECT * FROM
        todos
        WHERE id=$1
      ;`, nid
    );
    response.status = 201;
    response.body = db_response.rows;
    _db_todos = db_response.rows;
    return _db_todos;
  } catch {
    response.status = 401;
    response.body = _db_todos;
    return _db_todos;
  }
};

const putTodo = async ({ params, response }) => {
  console.log("PUT requeset to...",params);
  try {
    const nid = +(params.id);
    console.log("PUT requeset to id", nid);
    if (isNaN(nid)){
      throw 'bad id';
    }
    let db_response = await executeQuery(
      `SELECT done FROM
        todos
        WHERE id=$1
      ;`, nid
    );
    if (db_response && db_response.rows && db_response.rows[0]){
      console.log('todo exists', nid, db_response);
      db_response = await executeQuery(
        `UPDATE todos
          SET done=$1
          WHERE id=$2
          RETURNING *
        ;`, true, nid
      );
      // console.log('test of RETURNING *:', db_response);
      // db_response = await executeQuery(
      //   `SELECT * FROM
      //     todos
      //     WHERE id=$1
      //   ;`, nid
      // );
    } else {
      console.log('todo does not exist', nid, db_response);
      throw 'something went wrong'
    }
    response.status = 201;
    response.body = db_response.rows;
  } catch(error) {
    console.log('error->', error, '<-error')
    response.status = 503;
    const bad = {
      id: 666666666,
      done: true,
      content: "",  
    }
    response.body = bad;
  }
};

const delTodo = async ({ params, response }) => {
  console.log("DELETE requeset not yet fully tested");
  try {
    const nid = +(params.id);
    console.log("DELETE requeset to id", nid);
    if (isNaN(nid)){
      throw 'bad id';
    }
    console.log("DELETE requeset pre query");
    const db_response = await executeQuery(
      `DELETE FROM
        todos
        WHERE id=$1
      ;`, nid
    );
    console.log("DELETE requeset post query", db_response);
    response.status = 202;
    response.body = db_response.rows;
  } catch(error) {
    console.log('error->', error, '<-error')
    response.status = 503;
  }
};

const newTodo = async ({ request, response }) => {
  const newTodo = {
    id: 999,
    done: false,
    content: "dummy empty todo",
  };

  if (request.body) {
    // console.log("Body:\n", request.body());

    const body = request.body();
    // console.log("The type of the request body is:");
    // console.log(body.type);

    // note, this is not a function call!
    const params = await body.value;
    // console.log("Params are as follows:");
    // console.log(params);
    console.log(request.url.href, "New todo request with content:");
    console.log(params.content);

    // console.log(params.get("content"));
    // console.log(params.get.todo);
    // console.log("next step, updating...");

    // const todoText = params.get("todo");
    const todoText = params.content;
    if (todoText && todoText.length > 0 && todoText.length <= MAX_LENGTH) {
      // console.log("length ok");
      newTodo.content = todoText;

      // refactor to params ASAP!
      const new_id = await executeQuery(
        `INSERT INTO todos (content) VALUES ($1)
          RETURNING id;`,
        todoText,
      );
      
      const id = new_id.rows[0].id;
      console.log("Updated todos! id:", id);
      newTodo.id = id;
      response.body = newTodo;
    } else {
      console.log("Rejected!");
      // response.status = 400; // maybe not a good idea...
      response.status = 422; // better?
      response.body = { bad_request: "422" };
    }
  }

  // response.type = 200;
  // response.body = initial_todos;
};

// export { listTodos, newTodo, viewTodos, initTodoTable };
export { initTodoTable, listTodos, getTodo, putTodo, delTodo, newTodo, dbAlive };
