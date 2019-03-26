const dateFormat = require('dateformat');


module.exports = {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
        let userinfo = request.auth.credentials

             return h.view('index', {
               username: userinfo.user[0].firstname + " " + userinfo.user[0].lastname ,
                 email: userinfo.user[0].email,
                dateRegistered: new Date(userinfo.user[0].DateRegistered).toLocaleString('en-GB', { timeZone: 'UTC' }),
            });


    }
}