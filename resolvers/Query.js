const Query = {
  products: (_, __, { products }) => products,
  product: (_, { id }, { products }) => products.find((product) => product.id === id),
  categories: (_, __, { categories }) => categories,
  category: (_, { id }, { categories }) => categories.find((category) => category.id === id)
};

export default Query;