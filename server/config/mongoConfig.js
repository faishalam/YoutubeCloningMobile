const { MongoClient } = require("mongodb");

const uri = process.env.URI

const client = new MongoClient(uri)

module.exports = client

