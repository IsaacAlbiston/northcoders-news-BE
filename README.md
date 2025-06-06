# NC News Seeding
project hosted on:
https://isaacalbiston-northcoders-news-be.onrender.com

This project is the back-end for a news website, the website has articles and comments posted by different users.

all dependencies are included in the package.json:
use "npm install" to download dependencies

use "setup-dbs.sql" to setup the required dbs

use "npm t" to run the jest tests for the project

Versions used:
Node.js: v23.7.0
psql: 16.8

To seed the databases in this project you must first set-up three .env files in the main repo folder:

.env.production which contains DATABASE_URL = \<insert url-for-your-database> 

.env.development    which contains PGDATABASE = nc_news

.env.test           which contains PGDATABASE = nc_news_test
