import express from 'express';
import Usuario from  './models/Usuario';

const app = express();

app.use(express.json());


let usuario: Usuario[] = [];
let fila: Usuario[] = []; 
let id:number = 0;

app.post('/createUser', (req,res) => {
  
  const dados = req.body;
  
  let usuarioExists = usuario.find(user => user.email === req.body.email);

  if(usuarioExists)
  {
    return res.json({ message: "Email já cadastrado!"});
  }

  const dadosFinal = {
    id: ++id,
    ...dados
  }

  usuario.push(dadosFinal);

  console.log(usuario);

  return res.json(dadosFinal)
});



app.post('/addToLine',(req,res)=>{

  const id = req.body.id;

  const usuarioFiltrado = usuario.find(user => user.id === id);

  let usuarioExists = fila.find(user => user.id === id);

  if(usuarioExists)
  {
    return res.json({ message: "Usuário já está na fila!"});
  }

  if(!usuarioFiltrado)
  {
    return res.json({ message: "Usuário não cadastrado"});
  }

  fila.push(usuarioFiltrado);

  const posicao = fila.findIndex((user, index, array) => user.id === id)
  console.log(fila);

  return res.json({"Posição": (posicao + 1) });
}); 


app.post('/findPosition', (req,res) => {
  const email = req.body.email;
  const posicao = fila.findIndex((user, index, array) => user.email === email)


  return res.json({"Posição": (posicao + 1) })
});


app.get('/showLine', (req,res) => {

  const dados = fila.map((user, index) => {
    return {
      posicao: (index + 1),
      ...user
    }
  })

  return res.json(dados);
});


app.get('/popLine', (req,res) => {
  const dados = fila.splice(0,1);
  return res.json(dados);
});



app.post('/filterLine',(req,res) => {
  const genero = req.body.genero;

  let filaFiltrado = fila.map((user, index) => {
    if(user.genero === genero)
    {
      return{
        posicao: (index + 1),
        ...user
      }
    }
  });

  const filaFinal = filaFiltrado.filter(user => user != null);

  return res.json(filaFinal);
});



app.listen(3000,() => {
  console.log("Server Running");
})