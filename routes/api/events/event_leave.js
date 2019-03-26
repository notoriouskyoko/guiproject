module.exports = {
    method: 'PATCH',
    path: '/api/event/leave',
    config: {
        auth: {
            mode: 'try',
        }
    },
    handler: async (request, h) => {
        const db = request.mongo.db
        const mongo = request.mongo

        try {
            db.collection("events").updateOne({"_id": mongo.ObjectID(request.payload.eventid)}, { $pull: { "participants": { $in:  request.auth.credentials.user}}})
            return { code: 200, message: 'left event'}
        } catch (e) {
            return e;
        }


    }

}


