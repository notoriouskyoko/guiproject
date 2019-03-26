const Hapi = require('hapi');
const Path = require('path');
const unirest = require('unirest');

const init = async () => {

  const server = Hapi.server({
    port: 80,
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '/frontend')
      }
    }
  });
  const dbOpts = {
    url: 'mongodb://localhost:27017/guiproject',
    settings: {
      poolSize: 1000
    },
    decorate: true
  };


  await server.register([
    {
      plugin: require('hapi-dev-errors')
    },
    {
      plugin: require('inert')
    },
    {
      plugin: require("hapi-auth-cookie")
    },
    {
      plugin: require('hapi-mongodb'),
      options: dbOpts
    },
    {
      plugin: require("vision")
    }
  ]);

  const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
  server.app.cache = cache;

  server.auth.strategy('session', 'cookie', {
    password: 'sgrs@8ii^m@C#KbUsbdwlA3LxoHzZM83La003K^V%CtYRr',
    cookie: 'loggedin',
    redirectTo: '/login',
    isSameSite: "Lax",
    isSecure: false
  });

  server.views({
    engines: { html: require("handlebars") },
    path: process.cwd() + "/frontend"
  });

  server.events.on('log', (event, tags) => {

    if (tags.error) {
      console.log(`Server error: ${event.error ? event.error.message : 'unknown'}`);
    }
  });
  server.auth.default('session');

  const routes = [].concat(
      require("./routes/assets"),
      require("./routes/home"),
      require("./routes/logout"),
      require("./routes/login"),
      require("./routes/register"),
      require("./routes/administration"),
      require("./routes/api/events/event_create"),
      require("./routes/api/events/event_get"),
      require("./routes/api/dogparks/dogpark_get"),
      require('./routes/api/events/event_join'),
      require('./routes/api/events/event_leave'),
      require('./routes/api/events/event_get_coming'),
      require("./routes/api/user/getself")

  )


  server.route(routes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
