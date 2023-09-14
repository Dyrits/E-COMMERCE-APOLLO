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

export default typeDefs;