const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        default: "mostafa"
    },
    email: String,
    cart: {
        items: {
            type: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        required: true,
                        ref: "Product"
                    }, count: {
                        type: Number,
                        default: 1
                    }
                }
            ],
            default: []
        }
    }
})

userSchema.methods.addToCart = function (productId) {
    const product = this.getProduct(productId)
    if (product)
        return this.increaseCount(productId)
    this.cart.items.push({
        product: productId
    })
    return this.save()
}

userSchema.methods.increaseCount = function (productId) {
    const product = this.getProduct(productId)
    const oldCount = product.count
    product.count = oldCount + 1
    return this.save()
}

userSchema.methods.getProduct = function (productId) {
    return this.cart.items
        .find(i => i.product.toString() === productId.toString())
}

userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items
        .filter(i => i.product.toString() !== productId.toString())
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []}
    return this.save()
}

module.exports = mongoose.model('User', userSchema)