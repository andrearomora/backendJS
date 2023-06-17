import express from 'express'
import { ProductManager } from'../ProductManager.js'

const app = express()
app.use(express.json())
const manager = new ProductManager('products.json');

app.post('/addProduct', async (req,res) => {
    await manager.addProduct(req.query.title,req.query.description,req.query.price,req.query.thumbnail,req.query.code,req.query.stock)
    let products = await manager.getProducts()
    res.json(products)
})

app.get('/products/', async (req, res) => {
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

app.get('/products/:pid', async (req, res) => {
    let id = parseInt(req.params.pid)
    let product = await manager.getProductById(id)
    
    res.json(product)
    
})

app.listen(8080)