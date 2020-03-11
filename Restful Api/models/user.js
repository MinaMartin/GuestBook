const getDb = require('../utilities/dataBase').getDb;


class user {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.messages = [];
        this.createdAt = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}`;
    }

    signUp() {
        const db = getDb();
        return db.collection('Users').insertOne(this);
    }

    static findUserByEmail(email) {
        const db = getDb();
        return db.collection('Users').findOne({ email: email });
    }
}

module.exports = user;

