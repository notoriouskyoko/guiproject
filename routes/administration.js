module.exports = {
    method: 'GET',
    path: '/administration',
    config: {
        auth: {
            mode: 'try',
        }
    },
    handler: async (request, h) => {
        let userinfo = request.auth.credentials
        if (userinfo.user[0].scope[0] === 'admin') {
            return h.view('dashboard')
        } else {
            return h.redirect("/")
        }


    }


}