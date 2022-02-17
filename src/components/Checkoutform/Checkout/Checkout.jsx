import React, {useState, useEffect} from 'react'
import {CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button} from '@material-ui/core';
import useStyles from './styles.js';
import AddressForm from '../AddressForm.jsx';
import PaymentForm from '../PaymentForm.jsx';
import {commerce} from '../../../lib/commerce.js';
import {Link, useNavigate} from 'react-router-dom';

const steps=['Shipping Address', 'Payment Details']

const Checkout = ({cart, order, onCaptureCheckout, error}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkOutToken, setcheckOutToken]= useState(null);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setisFinished] = useState(false);
    const classes=useStyles();
    const history=useNavigate();

    useEffect(()=>{
        const generateToken = async () => {
            try {
                const token= await commerce.checkout.generateToken(cart.id, {type:'cart'});
                setcheckOutToken(token);
            }
            catch (err) {
                history.pushState('/');
            }
        }
        generateToken();
    },[cart])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const next = (data) => {
        setShippingData(data);
    
        nextStep();
    };

    const timeout = () => {
        setTimeout(() => {
            setisFinished(true);
        },3000)
    }


    let Confirmation = () => (order.customer ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
                <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
    ) :isFinished ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase.</Typography>
                <Divider className={classes.divider} />
            </div>
            <br />
                <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
    ): (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    ));
    
    if (error) {
        Confirmation = () => (
          <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
          </>
        );
    }
    const Form = () => activeStep===0
    ? <AddressForm checkoutToken={checkOutToken} next={next}/> 
    : <PaymentForm timeout={timeout} onCaptureCheckout={onCaptureCheckout} checkoutToken={checkOutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData}/>

    return (
        <>
        <CssBaseline />
        <div className={classes.toolbar}></div>
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant='h4' align='center'>Checkout</Typography>
                <Stepper activeStep={activeStep} className={classes.stepper}>
                    {
                        steps.map((step => (
                            <Step key={step}>
                            <StepLabel>{step}</StepLabel> 
                            </Step>
                        )))
                    }
                </Stepper>
                {activeStep === steps.length ? <Confirmation/> : checkOutToken && <Form />}
            </Paper>
        </main>
        </>
    )
}

export default Checkout;
