import { Router } from 'express'
import CartManager from '../manager/CartManager.js'

const router = Router()
const cartManager = new CartManager()

router.get('/', async (req, res) => {
    const result = await cartManager.list()
    res.send(result)
})

router.get('/:cid', async (req, res) => {
    const result = await cartManager.list()
    res.send(result)
})


router.get('/:idc', async (req, res) => {
    const idc = parseInt(req.params.idc)

    const result = await cartManager.getCartById(idc)
    res.send(result)
})

router.post('/', async (req, res) => {
    const result = await cartManager.create()
    res.send(result)
})

export default router