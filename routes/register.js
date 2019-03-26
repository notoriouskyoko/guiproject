const cryptoFuncs = require("../backend/cryptoFuncs")
const Boom = require('boom');
const Joi = require("joi")


module.exports = [{
  method: ['POST'],
  path: '/register',
  options: {
    auth: { mode: 'try' },
  },
  handler: async (request, h) => {
    const db = request.mongo.db;
    let user = await db.collection("users").find({ "email": request.payload.email }).toArray();


    if (user.length !== 0) {

      // return request.payload
      return { code: 400, message: "email already exists " };



    } else {
      const hPayload = { ...request.payload }

      const hashed_password = cryptoFuncs.encrypt(request.payload.password)

      hPayload.password = hashed_password;
      hPayload.scope = ['user'];

      try {
        db.collection("users").insertOne(hPayload, function (err, res) {
          if (err) throw err;
        });

        return { code: 200, message: "succesful" };
      }
      catch (err) {
        throw Boom.internal('Internal MongoDB error', err);
      }
    }

  }
},
{
  method: ['GET'],
  path: '/register',
  options: {
    auth: { mode: 'try' },
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      return h.redirect('/');
    } else {
      return h.file('login.html')
    }

  }
}]
