module.exports = {
    method: 'get',
    path: '/api/event/get/comingevents',
    config: {
        auth: {
            mode: 'try',
        }
    },
    handler: async (request, h) => {
        const db = request.mongo.db;
        let events = await db.collection("events").find( { playDateDate: { $gt: request.query.eventdate } } ).toArray();
        if(events.size !== 0){
            return events
        }else{
            return { code: 500, error: "empty! no one has made events" }
        }
    }
}