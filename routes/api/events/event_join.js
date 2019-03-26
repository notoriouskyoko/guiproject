module.exports = {
    method: 'PATCH',
    path: '/api/event/join',
    config: {
        auth: {
            mode: 'try',
        }
    },
    handler: async (request, h) => {
        const db = request.mongo.db
        const mongo = request.mongo

        try {
            db.collection("events").updateOne({"_id": mongo.ObjectID(request.payload.eventid)}, {$set: { "participants": request.auth.credentials.user}})
            return { code: 200, message: 'joined event'}
        } catch (e) {
            return e;
        }


    }

    }


