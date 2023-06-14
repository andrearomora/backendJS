const fs = require('fs')

class ProductManager { 

    constructor(filename) {
        this.path = filename
        this.format = 'utf-8'
    }

    getProducts = async () => { 
        try{
            const products = await fs.promises.readFile(this.path, this.format)
            const productsObj = JSON.parse(products)
            return productsObj
        }catch(e){
            console.log('No products found')
            return []
        }
    }

    getNextID = async () => {
        try{
            const products = await this.getProducts()
            const count = products.length
            if (count>0) {
                const lastId = products[count-1].id
                const nextId = lastId + 1;
                return nextId
            }else{
                return 1
            }
        }catch(e){
            console.log('Can not generate a new ID', e)
        }
        
    }

    addProduct = async (title,description,price,thumbnail,code,stock) => {
        try {

            if(title=='' || description=='' || price=='' || thumbnail=='' || code=='' || stock=='' || code==''){
                return console.log("All fields are required")
                }

            const product = {
                id: await this.getNextID(),
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            }
            
            const products = await this.getProducts()
    
            if(products){
                const [product1] = products.filter((product1) => product1.code === code);
                if(!product1){
                    products.push(product)
                    await fs.promises.writeFile(this.path, JSON.stringify(products))
                }else{
                    return console.log("The product already exists")
                }
            }else{
                products.push(product)
                await fs.promises.writeFile(this.path, JSON.stringify(products))
            }
            
        } catch (e) {
            return console.log('Error while creating the product')
        }
    }

    getProductById = async (idSearch) => { 
        try{
            const products = await this.getProducts()
            const [productById] = products.filter((productById) => productById.id === idSearch);

            if(productById){
                console.log('PRODUCT BY ID: ', productById)
                return productById
            }else{
                console.log("ID ",idSearch," Not found")
            }
        }catch(e){
            console.log('Error while searching product by Id', e)
        }
    }

    updateProduct = async (id, prod) => {
        try{
            const products = await this.getProducts()
            const prodUpdate = products.filter((prodUpdate) => prodUpdate.id === id);

            if (prodUpdate) {
                if(prod.title=='' || prod.description=='' || prod.price=='' || prod.thumbnail=='' || prod.code=='' || prod.stock==''){
                    return console.log("All fields are required")
                }else{
                    products[id-1].title = prod.title
                    products[id-1].description = prod.description
                    products[id-1].price = prod.price
                    products[id-1].thumbnail = prod.thumbnail
                    products[id-1].code = prod.code
                    products[id-1].stock = prod.stock
                    await fs.promises.writeFile(this.path, JSON.stringify(products))
                }
            }

        }catch(e){
            console.log('Error while updating product', e)
        }
    }

    deleteProduct = async (id) => {
        try{
            const products = await this.getProducts()
            const prodToDelete = products.filter((prodToDelete) => prodToDelete.id === id);

            if (prodToDelete[0]) {
                console.log('Deleting......', prodToDelete)
                const index = products.indexOf(prodToDelete[0])
                products.splice(index,1)
                await fs.promises.writeFile(this.path, JSON.stringify(products))
            }else{
                console.log('The product does not exist')
            }

        }catch(e){
            console.log('Error while deleting product', e)
        }
    }
}

async function run() {
    const manager = new ProductManager('products.json')
    console.log(await manager.getProducts())
    await manager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25)
    console.log(await manager.getProducts())
    await manager.getProductById(1)
    await manager.getProductById(10) //Error
    const prodToUpdate = {
        title: 'producto prueba del Update',
        description: 'Este es un producto prueba del Update' ,
        price: 250,
        thumbnail: 'Sin imagen del Update',
        code: 'abc1234',
        stock: 26
    }
    await manager.updateProduct(1,prodToUpdate)
    await manager.deleteProduct(3) //Error
    await manager.deleteProduct(1)
    console.log(await manager.getProducts())
}
run()