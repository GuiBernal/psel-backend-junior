export const routeNames = {
  root: {
    get: "/",
  },
  people: {
    post: "/people",
  },
  account: {
    post: "/people/:peopleId/accounts",
    get: "/people/:peopleId/accounts",
    getBalance: "/accounts/:accountId/balance",
  },
  card: {
    post: "/accounts/:accountId/cards",
    getByAccount: "/accounts/:accountId/cards",
    getByPeople: "/people/:peopleId/cards",
  },
  transaction: {
    post: "/accounts/:accountId/transactions",
    get: "/accounts/:accountId/transactions",
    postRevert: "/accounts/:accountId/transactions/:transactionId/revert",
  },
};
