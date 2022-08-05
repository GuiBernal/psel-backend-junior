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
  },
};
