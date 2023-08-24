import { Router } from 'express';
import productModel from '../DAO/mongoManager/product.model.js'
import cartModel from '../DAO/mongoManager/cart.model.js'
import chatModel from '../DAO/mongoManager/chat.model.js'
//import ProductManager from '../DAO/manager/ProductManager.js'

const router = Router()
//const productManager = new ProductManager()

router.get('/', async (req,res) => {

    const products = await productModel.find().lean().exec()
    res.render('index', products)
    console.log({result: 'success', payload: JSON.stringify(products)})

})

router.get('/chat', async (req,res) => {
    const messages = await chatModel.find().lean().exec()
    res.render('chat', {messages})
})

router.get('/cart/:cid', async (req,res) => {
    const cid = req.params?.cid
    const cart = await cartModel.findOne({_id:cid}).populate('products.product')
    console.log(JSON.stringify(cart))
    res.render('cart', {cart})
})

router.get('/products', async (req, res) => {
    
    const limit = parseInt(req.query?.limit || 10) 
    const page = parseInt(req.query?.page || 1) 
    const sort = parseInt(req.query?.sort)
    const queryParams = req.query?.query || ''
    const query = {}

    if (queryParams){
        const field = queryParams.split(',')[0]
        const value = queryParams.split(',')[1]

        if(!isNaN(parseInt(value))) value = parseInt(value)

        query[field] = value

    }
    //const cartID = await cartModel.findOne({})

    const result = await productModel.paginate(query, {
        page,
        limit,
        sort,
        lean: true
    })
    
    result.prevLink =  result.hasPrevPage ? `/products/?page=${result.prevPage}&limit=${limit}` : ''
    result.nextLink =  result.hasNextPage ? `/products/?page=${result.nextPage}&limit=${limit}` : ''

    res.render('products', result)
    console.log(JSON.stringify(result))
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