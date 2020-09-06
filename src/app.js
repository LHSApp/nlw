var express = require('express');
var app = express();




// pegar o banco de dados

var db = require('./database/db')

// configurar pasta publica

app.use(express.static('public'))

// Habilitar o uso req  .body na nossa aplicação

app.use(express.urlencoded({ extended: true }))

// utilizando template engine

var nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
  express: app,
  noCache: true,
})

// configurar caminhos da minha aplicação
// página inicial
// rep requisição
// res resposta
app.get('/', (req, res) => {
  return res.render('index.html', { title: ' Market Place' })
})



app.get('/create-point', (req, res) => {

 // req.query: Query Strings da nossa url

//console.log( req.query)

  return res.render('create-point.html', )
})

app.post('/savepoint', (req, res) => {

 // req.body: O coprpo do nosso formulário
  //console.log( req.body)

  // inserir dados no banco de dados 
  
 // 2 iserir dados natabela
  var query = `
    INSERT INTO places (
      image,
      name,
      address,
      address2,
      state,
      city,
      items 
     )  VALUES (?,?,?,?,?,?,?); 
    
    `

    var values = [
     req.body.image,
     req.body.name,
     req.body.address,
     req.body.address2,
     req.body.state,
     req.body.city,
     req.body.items
    ]


     function afterInsertData(err) {

      if(err) {
      console.log(err)
      return res.send('Erro no Cadastro')
      }
  
      console.log('Cadastro com sucesso')
      console.log(this)
      return res.render('create-point.html', {saved: true})

     }
   db.run(query, values, afterInsertData)

 
 
})


app.get('/search', (req, res) => {

  var search = req.query.search

  if(search == ''){
     // pesquisa vazia 
  
  return res.render('search-results.html', {total: 0})
  }



  // pegar dados do banco
   
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err) {
      return console.log(err)
    }

    console.log('Aqui estão seus registros')
    //console.log(rows)

    var total = rows.length

    // mostrar a página html com os dados do banco
  return res.render('search-results.html', { places: rows, total})
  })


})




var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Umbler listening on port %s', port);
});


