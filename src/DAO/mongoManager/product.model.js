import mongoose from 'mongoose'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    thumbnail: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    stock: { type: Number, require: true },
    status: { type: Boolean, default: true},
    category: { type: String, enum: ["totebags","adjustables"],require: true }
})

mongoose.set('strictQuery', false)

const productModel = mongoose.model(productCollection, productSchema)

export default productModel