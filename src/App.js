import React, {useState, useEffect} from 'react';
import {commerce} from './lib/commerce.js';
import {Navbar, Products, Cart, Checkout} from './components';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

const App = () => {
    const [products, setProducts]= useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const {data} = await commerce.products.list();
        setProducts(data);
    }

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    }

    const handleAddToCart = async (productID,quantity) => {
        const item= await commerce.cart.add(productID,quantity);
        setCart (item.cart);
    }

    const handleUpdateCart = async (productID,quantity) => {
        const {cart}= await commerce.cart.update(productID, {quantity});
        setCart (cart);
    }

    const handleRemoveFromCart = async (productID) => {
        const {cart}= await commerce.cart.remove(productID);
        setCart (cart);
    }

    const handleEmptyCart = async () => {
        const {cart}= await commerce.cart.empty();
        setCart (cart);
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
    
        setCart(newCart);
    };
    
    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
          const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
          setOrder(incomingOrder);

          refreshCart();
        } catch (error) {
          setErrorMessage(error.data.error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, [])
    
    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items}/>
                <Routes>
                    <Route path="/" element={<Products products={products} onAddToCart={handleAddToCart}/>}></Route>
                    <Route path="/cart" element={<Cart cart={cart} handleEmptyCart={handleEmptyCart} handleRemoveFromCart={handleRemoveFromCart} handleUpdateCart={handleUpdateCart}/>}></Route>
                    <Route path="/checkout" element={<Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage}/>}/>
                </Routes>
            </div>
        </Router>
    )
}

export default App;