const getDb = require('../utilities/dataBase').getDb;
const mongoDB = require('mongodb');

class messsage {
    constructor(content, userId, userName) {
        this.content = content;
        this.userId = userId;
        this.replies = [];
        this.messageCreator = userName;
        this.messageDate = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        this.createdAt = new Date();
    }

    static fetchAllMessages(page) {
        const messagesPerPage = 5;
        const db = getDb();
        return db.collection('Messages')
            .find()
            .sort({ createdAt: -1 })
            .skip((+page - 1) * messagesPerPage)
            .limit(messagesPerPage)
            .toArray();
    }

    static countAllMessages() {
        const db = getDb();
        return db.collection('Messages').countDocuments({});
    }

    addMessage() {
        const db = getDb();
        return db.collection('Messages').insertOne(this);
    }

    static deleteMessage(messageId) {
        const db = getDb();
        return db.collection('Messages').deleteOne({ _id: new mongoDB.ObjectID(messageId) });
    }

    static editMessage(messageId, newContent) {
        const db = getDb();
        return db.collection('Messages').updateOne({ _id: new mongoDB.ObjectID(messageId) }, { $set: { content: newContent } });
    }

    static addReply(messageId, reply) {
        const db = getDb();
        return db.collection('Messages').updateOne({ _id: new mongoDB.ObjectID(messageId) }, { $push: { replies: reply } });
    }
}

module.exports = messsage;