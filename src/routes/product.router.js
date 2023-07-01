import { Router } from 'express'
import ProductManager from '../manager/ProductManager.js'

const router = Router()
const manager = new ProductManager()

router.post('/', async (req,res) => {
 
    await manager.addProduct(req.query.title,req.query.description,req.query.price,req.query.thumbnail,req.query.code,req.query.stock,req.query.status,req.query.category)
    let products = await manager.getProducts()
    res.json(products)
})

router.get('/', async (req, res) => {
    let limit = parseInt(req.query.limit)
    let products = await manager.getProducts()
    if(limit){
        let productsFiltered = []
        for (let i = 0; i < limit && i < products.length; i++) {
            productsFiltered.push(products[i])
        }
        res.json(productsFiltered)
    }else{
        res.json(products)
    }
})

router.get('/:pid', async (req, res) => {
    let id = parseInt(req.params.pid)
    let product = await manager.getProductById(id)
    
    res.json(product)
    
})

router.put('/:pid', async (req, res) => {
    let id = parseInt(req.params.pid)
    
    let prodUpdate = {
        title: req.query.title,
        description: req.query.description,
        price: Number.parseInt(req.query.price),
        thumbnail: req.query.thumbnail,
        code: req.query.code,
        stock: Number.parseInt(req.query.stock),
        status: req.query.status,
        category: req.query.category
    }

    let product = await manager.updateProduct(id,prodUpdate)

    res.json(product)
    
})

router.delete('/:pid', async (req,res) => {
    let id = parseInt(req.params.pid)
    const result = await manager.deleteProduct(id)
    res.send(result)

})

export default router