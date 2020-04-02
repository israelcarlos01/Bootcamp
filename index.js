const express = require("express");

const server = express();
server.use(express.json());
//Query params = ?teste=1
//Rout params = /users/1 (id do usuário que eu desejo acessar)
//request body = {"name": "Israel", "Email": "israelcarlos01@gmail.com"}
//CRUD - Create, Read, Update, Delete

const users = ["Israel", "Carlos", "Fernandes"];

/*O que é um middleware ? é uma função que recebe os parâmetros req e res
(pode receber outros parâmetros) e faz alguma coisa dentro da aplicação.
Manipula os dados da requisição e resposta de alguma forma.
*/
//middleware global, não importa a rota que utilizarmos ele será chamado.
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd("Request");
});
/*Esse Middleware vai no corpo da requisição e procura se existe a 
informação name(nome do usuário), se não encontrar, por conta do sinal de 
negação do if '!' ele vai retornar um erro para o usuário com a mensagem
'user name is required', caso não entre no if, a função vai chamar o middleware
da rota normalmente 'return next();'.
Obs: não é um middleware global tem que chamar na função. E na função pode ser chamado
quantos middleware for necessário.
*/

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }
  req.user = user;

  return next();
}

//Route for creation to CRUD =)
server.get("/users", (req, res) => {
  return res.json(users);
});
//Exemplo Query params
server.get("/teste", (req, res) => {
  const nome = req.query.nome;
  return res.json({ message: `Hello ${nome}` });
});
//Exemplo Rout params
//index é a posição do array que esta armazenada a informação
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});
server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  /*o metodo splice vai percorrer o vetor, chegando no 
  número que agente indicou, ele vai deletar N posições a partir do mesmo.
  No caso do exemplo vai deletar uma posição a partir do índice que indicarmos...
  */
  users.splice(index, 1);
  return res.send();
});
//localhost:3000/teste
server.listen(3000);
