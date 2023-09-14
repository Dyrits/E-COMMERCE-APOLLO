import { categories, products } from "../data/index.js";

const Query = {
  products: () => products,
  product: (_, { id }) => products.find((product) => product.id === id),
  categories: () => categories,
  category: (_, { id }) => categories.find((category) => category.id === id)
};

export default Query;