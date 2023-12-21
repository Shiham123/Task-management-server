const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const port = 3000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    /**
     * ! get method
     */

    app.get('/tasks/:email', async (request, response) => {
      const email = request.params.email;
      const query = { loggedInUserEmail: email };
      const result = await taskCollection.find(query).toArray();
      response.status(200).send(result);
    });

    app.get('/tasks/item/:id', async (request, response) => {
      const id = request.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      response.status(200).send(result);
    });

    app.get('/ongoing', async (request, response) => {
      const result = await taskCollection.find({ status: 'ongoing' }).toArray();
      response.status(200).send(result);
    });

    app.get('/created', async (request, response) => {
      const result = await taskCollection.find({ status: 'created' }).toArray();
      response.status(200).send(result);
    });

    /**
     * ! post method
     */
    app.post('/tasks', async (request, response) => {
      const task = request.body;
      const result = await taskCollection.insertOne(task);
      response.status(200).send(result);
    });

    /**
     * ! patch method
     */

    app.patch('/tasks/:id', async (request, response) => {
      console.log(request.body);
      const id = request.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: { status: 'ongoing' },
      };
      const result = await taskCollection.updateOne(query, updatedDoc);
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
