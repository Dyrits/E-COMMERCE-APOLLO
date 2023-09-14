import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { products, categories } from "./data/index.js";

const typeDefs = `#graphql
type Product {
    id: ID!
    name: String!
    description: String!
    quantity: Int!
    price: Float!
    image: String!
    onSale: Boolean!
    category: Category!
}
type Category {
    id: ID!
    name: String!
    products: [Product!]!
}
type Query {
    products: [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
    category(id: ID!): Category
}
`;

const resolvers = {
  Query: {
    products: () => products,
    product: (_, { id }) => products.find((product) => product.id === id),
    categories: () => categories,
    category: (_, { id }) => categories.find((category) => category.id === id)
  },
  Product: {
    category: ({ category$id }) => categories.find(({ id }) => id === category$id)
  },
  Category: {
    products: ({ id }) => products.filter(({ category$id }) => category$id === id)
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server);

console.log(`🚀 The server is running at ${url}.`);