import { GraphQLError } from "graphql";
import { v4 as uuid } from 'uuid';

const Mutation = {
  addCategory:  (parent, {  name }, { categories }) => {
    const id = uuid();
    const category = {
      id,
      name
    };
    categories.push(category);
    return category
  },
  addProduct: (parent, { data }, { products, categories }) => {
    const id = uuid();
    const category = categories.find(category => category.id === data.category);
    if (!category) {
      throw new GraphQLError("The provided identifier for the category does not match any category.");
    }
    const product = {
      id,
      ...data,
      category$id: data.category
    };
    products.push(product);
    return product;
  },
  addReview: (parent, { data }, { reviews, products }) => {
    const id = uuid();
    const product = products.find(product => product.id === data.product);
    if (!product) {
      throw new GraphQLError("The provided identifier for the product does not match any product.");
    }
    const review = {
      id,
      ...data,
      product$id: data.product
    };
    reviews.push(review);
    return review;
  },
  deleteCategory: (parent, { id }, { categories, products }) => {
    const index = categories.find(category => category.id === id);
    const undeletable = products.some(product => product.category$id !== id);
    if (undeletable) {
      throw new GraphQLError("The category cannot be deleted because it still contains products.");
    }
    if (!~index) {
      throw new GraphQLError("The provided identifier does not match any category.");
    }
    return !!categories.splice(index, 1).length;
  },
  deleteProduct: (parent, { id }, { products, reviews }) => {
    const index = products.findIndex(product => product.id === id);
    if (!~index) {
      throw new GraphQLError("The provided identifier does not match any product.");
    }
    reviews = reviews.filter(review => review.product$id !== id);
    return !!products.splice(index, 1).length;
  },
  deleteReview: (parent, { id }, { reviews }) => {
    const index = reviews.findIndex(review => review.id === id);
    if (!~index) {
      throw new GraphQLError("The provided identifier does not match any review.");
    }
    return !!reviews.splice(index, 1).length;
  },
  updateCategory: (parent, { id, name }, { categories }) => {
    const category = categories.find(category => category.id === id);
    if (!category) {
      throw new GraphQLError("The provided identifier does not match any category.");
    }
    category.name = name;
    return category;
  },
  updateProduct: (parent, { id, data }, { products, categories }) => {
    const product = products.find(product => product.id === id);
    if (!product) {
      throw new GraphQLError("The provided identifier does not match any product.");
    }
    if (data.category) {
      const category = categories.find(category => category.id === data.category);
      if (!category) {
        throw new GraphQLError("The provided identifier for the category does not match any category.");
      }
    }
    Object.assign(product, data);
    product.category$id = data.category || product.category$id;
    return product;
  },
  updateReview: (parent, { id, data }, { products, reviews }) => {
    const review = reviews.find(review => review.id === id);
    if (!review) {
      throw new GraphQLError("The provided identifier does not match any review.");
    }
    if (data.product) {
      const product = products.find(product => product.id === data.product);
      if (!product) {
        throw new GraphQLError("The provided identifier for the product does not match any product.");
      }
    }
    Object.assign(review, data);
    review.product$id = data.product || review.product$id;
    return review;
  }
};

export default Mutation;