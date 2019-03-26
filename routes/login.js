const cryptoFuncs = require("../backend/cryptoFuncs")
const Boom = require('boom');
const Joi = require("joi")



    module.exports = [{
        method: ['POST'],
        path: '/login',
        options: {
            auth: { mode: 'try' },
        },
        handler: async (request, h) => {

            const sid = request.payload

            const db = request.mongo.db;
            let user = await db.collection("users").find({ "email": request.payload.email }).toArray();

            let decrypted;

            try {
                decrypted = cryptoFuncs.decrypt(user[0].password)
            } catch (e) { }
            console.log(user)


            if (decrypted === request.payload.password) {
                try {

                    delete user[0].password;
                    request.cookieAuth.set({ user });
                    return { code: 200, message: "successful" }
                } catch (err) {
                    console.log(err)
                    return { code: 401, error: "a error happened" }
                }

            } else {
                return { code: "401", error: "mail not found, or password incorrect" }
            }
        }
    },
    {
        method: ['GET'],
        path: '/login',
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
    }
]
