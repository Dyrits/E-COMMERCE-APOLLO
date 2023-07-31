import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import products from "./products.js";

const typeDefs = `#graphql
type Product {
    name: String!
    description: String!
    quantity: Int!
    price: Float!
    image: String!
    onSale: Boolean!
}
type Query {
    products: [Product!]!
    product(id: ID!): Product
}
`;

const resolvers = {
  Query: {
    products: () => products,
    product: (_, { id }) => {
      return products.find((product) => product.id === id);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server);

console.log(`🚀 The server is running at ${url}.`);