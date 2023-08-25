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

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    let quantity = parseInt(req.body.quantity)
    console.log(quantity)
    let exist = false
    let prodId = ''
    

    const cart = await cartModel.findOne({_id:cid})
    console.log("i'm the cart" + cart)
    let prod = ''
    const cartProducts = cart.products

    await cartProducts.forEach( async product => {
        let thisProdID = product.product._id.toString()
   
        console.log("i'm in the for" + thisProdID)

        if( thisProdID == pid) {
            console.log("i'm in the if EXISTO")
            quantity = quantity + product.quantity
            product.quantity = quantity
            prodId = product._id
            exist = true
            await cart.save()
        }
    });

    if(exist==false){
    //     prod = await cart.products.updateOne({_id:prodId},{quantity:quantity})

    //     // prod = {product:pid, quantity:quantity}
    //     // await prod.save()
    // }else{
        cart.products.push({product: pid, quantity})
        //await cart.save()
    }

    res.send(cart)
})

export default router