const Message = require('../models/message');

exports.getAllMessage = (req, res, next) => {
    const page = req.query.page || 1;
    let numberOfMessages;

    Message.countAllMessages()
        .then(number => {
            numberOfMessages = number;
            return Message.fetchAllMessages(page)
        })
        .then(response => {
            //console.log(response);
            res.status(200).json({ message: "All the Messages", messageCreated: response, numberOfMessages: numberOfMessages });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
/************************************************************************************************* */
exports.addMessage = (req, res, next) => {
    const userId = req.userId;
    const userName = req.userName;
    const messageContent = req.body.content;
    const message = new Message(messageContent, userId, userName);
    //console.log(req.body);
    message.addMessage()
        .then(response => {
            res.status(201).json({ message: "Message Created", messageCreated: response.ops[0] });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
/************************************************************************************************* */
exports.editMessage = (req, res, next) => {
    const messageId = req.params.messageId;
    const content = req.body.content;
    Message.editMessage(messageId, content)
        .then(response => {
            //console.log(response)
            res.status(200).json({ message: "Message Edited", message: "" });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
/************************************************************************************************* */
exports.deleteMessage = (req, res, next) => {
    const messageId = req.params.messageId;

    Message.deleteMessage(messageId)
        .then(response => {
            res.status(200).json({ message: "Message Deleted" });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
/************************************************************************************************* */
exports.addReply = (req, res, next) => {
    const messageId = req.params.messageId;
    const reply = { _id: Math.floor(Math.random() * 10000), userId: req.userId, reply: req.body.reply, userName: req.userName };

    Message.addReply(messageId, reply)
        .then(response => {
            res.status(200).json({ message: "Reply Added" });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}