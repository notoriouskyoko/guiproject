module.exports = {
    method: 'get',
    path: '/api/user/getself',
    config: {
        auth: {
            mode: 'try',
        }
    },
    handler: async (request, h) => {
       return request.auth.credentials
    }
}




