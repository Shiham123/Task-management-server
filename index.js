const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const port = 3000;

const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster-assignment-11.m6efgmp.mongodb.net/?retryWrites=true&w=majority`;

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // await client.connect();
    const taskDatabase = client.db('taskDB');
    const taskCollection = taskDatabase.collection('per-task');

    app.post('/tasks', async (request, response) => {
      const task = request.body;
      const result = await taskCollection.insertOne(task);
      response.status(200).send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log('You successfully connected to MongoDB!');
  } catch (error) {
    console.log(error);
  }
};

run();

app.get('/', async (request, response) => {
  response.send('successfully connected');
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
