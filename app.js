const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 4000; // Altere a porta, se necessário

// Configurar conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'JOPA',
    database: 'JOPA'
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

// Configurar o mecanismo de visualização EJS
app.set('view engine', 'ejs');

// Analisar dados do corpo da solicitação
app.use(express.urlencoded({ extended: false }));

// Rota para exibir o formulário de registro de vendas
app.get('/registrar-venda', (req, res) => {
    res.sendFile(__dirname + '/formulario.html');
});


// Rota para processar o formulário de registro de vendas
app.post('/registrar-venda', (req, res) => {
    const {data, cliente, quantidade, forma_pagamento } = req.body;

    // Execute a inserção no banco de dados usando os dados do formulário
    const query = 'INSERT INTO vendas_brownies (data, cliente, quantidade, forma_pagamento) VALUES (?, ?, ?, ?)';
    const values = [ data, cliente, quantidade, forma_pagamento];

    // Log da query e dos valores
    console.log('Query:', query);
    console.log('Valores:', values);

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir venda no banco de dados:', err);
            return res.status(500).send('Erro ao processar a venda.');
        }
        console.log('Venda registrada com sucesso');
        res.redirect('/registrar-venda'); // Redirecionar para o formulário após o registro
    });
});

// Rota para listar vendas registradas
app.get('/vendas', (req, res) => {
    connection.query('SELECT id, date_format(data, "%d/%m/%Y") as data, cliente, quantidade, forma_pagamento FROM vendas_brownies', (err, results) => {
        if (err) {
            console.error('Erro ao buscar vendas no banco de dados:', err);
            return res.status(500).send('Erro ao buscar vendas.');
        }
        res.render('lista_vendas', { vendas: results });
    });
});

// Rota para deletar uma venda
app.get('/deletar-venda/:id', (req, res) => {
    const vendaId = req.params.id; // Obtém o ID da venda a ser excluída

    // Crie a consulta SQL para excluir a venda com base no ID
    const query = 'DELETE FROM vendas_brownies WHERE id = ?';

    // Execute a consulta SQL com o ID
    connection.query(query, [vendaId], (err, result) => {
        if (err) {
            // Lida com erros, por exemplo, exibindo uma mensagem de erro ou redirecionando para uma página de erro.
            console.error(err);
            res.redirect('/vendas'); // Redireciona de volta para a página de lista de vendas
        } else {
            console.log('Venda excluída com sucesso');
            res.redirect('/vendas'); // Redireciona de volta para a página de lista de vendas
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor Express está rodando na porta ${port}`);
});
