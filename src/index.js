//Import express framework;
const express = require("express");

const { v4: uuidV4 } = require("uuid");

//using express();
const app = express();

//Middleware to use JSON format code;
app.use(express.json());

//List port to access datas;
app.listen(3333);

const customers = [];

/*
 account data

 *CPF: string;
 *name: string;
 *id: uuid;
 *statement []; 
*/
//Route to create account;
app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  customers.push({
    cpf,
    name,
    id: uuidV4(),
    statement: [],
  });

  return response.send().status(201);
});
