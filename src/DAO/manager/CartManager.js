import FileManager from "./FileManager.js";

export default class CartManager extends FileManager {
    
    constructor() {
        super('./carts.json')
    }

    create = async() => {
        const data = {
            products: []
        }
        return await this.addCart(data)
    }

    addProduct = async(idc, idp) => {
        const cart = await this.getCartById(idc)
        cart.products.push(idp)

        return await this.update(cart)
    }

    list = async () => {
        return await this.getProducts()
    }
}