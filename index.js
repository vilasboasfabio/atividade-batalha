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
    const { nome, idade, classe, nivel, vida, deboche, forca, recalque, fase } = req.body;
    const query = `INSERT INTO barraqueiros (nome, idade, classe, nivel, vida, deboche, forca, recalque, fase) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const values = [nome, idade, classe, nivel, vida, deboche, forca, recalque, fase ];
    try{
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
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

