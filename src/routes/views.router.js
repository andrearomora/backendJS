import { Router } from 'express';
import productModel from '../DAO/mongoManager/product.model.js'
import chatModel from '../DAO/mongoManager/chat.model.js'
//import ProductManager from '../DAO/manager/ProductManager.js'

const router = Router()
//const productManager = new ProductManager()

router.get('/', (req,res) => {
    res.render('index', {})
})

router.get('/chat', async (req,res) => {
    const messages = await chatModel.find().lean().exec()
    res.render('chat', {messages})
})

router.get('/products', async (req, res) => {
    const products = await productManager.list()
    res.render('products', { products })
})

router.get('/products-realtime', async (req, res) => {
    const products = await productModel.find().lean().exec()
    res.render('products_realtime', {products})
})

router.get('/form-products', async (req, res) => {
    res.render('form', {})
})

router.post('/form-products', async (req, res) => {
    //const result = await productManager.create(data)
    const newProduct = req.body

    const productCreated = new productModel(newProduct)
    await productCreated.save()

    res.redirect('/products')
})

export default router