const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    sender_id: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver_id: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true}
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", c);
module.exports = Chat;
