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
    let prod = ''
    const cartProducts = cart.products

    await cartProducts.forEach( async product => {
        let thisProdID = product.product._id.toString()


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
    
        cart.products.push({product: pid, quantity})
        await cart.save()
    }

    res.send(cart)
})


router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid; 
    const productId = req.params.pid; 

    try {
        const cart = await cartModel.findOne({_id:cartId})
        const cartProducts = cart.products
        const newCart = cartProducts.filter((item) => item._id !== productId)
        
        cartProducts = newCart

        await cart.save()

        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting the product' });
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid; 
    const products = req.body.products; 

    try {
        
        const cart = await cartModel.findOne({_id:cartId})
        const cartProducts = cart.products
        cartProducts = products
        await cart.save()

        res.status(200).json({ message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating the cart' });
    }
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid; // ID del carrito

    try {
        const cart = await cartModel.findOne({_id:cartId})
        const cartProducts = cart.products
        cartProducts = []
        await cart.save()

        res.status(200).json({ message: 'Todos los productos fueron eliminados del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar los productos del carrito' });
    }
});

export default router