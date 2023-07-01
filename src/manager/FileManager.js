import { log } from 'console'
import fs from 'fs'

class FileManager {

    constructor(filename = './db.json') {
        this.path = filename
        this.format = 'utf-8'
    }

    getProducts = async () => { 
        try{
            const products = await fs.promises.readFile(this.path, this.format)
            const productsObj = JSON.parse(products)
            return productsObj
        }catch(e){
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

    getProductById = async (idSearch) => { 
        try{
            const products = await this.getProducts()
            const [productById] = products.filter((productById) => productById.id === idSearch);

            if(productById){
                return productById
            }else{
                return `ID ${idSearch} Not found`
            }
        }catch(e){
            return `Error while searching by Id, ${e}`
        }
    }

    addProduct = async (title,description,price,thumbnail,code,stock,status,category) => {
        try {
            if(title=='' || description=='' || price=='' || thumbnail=='' || code=='' || stock=='' || code=='' || category==''){
                return console.log("All fields are required")
                }else{
                    //Assigning the field status as a boolean
                    if (!status || status!='false') status=true 
                    else status=false 
                }

            const product = {
                id: await this.getNextID(),
                title: title,
                description: description,
                price: Number.parseInt(price),
                thumbnail: thumbnail,
                code: code,
                stock: Number.parseInt(stock),
                status: status,
                category: category
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

    updateProduct = async (id, prod) => {
        try{
            const products = await this.getProducts()
            const prodUpdate = products.filter((prodUpdate) => prodUpdate.id === id);

            if (prodUpdate) {
                if(prod.title=='' || prod.description=='' || prod.price=='' || prod.thumbnail=='' || prod.code=='' || prod.stock=='' || prod.status=='' || prod.category==''){
                    return "All fields are required"
                }else{
                    
                    //Assigning the field status as a boolean
                    if (!prod.status || prod.status!='false') prod.status=true 
                    else prod.status=false 

                    //Finding the index of de product to update
                    let i = products.map(product => product.id).indexOf(id);

                    products[i].title = prod.title
                    products[i].description = prod.description
                    products[i].price = prod.price
                    products[i].thumbnail = prod.thumbnail
                    products[i].code = prod.code
                    products[i].stock = prod.stock
                    products[i].status = prod.status
                    products[i].category = prod.category
                    await fs.promises.writeFile(this.path, JSON.stringify(products))
                    return `The product with id: ${id} was updated`
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
                return `The product with id ${id} was deleted`
            }else{
                return console.log('The product does not exist')
            }

        }catch(e){
            return console.log('Error while deleting product', e)
        }
    }

    //CART

    addCart = async (data) => {
        const list = await this.getProducts()
        data.id = this.getNextID()
        list.push(data)
        return fs.promises.writeFile(this.path, JSON.stringify(list))
    }

    addToCart = async (data) => {
        try {
            const list = await this.getProducts()
            data.id = this.getNextId(list)
            list.push(data)
            return fs.promises.writeFile(this.filename, JSON.stringify(list))
        } catch (e) {
            return console.log('Error while creating the product')
        }
    }


}

export default FileManager