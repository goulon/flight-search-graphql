const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { schema, rootValue } = require('./schema/schema');

const app = express();
const port = 4000;

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}));

const server = app.listen(port, () => {
  console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed');
  });
});
