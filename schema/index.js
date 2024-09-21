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
    reviews: [Review!]!
}

type Category {
    id: ID!
    name: String!
    products: [Product!]!
}

type Review {
    id: ID!
    date: String!
    title: String!
    comment: String!
    rating: Int!
}

type Query {
    products: [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
    category(id: ID!): Category
}

type Mutation {
    addCategory(name: String!): Category!
    addProduct(data: NewProduct!): Product!
    addReview(data: NewReview): Review!
    deleteCategory(id: ID!): Boolean
    deleteProduct(id: ID!): Boolean
    deleteReview(id: ID!): Boolean,
    updateCategory(id: ID!, name: String!): Category!
    updateProduct(id: ID!, data: UpdatedProduct!): Product!
    updateReview(id: ID!, data: UpdatedReview!): Review!
}

input NewProduct {
    name: String!
    description: String!
    quantity: Int!
    price: Float!
    image: String!
    onSale: Boolean!
    category: ID!
}

input UpdatedProduct {
    name: String
    description: String
    quantity: Int
    price: Float
    image: String
    onSale: Boolean
    category: ID
}

input NewReview {
    title: String!
    comment: String!
    rating: Int!
    product: ID!
}

input UpdatedReview {
    title: String
    comment: String
    rating: Int
    product: ID
}
`;



export default typeDefs;