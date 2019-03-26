
module.exports = {
    method: 'post',
    path: '/api/event/create',
    config: {
        auth: {
            mode: 'try',
        }
    },
    handler: async (request, h) => {
        const db = request.mongo.db;
        const mongo = request.mongo
        const hPayload = { ...request.payload }
        let place = await db.collection("dogparks-odense").find({"_id": mongo.ObjectID(request.payload.place)}).toArray();
        let userinfo = request.auth.credentials

        hPayload.place = place
        hPayload.createdBy =  userinfo.user
        hPayload.participants = []

        db.collection("events").insertOne(hPayload, function (err, res) {
         if (err) {
            throw err
         }
          });
        return {code: 200, message: "created event"}


    }
}