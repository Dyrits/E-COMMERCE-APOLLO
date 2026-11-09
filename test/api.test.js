import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "../schema/index.js";
import resolvers from "../resolvers/index.js";
import { categories, products, reviews } from "../data/index.js";

const fixture = structuredClone({ categories, products, reviews });
const server = new ApolloServer({ typeDefs, resolvers });
let url;
before(async () => {
  ({ url } = await startStandaloneServer(server, { listen: { host: "127.0.0.1", port: 0 }, context: async () => fixture }));
});
after(async () => { await server.stop(); });
async function operation(query, variables) {
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query, variables }) });
  return { status: response.status, body: await response.json() };
}
test("catalog queries include category, product and review relationships", async () => {
  const { status, body } = await operation("{ products { id name category { id name } reviews { id rating } } categories { id name products { id } } }");
  assert.equal(status, 200); assert.equal(body.errors, undefined);
  assert.equal(body.data.products.length, products.length);
  assert.equal(body.data.categories.length, categories.length);
  assert.equal(body.data.products[0].category.name, "Kitchen");
  assert.equal(body.data.products[0].reviews.length, reviews.filter(r => r.product$id === products[0].id).length);
});
test("category, product and review mutation flows use unique UUIDs and preserve relationships", async () => {
  const createdCategory = await operation('mutation { addCategory(name: "Fixture") { id name } }');
  assert.equal(createdCategory.body.errors, undefined);
  const category = createdCategory.body.data.addCategory;
  assert.match(category.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  const productInput = { name: "Fixture product", description: "A local test", quantity: 2, price: 12.5, image: "fixture", onSale: false, category: category.id };
  const added = await operation("mutation($data: NewProduct!) { addProduct(data: $data) { id name category { id } } }", { data: productInput });
  assert.equal(added.body.errors, undefined);
  const product = added.body.data.addProduct; assert.notEqual(product.id, category.id); assert.equal(product.category.id, category.id);
  const updated = await operation("mutation($id: ID!, $data: UpdatedProduct!) { updateProduct(id: $id, data: $data) { name price } }", { id: product.id, data: { name: "Updated", price: 13.5 } });
  assert.deepEqual(updated.body.data.updateProduct, { name: "Updated", price: 13.5 });
  const review = await operation("mutation($data: NewReview!) { addReview(data: $data) { id title rating } }", { data: { product: product.id, title: "Fixture", comment: "Local test", rating: 4 } });
  assert.equal(review.body.errors, undefined); const reviewID = review.body.data.addReview.id;
  const changed = await operation("mutation($id: ID!, $data: UpdatedReview!) { updateReview(id: $id, data: $data) { rating } }", { id: reviewID, data: { rating: 5 } });
  assert.equal(changed.body.data.updateReview.rating, 5);
  const removedReview = await operation("mutation($id: ID!) { deleteReview(id: $id) }", { id: reviewID });
  assert.equal(removedReview.body.data.deleteReview, true);
  const removedProduct = await operation("mutation($id: ID!) { deleteProduct(id: $id) }", { id: product.id });
  assert.equal(removedProduct.body.data.deleteProduct, true);
});
test("invalid references and missing objects return GraphQL errors without stopping the server", async () => {
  const result = await operation('mutation { addReview(data: { product: "missing", title: "test", comment: "test", rating: 1 }) { id } }');
  assert.match(result.body.errors[0].message, /does not match any product/);
  const missing = await operation('query { product(id: "missing") { id } }');
  assert.equal(missing.body.data.product, null);
});
test("coercion errors use Apollo 5's intended HTTP 400 response", async () => {
  const result = await operation("mutation($name: String!) { addCategory(name: $name) { id } }", { name: 123 });
  assert.equal(result.status, process.env.BASELINE_APOLLO4 ? 200 : 400);
  assert.equal(result.body.errors[0].extensions.code, "BAD_USER_INPUT");
});
test("malformed JSON and CSRF-prone GET requests are rejected and server stays responsive", async () => {
  const bad = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
  assert.equal(bad.status, 400);
  const csrf = await fetch(url + "?query=" + encodeURIComponent("{ categories { id } }"));
  assert.equal(csrf.status, 400);
  const valid = await operation("{ categories { id } }");
  assert.equal(valid.status, 200); assert.equal(valid.body.errors, undefined);
});
