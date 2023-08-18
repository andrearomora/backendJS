import { Router } from 'express';
import productModel from '../DAO/mongoManager/product.model.js'
import chatModel from '../DAO/mongoManager/chat.model.js'
//import ProductManager from '../DAO/manager/ProductManager.js'

const router = Router()
//const productManager = new ProductManager()

router.get('/', async (req,res) => {
    try{
       
        let limit = parseInt(req.query?.limit || 10) 
        let page = parseInt(req.query?.page || 1) 
        let sort = parseInt(req.query?.sort)
        let query = parseInt(req.query?.query)

        const options = {
            page: page,
            limit: limit,
            sort: sort,
            lean: true
        }

        const products = await productModel.paginate({query}, options)

        res.render('index', products)
        console.log({result: 'success', payload: JSON.stringify(products)})
        
    } catch (error){
        console.error(error);
        res.send({result: 'error', error})
    }
})

router.get('/chat', async (req,res) => {
    const messages = await chatModel.find().lean().exec()
    res.render('chat', {messages})
})

router.get('/products', async (req, res) => {
    const products = await productModel.find().lean().exec()
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