import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import sessionRouter from './routes/session.router.js'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import productModel from './DAO/mongoManager/product.model.js'
import cartModel from './DAO/mongoManager/cart.model.js'
import chatModel from './DAO/mongoManager/chat.model.js'
import initializePassport from './config/passport.config.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'

const app = express()
app.use("/public", express.static(__dirname + "/public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine()) //Corre el motor
app.set('views', __dirname + '/views') //Setea la vista
app.set('view engine', 'handlebars') //Establece el motor de plantilla

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)


app.post('/', async(req,res) => {
    const result = await productModel.create(req.body)
    res.send({status: 'success', payload: result})
})

mongoose.set('strictQuery', false)
const httpServer = app.listen(8080)
const io = new Server(httpServer)

const URL = 'mongodb+srv://andrearomora:MacBook2023@ecommerce.py0l9lo.mongodb.net/?retryWrites=true&w=majority'

app.use(session({
    store: MongoStore.create({
        mongoUrl: URL,
        dbName: 'ecommerce',
        mongoOptions:{
            useNewUrlParser:true,
            useUnifiedTopology: true
        },
        ttl: 100
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/session', sessionRouter)
app.use('/', viewsRouter)

mongoose.connect(URL, {
    dbName: 'ecommerce'
})
    .then( async ()=>{
        console.log('DB Connected!!')

        io.on('connection', async socket => {
            socket.on('new-product', async data => {
                console.log(data)

                const newProduct = data

                const productCreated = new productModel(newProduct)
                await productCreated.save()
        
                const products = await productModel.find().lean().exec()
                socket.emit('reload-table', products)
            })
            socket.on('new', async user => {
                console.log(`${user} se acaba de conectar`)
                const chat = await chatModel.find().lean().exec()

                io.emit('logs', chat)
            })
            socket.on('message', async data => {
                console.log(data)
                const newMessage = data

                const messageCreated = new chatModel(newMessage)
                await messageCreated.save()

                const chat = await chatModel.find().lean().exec()

                io.emit('logs', chat)
            })
            socket.on('new-cart', async () =>{
                const newCart = new cartModel({products:[]})
                await newCart.save()

                const cartId = newCart._id

                io.emit('cart-id', cartId)
            })
        })
    })
    .catch(e => {
        console.log("Can't connect to DB" + e)
    })
