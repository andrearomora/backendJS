class ProductManager {

    constructor() {
        this.products = []
    }

    getProducts = () => { return this.products }

    getNextID = () => {
        const count = this.products.length
        const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;
        return nextId
    }

    addProduct = (title,description,price,thumbnail,code,stock) => {

        const [product1] = this.products.filter((product1) => product1.code === code);

        if(!product1){
            if(title!='' && description!='' && price!='' && thumbnail!='' && code!='' && stock!='' && code!=''){
                const product = {
                    id: this.getNextID(),
                    title,
                    description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock
                }
                this.products.push(product)
                }else{
                    console.log("All fields are required")
                }
        }else{
            console.log("The product already exists")
        }
    }

    getProductById = (idSearch) => { 
        
        const [productById] = this.products.filter((productById) => productById.id === idSearch);
        
        if(productById){
            console.log(productById)
            return productById
        }else{
            console.log("Not found")
        }
    }
}

const manager = new ProductManager()
console.log(manager.getProducts())
manager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25)
console.log(manager.getProducts())
manager.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25)
manager.addProduct('producto prueba','',200,'Sin imagen','abc124',25)

manager.getProductById(1)
manager.getProductById(2)

console.log(manager.getProducts())
