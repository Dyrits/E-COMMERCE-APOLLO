import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { categories, products } from "./data/index.js";

import typeDefs from "./schema/index.js";
import resolvers from "./resolvers/index.js";

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const options = {
  context: () => ({
    products,
    categories
  })
};

const { url } = await startStandaloneServer(server, options);

console.log(`🚀 The server is running at ${url}.`);