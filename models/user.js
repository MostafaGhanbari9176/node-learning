const db = require('../utils/database')

const ObjectId = db.ObjectId

function collection(name = 'users') {
    return db.getDB().collection(name)
}

module.exports = class User {
    constructor(user) {
        this._id = user._id
        this.userName = user.userName
        this.email = user.email
        this.cart = user.cart ? user.cart : []
    }

    updateCart(cart) {
        return collection().updateOne({_id: new ObjectId(this._id)}, {$set: {cart: cart}})
    }

    addToCart(productId) {
        const productIndex = this.cart.findIndex(i => {
            return i.productId.toString() === productId.toString()
        })
        if (productIndex >= 0) {
            const newCart = [...this.cart]
            newCart[productIndex].count = newCart[productIndex].count + 1
            return this.updateCart(newCart)
        }
        return collection('products').findOne({_id: new ObjectId(productId)})
            .then(product => {
                const newCart = [...this.cart, {productId: product._id, count: 1}]
                return this.updateCart(newCart)
            }).catch(err => console.log(err))

    }

    getCart() {
        const myProductsId = this.cart.map(i => i.productId)
        return collection('products').find({_id: {$in: myProductsId}}).toArray()
            .then(products => {
                return products.map(p => {
                    return {...p, count: this.cart.find(i => i.productId.toString() === p._id.toString()).count}
                })
            })
            .catch(err => console.log(err))
    }

    removeFromCart(productId) {
        const newCart = [...this.cart.filter(i => i.productId.toString() !== productId.toString())]
        return this.updateCart(newCart)
    }

    save() {
        return collection().insertOne(this)
    }

    createOrder(address) {
        if (this.cart.length === 0)
            return Promise.reject("cart is empty")
        return this.getCart()
            .then(products => {
                const order = {
                    userId: this._id,
                    date: new Date().toString(),
                    address: address,
                    products: products
                }
                return collection('orders').insertOne(order)
            })
            .then(() => {
                return this.updateCart([])
            })
            .catch(err => console.log(err))
    }

    getOrders() {
        return collection('orders').find({userId: new ObjectId(this._id)}).toArray()
    }

    static getUserSystem() {
        return collection().findOne()
    }

    static findById(userId) {
        return collection().findOne({_id: new ObjectId(userId)})
    }
}