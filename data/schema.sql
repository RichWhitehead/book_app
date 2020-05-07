DROP TABLE IF EXISTS books;
CREATE TABLE books (
id SERIAL PRIMARY KEY,
authors VARCHAR (255),
title VARCHAR (255),
isbn VARCHAR (255),
image_url VARCHAR (255),
amount VARCHAR (255),
description VARCHAR,
bookshelf VARCHAR (255)
);