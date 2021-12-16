//Import express framework;
const express = require("express");

//Import uuid version 4;
const { v4: uuidV4 } = require("uuid");

//using express();
const app = express();

//Middleware to use JSON format code;
app.use(express.json());

const customers = [];

//Middleware to verify if exists account;
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer not Found !" });
  }

  request.customer = customer;

  //If errorNotExists next() step;
  return next();
}

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

  const customerAlredyExixts = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlredyExixts) {
    return response.status(400).json({ error: "Customer alredy exists !" });
  }

  customers.push({
    cpf,
    name,
    id: uuidV4(),
    statement: [],
  });

  return response.send().status(201);
});

//get customer datas account;
app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

//List port to access datas;
app.listen(3333);
