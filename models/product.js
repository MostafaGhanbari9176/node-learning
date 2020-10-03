const db = require('../utils/database')

const ObjectId = db.ObjectId

function collection() {
    return db.getDB().collection('products')
}

module.exports = class Product {
    constructor(title, price, id, userId) {
        this.title = title
        this.price = price
        this._id = id ? new ObjectId(id) : null
        this.userId = userId
    }

    save() {
        if (this._id)
            return collection().updateOne({_id: this._id}, {$set: this})
        return collection().insertOne(this)
    }

    static fetchAll() {
        return collection().find().toArray()
    }

    static getUserProducts(userId){
        return collection().find({userId:new ObjectId(userId)}).toArray()
    }

    static findById(productId) {
        return collection().find({_id: new ObjectId(productId)}).next()
    }

    static delete(productId) {
        return collection().deleteOne({_id: new ObjectId(productId)})
    }

}