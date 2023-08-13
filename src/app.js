import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import chatRouter from './routes/chat.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './DAO/manager/ProductManager.js'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import productModel from './DAO/mongoManager/product.model.js'
import cartModel from './DAO/mongoManager/cart.model.js'
import chatModel from './DAO/mongoManager/chat.model.js'


const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: true}))
app.use('/chat', chatRouter)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


app.use('/', viewsRouter)
// app.use('/api/products', productRouter)
// app.use('/api/carts', cartRouter)


// -------------------
//Show all products
app.get('/', async(req, res) =>{
    try{
        const products = await productModel.find()
        res.send({result: 'success', payload: products})
    } catch {
        console.error(error);
        res.send({result: 'error', error})
    }
})
//Insert one product
app.post('/', async(req,res) => {
    const result = await productModel.create(req.body)
    res.send({status: 'success', payload: result})
})
// -------------------

mongoose.set('strictQuery', false)
const httpServer = app.listen(8080)
const io = new Server(httpServer)

const URL = 'mongodb+srv://andrearomora:MacBook2023@ecommerce.py0l9lo.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(URL, {
    dbName: 'ecommerce'
})
    .then(()=>{
        console.log('DB Connected!!')
        
        io.on('connection', socket => {
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
                console.log(data);
                const newMessage = data

                const messageCreated = new chatModel(newMessage)
                await messageCreated.save()

                const chat = await chatModel.find().lean().exec()

                io.emit('logs', chat)
            })
        })
    })
    .catch(e => {
        console.log("Can't connect to DB");
    })
