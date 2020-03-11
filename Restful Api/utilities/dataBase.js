const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Mina:gaa@@UxWiTw5hVg@minacluster-ykcse.mongodb.net/GuestBook?retryWrites=true&w=majority";

let _db;
const mongoConnect = (callback) => {
    MongoClient.connect(url)
        .then(client => {
            console.log("Connected");
            _db = client.db(); //we will connect to the DB 
            callback();
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No Database found";
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;