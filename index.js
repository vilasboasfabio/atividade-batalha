const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = 4000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "batalhas",
  password: "Junior07",
  port: 5432,
});

app.use(express.json());

app.post('/barraqueiros', async (req, res) => {
    const { nome, classe, nivel, vida, deboche, forca, recalque, frase } = req.body;
    const query = `INSERT INTO barraqueiros (nome, classe, nivel, vida, deboche, forca, recalque, frase) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const values = [nome, classe, nivel, vida, deboche, forca, recalque, frase ];
    try{
      const result = await pool.query(query, values);
      res.status(201).json(result.rows);
    }catch(error){
        console.error('Erro ao criar o barraqueiro:', error)
        res.status(500).json({
            message: 'Erro ao criar o barraqueiro'
        });

    }
});

app.get('/barraqueiros', async (req, res) => {
    const query = `SELECT * FROM barraqueiros`;
    try{
        const result = await
        pool.query(query);
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Erro ao buscar os barraqueiros:', error)
        res.status(500).json({
            message: 'Erro ao buscar os barraqueiros'
        });

    }
}
);


app.get('/barraqueiros/:id', async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM barraqueiros WHERE id = $1`;
    const values = [id];
    try{
        const result = await
        pool.query(query, values);
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Erro ao buscar o barraqueiro:', error)
        res.status(500).json({
            message: 'Erro ao buscar o barraqueiro'
        });

    }
}
);



app.listen(port, () => {
    console.log(`Bafafa na porta ${port} 😈`);
  });