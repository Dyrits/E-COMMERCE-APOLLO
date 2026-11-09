# E-COMMERCE-APOLLO

A GraphQL API for an e-commerce catalog (products, categories and reviews), built with Apollo Server.

## About The Project

A standalone Apollo Server 5 API serving products, categories and reviews from in-memory data, with queries and mutations defined in `schema/` and `resolvers/`.

### Built With

- Node.js 26 LTS (`nvm use`)
- Apollo Server 5
- GraphQL

## Getting Started

### Prerequisites

- Node.js 26 LTS (`nvm use`)

### Installation

```sh
npm ci
npm start    # serves the GraphQL endpoint (default: http://localhost:4000)
```

### Tests and compatibility

`npm test` runs five regression tests against a real local HTTP server with isolated in-memory data. They cover catalog relationships, category/product/review creation and updates, UUIDs, invalid references, malformed JSON, CSRF checks and HTTP variable validation.

Apollo Server 5 removes the standalone server's internal Express dependency. Invalid GraphQL variables now return HTTP 400 instead of Apollo 4's previous HTTP 200 default. GraphQL stays on the supported 16.x peer range. No deployment is configured by this change.

This remains a learning API, not a production commerce service: data is in memory, with no authentication or persistent storage. Existing resolver limitations remain, including category deletion validation, review cleanup after product deletion, and missing dates on newly created reviews. The tests do not claim those paths are fixed.

## License

No license file is present in this repository.

## Contact

Dyrits - https://github.com/Dyrits
