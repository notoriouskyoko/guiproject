module.exports = {
    method: 'get',
    path: '/api/dogpark/get',
    config: {
        auth: {
            mode: 'try',
        }
    },
    handler: async (request, h) => {
        const db = request.mongo.db;
        let parks = await db.collection("dogparks-odense").find().toArray();
        if(parks.size !== 0){
            return parks
        }else{
            return { code: 404, error: "didn't find any dogparks, this isn't right." }
        }
    }
}







