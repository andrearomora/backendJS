import { Router } from 'express'
import productModel from '../DAO/mongoManager/product.model.js'
//import ProductManager from '../DAO/manager/ProductManager.js'

const router = Router()
//const manager = new ProductManager()

router.post('/', async (req,res) => { 
    const newProduct = req.body
    const productCreated = new productModel(newProduct)
    await productCreated.save()
})

router.get('/', async (req, res) => {
    let limit = parseInt(req.query.limit)
    let products = await productModel.find().lean().exec()

    if(limit){
        let productsFiltered = await productModel.find().limit(limit).lean().exec()
        res.send(productsFiltered)
    }else{
        res.send(products)
    }
    // if(limit){
    //     let productsFiltered = []
    //     for (let i = 0; i < limit && i < products.length; i++) {
    //         productsFiltered.push(products[i])
    //     }
    //     res.send(productsFiltered)
    // }else{
    //     res.send(products)
    // }

})

router.get('/:pid', async (req, res) => {
    let id = req.params.pid
    let product = await productModel.find({_id:id}).lean().exec()
    
    res.send(product)
    
})

router.put('/:pid', async (req, res) => {
    let id = req.params.pid

    let product = productModel.updateOne({_id:id},{
        title: req.query.title,
        description: req.query.description,
        price: Number.parseInt(req.query.price),
        thumbnail: req.query.thumbnail,
        code: req.query.code,
        stock: Number.parseInt(req.query.stock),
        status: req.query.status,
        category: req.query.category
    }).lean().exec()

    res.send(product)
    
})

router.delete('/:pid', async (req,res) => {
    let id = parseInt(req.params.pid)
    const result = await manager.deleteProduct(id)
    res.send(result)

})

export default router