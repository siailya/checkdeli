let mongoose;
let {Schema} = require('mongoose');

export const CDUserSchema = new Schema({
    name: String,
    surname: String,
    type: String,
    vkid: Number,
    email: String,
    checks: [
        {type: Schema.Types.ObjectId, ref: "Check"}
    ]
})

export const CheckSchema = new Schema({
    title: String,
    date: Date,
    user: {type: Schema.Types.ObjectId, ref: "CDUser"}
})

