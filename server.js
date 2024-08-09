const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const Task = require('./model');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb+srv://venkytodo:venkytodo@cluster0.d47qttq.mongodb.net/')
    .then(() => console.log('DB Connected...'))
    .catch(err => console.log(err));

app.use(express.json());
app.use(cors({ origin: '*' }));

// Define GraphQL schema
const schema = buildSchema(`
    type Task {
        id: ID!
        todo: String!
        date: String!
    }

    type Query {
        getTasks: [Task]
    }

    type Mutation {
        addTask(todo: String!): [Task]
        deleteTask(id: ID!): [Task]
    }
`);

// Define resolvers
const root = {
    getTasks: async () => {
        try {
            return await Task.find();
        } catch (err) {
            throw new Error('Failed to fetch tasks');
        }
    },
    addTask: async ({ todo }) => {
        try {
            const newTask = new Task({ todo });
            await newTask.save();
            return await Task.find();
        } catch (err) {
            throw new Error('Failed to add task');
        }
    },
    deleteTask: async ({ id }) => {
        try {
            await Task.findByIdAndDelete(id);
            return await Task.find();
        } catch (err) {
            throw new Error('Failed to delete task');
        }
    }
};

// Use GraphQL middleware
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,  // Enable GraphiQL interface
}));

app.listen(5000, () => console.log('Server Running on port 5000...'));
