import { categories } from "../data/index.js";

const Product = {
  category: ({ category$id }) => categories.find(({ id }) => id === category$id)
};

export default Product;