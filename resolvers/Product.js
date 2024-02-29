const Product = {
  category: ({ category$id }, _, { categories }) => {
    return categories.find(({ id }) => id === category$id)
  },
  reviews: ({ id }, _, { reviews }) => {
    return reviews.filter(({ product$id }) => product$id === id)
  }
};

export default Product;