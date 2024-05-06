\c batalhas

CREATE TABLE IF NOT EXISTS barraqueiros(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    classe VARCHAR(255) NOT NULL,
    nivel INT NOT NULL,
    vida INT NOT NULL,
    deboche INT NOT NULL,
    forca INT NOT NULL,
    recalque INT NOT NULL,
    frase TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS batalhas(
    id SERIAL PRIMARY KEY,
    barraqueiro1 INT NOT NULL,
    barraqueiro2 INT NOT NULL,
    vencedor INT NOT NULL,
    rebaixada INT NOT NULL,
    frase_vencedor TEXT NOT NULL,
    data TIMESTAMP NOT NULL,
    FOREIGN KEY (barraqueiro1) REFERENCES barraqueiros(id),
    FOREIGN KEY (barraqueiro2) REFERENCES barraqueiros(id),
    FOREIGN KEY (vencedor) REFERENCES barraqueiros(id),
    FOREIGN KEY (rebaixada) REFERENCES barraqueiros(id)
);