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
    // const limit = parseInt(req.query?.limit || 10) 
    // const page = parseInt(req.query?.page || 1) 
    // const sort = parseInt(req.query?.sort)
    // const queryParams = req.query?.query || ''
    // const query = {}

    // if (queryParams){
    //     const field = queryParams.split(',')[0]
    //     const value = queryParams.split(',')[1]

    //     if(!isNaN(parseInt(value))) value = parseInt(value)

    //     query[field] = value
    // }
    // //const cartID = await cartModel.findOne({})

    // const result = await productModel.paginate(query, {
    //     page,
    //     limit,
    //     sort,
    //     lean: true
    // })
    
    // result.prevLink =  result.hasPrevPage ? `/products/?page=${result.prevPage}&limit=${limit}` : ''
    // result.nextLink =  result.hasNextPage ? `/products/?page=${result.nextPage}&limit=${limit}` : ''

    // const totalPages = Math.ceil(result.totalCount / limit);

    // const response = {
    //     status: 'succes',
    //     payload: result.products,
    //     totalPages,
    //     prevPage: hasPrevPage ? page - 1 : null,
    //     nextPage: hasNextPage ? page + 1 : null,
    //     page,
    //     hasPrevPage,
    //     hasNextPage,
    //     prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
    //     nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
    // }

    // res.render('products', result)
    // console.log(JSON.stringify(response))
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