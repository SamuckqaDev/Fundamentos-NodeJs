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

//get balance sum or subtraction;
function getBalance(statement) {
  let initialValue = 0;

  //traverse array and returno sum values;
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, initialValue);

  return balance;
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

//Route to deposit
app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;

  const { customer } = request;

  //Object statementOperation;
  const statementOperation = {
    description,
    amount,
    createAt: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

//Route withdrawal;
app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  //verify if balance < amount;
  if (balance < amount) {
    return response.status(400).json({ error: "Insufficient Founds !" });
  }

  //Object with type operation;
  const statementOperation = {
    amount,
    createAt: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

//List port to access datas;
app.listen(3333);
