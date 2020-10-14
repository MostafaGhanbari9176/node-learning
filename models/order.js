const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    products: {
        type: [
            {
                product: {type: Object, required: true},
                count: {type: Number, required: true}
            }
        ],
        required: true
    },
    address: String,
    date: Date,
    total: String
})

module.exports = mongoose.model('Order', orderSchema)