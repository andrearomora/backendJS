import FileManager from "./FileManager.js"

export default class ProductManager extends FileManager { 

     constructor() {
        super('./products.json')
    }

    create = async(data) => {
        const result = await this.addProduct(data.title,data.description,data.price,data.thumbnail,data.code,data.stock,data.status,data.category)
        return result
    }

    list = async () => {
        const result = await this.getProducts()
        console.log('PRODUCTS: ', result)
        return result
    }
}
