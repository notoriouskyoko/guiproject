module.exports = {
    method: 'get',
    path: '/api/event/get',
    config: {
        auth: {
            mode: 'try',
        }
    },
    handler: async (request, h) => {
        const db = request.mongo.db;
        let events = await db.collection("events").find({ "playDateDate": request.query.eventdate}).toArray();
        if(events.size !== 0){
            return events
        }else{
            return { code: 200, error: "didn't find anything for this date" }
        }
    }
}