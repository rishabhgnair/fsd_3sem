const express = require('express');
const { buildSchema } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');

const schema = buildSchema(`
  type Student {
    id: ID!
    name: String!
    age: Int
  }
  type Query {
    hello: String
    students: [Student]
    student(id: ID!): Student
  }
  type Mutation {
    addStudent(name: String!, age: Int): Student
  }
`);

const students = [
  { id: '1', name: 'Asha', age: 20 },
  { id: '2', name: 'Ravi', age: 21 },
];

const root = {
  hello: () => 'Hello GraphQL!',
  students: () => students,
  student: ({ id }) => students.find((s) => s.id === id),
  addStudent: ({ name, age }) => {
    const s = { id: String(students.length + 1), name, age };
    students.push(s);
    return s;
  },
};

const app = express();
app.all('/graphql', createHandler({ schema, rootValue: root }));

app.listen(4000, () =>
  console.log('GraphQL at http://localhost:4000/graphql')
);
