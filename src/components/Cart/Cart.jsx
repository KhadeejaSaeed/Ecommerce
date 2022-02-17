import React from 'react'
import {Container, Typography, Button, Grid} from "@material-ui/core";
import {Link} from 'react-router-dom';

import useStyles from './styles.js'
import CartItem from './CartItem/CartItem.jsx'

const Cart = ({cart, handleEmptyCart, handleUpdateCart, handleRemoveFromCart}) => {

    const classes= useStyles();

    const EmptyCart = () => (
        <Typography variant="subtitle1">
            Your shopping cart is Empty! <Link to="/" className={classes.link}>Go add some to it.</Link>
        </Typography>
    )
    
    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item)=> (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} handleRemoveFromCart={handleRemoveFromCart} handleUpdateCart={handleUpdateCart} />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    SubTotal: {cart.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                    <Button className={classes.EmptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart</Button>
                    <Button component={Link} to="/checkout" className={classes.EmptyButton} size="large" type="button" variant="contained" color="primary">Checkout</Button>
                </div>
            </div>
        </>
    )

    if(!cart.line_items) return 'Loading ...';

    return (
        <Container>
            <div className={classes.toolbar}></div>
            <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Cart!</Typography>
            {!cart.line_items.length ? <EmptyCart/> : <FilledCart/>}
        </Container>
    )
}

export default Cart
