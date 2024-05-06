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

    // Definir as classes válidas
    const classesValidas = ['Rainha do Deboche', 'Mestre do Recalque', 'Guerreiro da Fofoca', 'Mago do Veneno', 'Stalker', 'Fofoqueira do Bairro', 'Pick Me', 'Macho Tóxico', 'Militante'];

    // Verificar se a classe é válida
    if (!classesValidas.includes(classe)) {
        return res.status(400).json({
            message: `Classe inválida. As classes válidas são: ${classesValidas.join(', ')}`
        });
    }

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

app.put('/barraqueiros/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, classe, nivel, vida, deboche, forca, recalque, frase } = req.body;
    const query = `UPDATE barraqueiros SET nome = $1, classe = $2, nivel = $3, vida = $4, deboche = $5, forca = $6, recalque = $7, frase = $8 WHERE id = $9`;
    const values = [nome, classe, nivel, vida, deboche, forca, recalque, frase, id];
    try{
        const result = await
        pool.query(query, values);
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Erro ao atualizar o barraqueiro:', error)
        res.status(500).json({
            message: 'Erro ao atualizar o barraqueiro'
        });

    }
}
);

app.delete('/barraqueiros/:id', async (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM barraqueiros WHERE id = $1`;
    const values = [id];
    try{
        const result = await
        pool.query(query, values);
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Erro ao deletar o barraqueiro:', error)
        res.status(500).json({
            message: 'Erro ao deletar o barraqueiro'
        });

    }
}
);

app.get('/barraqueiros/nome/:nome', async (req, res) => {
    const { nome } = req.params;
    const query = `SELECT * FROM barraqueiros WHERE nome = $1`;
    const values = [nome];
    try{
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Barraqueiro não encontrado' });
        }
    }catch(error){
        console.error('Erro ao buscar o barraqueiro:', error)
        res.status(500).json({
            message: 'Erro ao buscar o barraqueiro'
        });
    }
});

app.get('/batalhas/:id1/:id2', async (req, res) => {
    const { id1, id2 } = req.params;
    try{
        // Buscar os barraqueiros
        const queryBarraqueiro = `SELECT * FROM barraqueiros WHERE id = $1`;
        const barraqueiro1 = (await pool.query(queryBarraqueiro, [id1])).rows[0];
        const barraqueiro2 = (await pool.query(queryBarraqueiro, [id2])).rows[0];

        // Definir os pontos extras por classe
        const pontosPorClasse = {
            'Rainha do Deboche': 100,
            'Mestre do Recalque': 20,
            'Guerreiro da Fofoca': 30,
            'Mago do Veneno': 40,
            'Stalker': 50,
            'Fofoqueira do Bairro': 90,
            'Pick Me': 50,
            'Macho Tóxico': 10,
            'Militante': 80
        };

        // Calcular a força total
        const forcaTotal1 = barraqueiro1.vida + barraqueiro1.deboche + barraqueiro1.forca - barraqueiro1.recalque + (pontosPorClasse[barraqueiro1.classe] || 0);
        const forcaTotal2 = barraqueiro2.vida + barraqueiro2.deboche + barraqueiro2.forca - barraqueiro2.recalque + (pontosPorClasse[barraqueiro2.classe] || 0);

        // Determinar o vencedor e o perdedor
        let vencedor, perdedor;
        if (forcaTotal1 > forcaTotal2) {
            vencedor = barraqueiro1;
            perdedor = barraqueiro2;
        } else {
            vencedor = barraqueiro2;
            perdedor = barraqueiro1;
        }

        // Salvar a batalha na tabela de batalhas
        const queryBatalha = `INSERT INTO batalhas (barraqueiro1, barraqueiro2, vencedor, rebaixada, frase_vencedor, data) VALUES ($1, $2, $3, $4, $5, NOW())`;
        const valuesBatalha = [id1, id2, vencedor.id, perdedor.id, vencedor.frase];
        await pool.query(queryBatalha, valuesBatalha);

        // Retornar o resultado da batalha
        res.status(200).json({
            message: `O vencedor é ${vencedor.nome} com a frase: ${vencedor.frase}`
        });
    }catch(error){
        console.error('Erro na batalha:', error)
        res.status(500).json({
            message: 'Erro na batalha'
        });
    }
});

app.get('/batalhas', async (req, res) => {
    const query = `SELECT * FROM batalhas`;
    try{
        const result = await
        pool.query(query);
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Erro ao buscar as batalhas:', error)
        res.status(500).json({
            message: 'Erro ao buscar as batalhas'
        });

    }
}
);

app.get('/batalhas/:id', async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM batalhas WHERE id = $1`;
    const values = [id];
    try{
        const result = await
        pool.query(query, values);
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Erro ao buscar a batalha:', error)
        res.status(500).json({
            message: 'Erro ao buscar a batalha'
        });

    }
}
);


app.listen(port, () => {
    console.log(`Bafafa na porta ${port} 😈`);
  });