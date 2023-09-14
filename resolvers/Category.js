import { products } from "../data/index.js";

const Category = {
  products: ({ id }) => products.filter(({ category$id }) => category$id === id)
};

export default Category;