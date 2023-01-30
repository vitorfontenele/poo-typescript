-- Active: 1675099116147@@127.0.0.1@3306

-- query a
DROP TABLE videos;

-- query b
CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration REAL NOT NULL,
    uploaded_at TEXT DEFAULT (DATETIME()) NOT NULL
);

-- query c
INSERT INTO videos(id, title, duration) VALUES
    ("v001", "Git installation tutorial", 600),
    ("v002", "10 use cases of ChatGPT for devs", 660),
    ("v003", "Figma crash course", 3600),
    ("v004", "Understand useEffect in 10 minutes", 600),
    ("v005", "Classes and objects in Python", 900);