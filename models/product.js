const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
})

module.exports = mongoose.model('Product', productSchema)