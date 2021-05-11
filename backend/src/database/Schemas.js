let mongoose;
let {Schema} = require('mongoose');
const crypto = require('crypto')

export const CDUserSchema = new Schema({
    name: String,
    surname: String,
    type: {type: String},
    vkid: Number,
    yaid: Number,
    glid: Number,
    email: {type: String},
    salt: String,
    hash: String,
    avatar: String,
    checks: [
        {type: Schema.Types.ObjectId, ref: "Check"}
    ]
})

CDUserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};

CDUserSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

export const InCheckProductSchema = new Schema({
    id: Number,
    title: String,
    quantity: Number,
    cost: String || Number,
    users: [ Number ],
    payed: Number
    }, {_id: false}
)

const InCheckUserSchema = new Schema({
    name: String,
    id: Number,
    products: [{
        product_id: Number,
        amount: Number
    }]
    }, {_id: false}
)

export const CheckSchema = new Schema({
    title: String,
    date: Date,
    user: {type: Schema.Types.ObjectId, ref: "CDUser"},
    defaultPayed: Number,
    products: [InCheckProductSchema],
    users: [InCheckUserSchema]
})

