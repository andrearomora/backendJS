import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
            type: [{
                id: String,
                quantity: Number
            }]
        }
})

mongoose.set('strictQuery', false)

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel