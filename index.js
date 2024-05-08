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

app.post("/barraqueiros", async (req, res) => {
  const { nome, classe, nivel, vida, deboche, forca, recalque, frase } =
    req.body;

  // Definir as classes válidas
  const classesValidas = [
    "Rainha do Deboche",
    "Mestre do Recalque",
    "Guerreiro da Fofoca",
    "Mago do Veneno",
    "Stalker",
    "Fofoqueira do Bairro",
    "Pick Me",
    "Macho Tóxico",
    "Militante",
  ];

  // Verificar se a classe é válida
  if (!classesValidas.includes(classe)) {
    return res.status(400).json({
      message: `Classe inválida. As classes válidas são: ${classesValidas.join(
        ", "
      )}`,
    });
  }

  const query = `INSERT INTO barraqueiros (nome, classe, nivel, vida, deboche, forca, recalque, frase) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  const values = [nome, classe, nivel, vida, deboche, forca, recalque, frase];
  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows);
  } catch (error) {
    console.error("Erro ao criar o barraqueiro:", error);
    res.status(500).json({
      message: "Erro ao criar o barraqueiro",
    });
  }
});

app.get("/barraqueiros", async (req, res) => {
  const query = `SELECT * FROM barraqueiros`;
  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar os barraqueiros:", error);
    res.status(500).json({
      message: "Erro ao buscar os barraqueiros",
    });
  }
});

app.get("/barraqueiros/:id", async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM barraqueiros WHERE id = $1`;
  const values = [id];
  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar o barraqueiro:", error);
    res.status(500).json({
      message: "Erro ao buscar o barraqueiro",
    });
  }
});

app.put("/barraqueiros/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, classe, nivel, vida, deboche, forca, recalque, frase } =
    req.body;
  const query = `UPDATE barraqueiros SET nome = $1, classe = $2, nivel = $3, vida = $4, deboche = $5, forca = $6, recalque = $7, frase = $8 WHERE id = $9`;
  const values = [
    nome,
    classe,
    nivel,
    vida,
    deboche,
    forca,
    recalque,
    frase,
    id,
  ];
  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao atualizar o barraqueiro:", error);
    res.status(500).json({
      message: "Erro ao atualizar o barraqueiro",
    });
  }
});

app.delete("/barraqueiros/:id", async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM barraqueiros WHERE id = $1`;
  const values = [id];
  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao deletar o barraqueiro:", error);
    res.status(500).json({
      message: "Erro ao deletar o barraqueiro",
    });
  }
});

app.get("/barraqueiros/nome/:nome", async (req, res) => {
  const { nome } = req.params;
  const query = `SELECT * FROM barraqueiros WHERE nome = $1`;
  const values = [nome];
  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Barraqueiro não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar o barraqueiro:", error);
    res.status(500).json({
      message: "Erro ao buscar o barraqueiro",
    });
  }
});

// Define a rota para obter o resultado de uma batalha entre dois barraqueiros
app.get("/batalhas/:id1/:id2", async (req, res) => {
  // Extrai os IDs dos barraqueiros dos parâmetros da rota
  const { id1, id2 } = req.params;

  try {
    // Define a consulta SQL para buscar um barraqueiro pelo ID
    const queryBarraqueiro = `SELECT * FROM barraqueiros WHERE id = $1`;

    // Executa a consulta para buscar os dois barraqueiros
    const barraqueiro1 = (await pool.query(queryBarraqueiro, [id1])).rows[0];
    const barraqueiro2 = (await pool.query(queryBarraqueiro, [id2])).rows[0];

    // Define um objeto que mapeia cada classe de barraqueiro para seus pontos extras
    const pontosPorClasse = {
      "Rainha do Deboche": 100,
      "Mestre do Recalque": 20,
      "Guerreiro da Fofoca": 30,
      "Mago do Veneno": 40,
      Stalker: 50,
      "Fofoqueira do Bairro": 90,
      "Pick Me": 50,
      "Macho Tóxico": 10,
      Militante: 80,
    };

    // Calcula a força total de cada barraqueiro, que é a soma de sua vida, deboche e força, menos seu recalque, mais seus pontos extras
    const forcaTotal1 =
      barraqueiro1.vida +
      barraqueiro1.deboche +
      barraqueiro1.forca -
      barraqueiro1.recalque +
      (pontosPorClasse[barraqueiro1.classe] || 0);
    const forcaTotal2 =
      barraqueiro2.vida +
      barraqueiro2.deboche +
      barraqueiro2.forca -
      barraqueiro2.recalque +
      (pontosPorClasse[barraqueiro2.classe] || 0);

    // Determina o vencedor e o perdedor com base na força total
    let vencedor, perdedor;
    if (forcaTotal1 > forcaTotal2) {
      vencedor = barraqueiro1;
      perdedor = barraqueiro2;
    } else {
      vencedor = barraqueiro2;
      perdedor = barraqueiro1;
    }

    // Define a consulta SQL para inserir a batalha na tabela de batalhas
    const queryBatalha = `INSERT INTO batalhas (barraqueiro1, barraqueiro2, vencedor, rebaixada, frase_vencedor, data) VALUES ($1, $2, $3, $4, $5, NOW())`;

    // Define os valores a serem inseridos na tabela de batalhas
    const valuesBatalha = [id1, id2, vencedor.id, perdedor.id, vencedor.frase];

    // Executa a consulta para inserir a batalha na tabela de batalhas
    await pool.query(queryBatalha, valuesBatalha);

    // Retorna o resultado da batalha, incluindo a mensagem e os dados do vencedor
    res.status(200).json({
      message: `O vencedor é ${vencedor.nome} com a frase: ${vencedor.frase}`,
      vencedor: vencedor
    });
  } catch (error) {
    // Se ocorrer um erro, registra-o no console e retorna uma mensagem de erro
    console.error("Erro na batalha:", error);
    res.status(500).json({
      message: "Erro na batalha",
    });
  }
});

app.delete("/batalhas/:id", async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM batalhas WHERE id = $1`;
  const values = [id];
  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao deletar a batalha:", error);
    res.status(500).json({
      message: "Erro ao deletar a batalha",
    });
  }
});

app.get("/historico", async (req, res) => {
  const query = `
        SELECT b.*, 
            v.nome as vencedor_nome, v.classe as vencedor_classe, v.nivel as vencedor_nivel, v.vida as vencedor_vida, v.deboche as vencedor_deboche, v.forca as vencedor_forca, v.recalque as vencedor_recalque, v.frase as vencedor_frase,
            p.nome as perdedor_nome, p.classe as perdedor_classe, p.nivel as perdedor_nivel, p.vida as perdedor_vida, p.deboche as perdedor_deboche, p.forca as perdedor_forca, p.recalque as perdedor_recalque
        FROM batalhas b
        JOIN barraqueiros v ON b.vencedor = v.id
        JOIN barraqueiros p ON b.rebaixada = p.id
    `;
  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar as batalhas:", error);
    res.status(500).json({
      message: "Erro ao buscar as batalhas",
    });
  }
});

app.get("/batalhas/:id", async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM batalhas WHERE id = $1`;
  const values = [id];
  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar a batalha:", error);
    res.status(500).json({
      message: "Erro ao buscar a batalha",
    });
  }
});

app.get("/historico/nome/:nome", async (req, res) => {
    const barraqueiroNome = req.params.nome;
    console.log(barraqueiroNome);
    const query = `
      SELECT b.*, 
          v.nome as vencedor_nome, v.classe as vencedor_classe, v.nivel as vencedor_nivel, v.vida as vencedor_vida, v.deboche as vencedor_deboche, v.forca as vencedor_forca, v.recalque as vencedor_recalque, v.frase as vencedor_frase,
          p.nome as perdedor_nome, p.classe as perdedor_classe, p.nivel as perdedor_nivel, p.vida as perdedor_vida, p.deboche as perdedor_deboche, p.forca as perdedor_forca, p.recalque as perdedor_recalque, p.frase as perdedor_frase
      FROM batalhas b
      JOIN barraqueiros v ON b.vencedor = v.id
      JOIN barraqueiros p ON b.rebaixada = p.id
      WHERE v.nome = $1 OR p.nome = $1
  `;
    try {
      const result = await pool.query(query, [barraqueiroNome]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Erro ao buscar as batalhas:", error);
      res.status(500).json({
        message: "Erro ao buscar as batalhas",
      });
    }
  });

app.get("/", (req, res) => {
  res.status(200).send(`
        <p>Ai como adoro.</p>
        <img src="https://www.criarmeme.com.br/meme/meme-22392-opa!-vai-comecar-o-barraco--kkkk.jpg" alt="Meme Image"/>
    `);
});

app.listen(port, () => {
  console.log(`Bafafa na porta ${port} 😈`);
});
