const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;
  
const typeDefs = gql`
type Query {
  todo: [Todo!]
} 

type Mutation {
    addTodo(todo: String!) : Todo
    deleteTodo(id: ID!) : Todo
  }
  type Todo {
    id: ID!
    todo: String!
    status: Boolean!
  }
`

const resolvers = {
  Query: {
    todo: async (parent, args, context) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY});
        console.log("connection sucess")
        var result = await adminClient.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection('todos'))),
            q.Lambda(x => q.Get(x))
          )
        );
        console.log(result.data)
        return result.data.map(d => {
          return {
            id: d.ref.id,
            status: d.data.status,
            todo: d.data.todo
          }
        })
      } catch (err) {
        return { statusCode: 500, body: err.toString() }
      }
    },

  },
  Mutation: {
    addTodo: async (_, { todo }) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY});
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            {
              data: {
                todo: todo,
                status: true
              }
            },
          )
        )

        return result.ref.data;
      } catch (error) {
        console.log(error)
      }
    },
    deleteTodo: async (_, { id }) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY});
         console.log("delete connection created");
        const result = await adminClient.query(
          q.Delete(
            q.Ref(q.Collection('todos'), id),
          )
        );
         
      } catch (error) {
        console.log(error)
}
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }







