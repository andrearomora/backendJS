import { Router } from 'express'
//import CartManager from '../DAO/manager/CartManager.js'
import cartModel from '../DAO/mongoManager/cart.model.js'

const router = Router()

router.get('/', async (req, res) => {
    const result = await cartModel.find().lean().exec()
    res.send(result)
})

router.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.idc)
    const result = await cartModel.find({_id : id}).lean().exec()
    res.send(result)
})


router.get('/:idc', async (req, res) => {
    const idc = parseInt(req.params.idc)

    // const result = await cartManager.getProductById(idc)
    // res.send(result)
})

router.post('/', async (req, res) => {
    const cartGenerated = new cartModel()
    await cartGenerated.save()
    res.send(cartGenerated)
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)

    // const result = await cartManager.create()
    // res.send(result)
})

export default router