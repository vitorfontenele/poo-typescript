-- Active: 1675099116147@@127.0.0.1@3306

-- query a
DROP TABLE videos;

-- query b
CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration REAL NOT NULL,
    uploaded_at TEXT NOT NULL
);

-- query c
INSERT INTO videos(id, title, duration, uploaded_at) VALUES
    ("v001", "Git installation tutorial", 600, "2023-01-30T19:47:28.936Z"),
    ("v002", "10 use cases of ChatGPT for devs", 660, "2023-01-30T19:47:28.936Z"),
    ("v003", "Figma crash course", 3600, "2023-01-30T19:47:28.936Z"),
    ("v004", "Understand useEffect in 10 minutes", 600, "2023-01-30T19:47:28.936Z"),
    ("v005", "Classes and objects in Python", 900, "2023-01-30T19:47:28.936Z");