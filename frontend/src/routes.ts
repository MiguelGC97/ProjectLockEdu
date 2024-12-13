const routes: any = {
  lockers: {
    url: '/api/lockers/:id',
    //options: {}, // defautl options for this action
  },
  items: {
    url: '/api/items.json',
    options: {},
    get: {
      url: '/api/items.json',
    },
  },
  another: {
    //Just as Example, now you can use wildcards in routes
    url: '/api/another/:id',
  },
};

export default routes;
