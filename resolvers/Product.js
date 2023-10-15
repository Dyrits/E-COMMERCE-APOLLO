const Product = {
  category: ({ category$id }, _, { categories }) => {
    return categories.find(({ id }) => id === category$id)
  }
};

export default Product;