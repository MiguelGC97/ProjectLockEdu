const routes: any = {
  lockers: {
    url: '/api/lockers/:id',
  },
  items: {
    url: '/api/items.json',
    options: {},
    get: {
      url: '/api/items.json',
    },
  },
  another: {
    url: '/api/another/:id',
  },
};

export default routes;
