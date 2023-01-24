-- Active: 1674560419471@@127.0.0.1@3306
-- Tabelas já foram criadas
CREATE TABLE bands (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE songs (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    band_id TEXT NOT NULL,
    FOREIGN KEY (band_id) REFERENCES bands (id)
);

-- Bandas já foram inseridas
INSERT INTO bands (id, name)
VALUES
    ("b001", "SLIPKNOT"),
    ("b002", "DEAD FISH"),
    ("b003", "PROJECT 46");

-- Músicas já foram inseridas
INSERT INTO songs (id, name, band_id)
VALUES
    ("s001", "Duality", "b001"),
    ("s002", "Sonho Médio", "b002"),
    ("s003", "Cidadão Padrão", "b002"),
    ("s004", "People=shit", "b001"),
    ("s005", "Left Behind", "b001");

--------------------------------------------------
SELECT * FROM bands;
SELECT * FROM songs;
DROP TABLE bands;
DROP TABLE songs;

--------------------------------------------------