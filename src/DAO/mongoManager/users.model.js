import mongoose from 'mongoose'

const usersCollection = 'users'

const userSchema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    age: { type: Number, require: true },
    password: { type: String, require: true },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'carts'
    },
    social: { type: String, require: true },
    rol: { type: String, enum: ["admin","user"], default:"user"}
})

userSchema.pre('findOne', function(){
    this.populate('cart.carts')
})

mongoose.set('strictQuery', false)

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel