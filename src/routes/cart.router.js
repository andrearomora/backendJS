import { Router } from 'express'
//import CartManager from '../DAO/manager/CartManager.js'
import cartModel from '../DAO/mongoManager/cart.model.js'

const router = Router()

router.get('/', async (req, res) => {
    const result = await cartModel.find().lean().exec()
    res.send(result)
})

router.get('/:cid', async (req, res) => {
    const id = req.params.idc
    const result = await cartModel.findOne({_id : id}).populate('products.product')
    res.send(result)
})


router.get('/:idc', async (req, res) => {
    const idc = parseInt(req.params.idc)

    // const result = await cartManager.getProductById(idc)
    // res.send(result)
})

router.post('/', async (req, res) => {
    const cartGenerated = await cartModel.create({products: []})
    //await cartGenerated.save()
    res.send(cartGenerated)
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = parseInt(req.body.quantity) || 1

    const cart = await cartModel.findOne({_id:cid})
    cart.products.push({product: pid, quantity})
    await cartModel.updateOne({cid,cart})

    res.send(cart)
})



export default router