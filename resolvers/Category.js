const Category = {
  products: ({ id }, _, { products }) => products.filter(({ category$id }) => category$id === id)
};

export default Category;