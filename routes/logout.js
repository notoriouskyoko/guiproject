const logout = (server, h) => {

  server.server.app.cache.drop(server.state['sid-example'].sid);
  server.cookieAuth.clear();
  return h.file;
};

module.exports = {
  method: ['GET', 'POST'],
  path: '/logout',
  options: { auth: { mode: 'try' } },
  handler: async (request, h) => {

    request.cookieAuth.clear();
    return h.redirect('/login');

  }
}