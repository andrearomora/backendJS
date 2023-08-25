const socket = io()
let cartId = localStorage.getItem('cartId') || ''

if(localStorage.getItem("cartId")){
    console.log('Already have a cart with id: ' + cartId)
}else{
    socket.emit('new-cart')
    
    console.log('Cart created!')
}

socket.on('cart-id', data => {
    localStorage.setItem("cartId", data)
    cartId = data
})

const cartURL = `/cart/${cartId}`
document.getElementById('cart').innerHTML = `<a href="${cartURL}" class="nav-link">CART</a>`