import React, {useState, useEffect} from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import {useForm, FormProvider} from 'react-hook-form';
import { commerce } from '../../lib/commerce';
import { Link } from 'react-router-dom';


import CustomTextField from './CustomTextField';

const AddressForm = ({checkoutToken, next}) => {
    const [shippingCountries, setshippingCountries] = useState([]);
    const [shippingCountry, setshippingCountry] = useState('');
    const [shippingSubdivisions, setshippingSubdivisions] = useState([]);
    const [shippingSubdivision, setshippingSubdivision] = useState('');
    const [shippingOptions, setshippingOptions] = useState([]);
    const [shippingOption, setshippingOption] = useState('');

    const methods = useForm();

    const countries=Object.entries(shippingCountries).map(([code, countryname]) =>({id:code,label:countryname}));
    const subdivisions=Object.entries(shippingSubdivisions).map(([code, divisionname]) =>({id:code,label:divisionname}));

    const fetchShippingCountries = async (checkoutTokenId) => {
        const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);
        setshippingCountries(countries);
        setshippingCountry(Object.keys(countries)[0]);
    }

    const fetchSubdivisions = async (countryCode) => {
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);
        setshippingSubdivisions(subdivisions);
        setshippingSubdivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });
    
        setshippingOptions(options);
        setshippingOption(options[0].id);
      };

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    },[])

    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry);
    },[shippingCountry])

    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
      }, [shippingSubdivision]);    

    return (
        <>
            <Typography variant='h6' gutterBottom>Shipping Details</Typography>
            <FormProvider {... methods}>
                <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
                    <Grid container spacing={3}>
                        <CustomTextField required name='FirstName' label='First Name'/>
                        <CustomTextField required name='LastName' label='Last Name'/>
                        <CustomTextField required name='Email' label='E-mail'/>
                        <CustomTextField required name='Address1' label='Address'/>
                        <CustomTextField required name='city' label='City'/>
                        <CustomTextField required name='ZIP' label='ZIP or Postal Code'/>
                       <Grid item xs={12} s={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setshippingCountry(e.target.value)}>
                                {countries.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>{country.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} s={6}>
                            <InputLabel>Shipping SubDivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setshippingSubdivision(e.target.value)}>
                                {subdivisions.map((subdivision) => (
                                    <MenuItem key={subdivision.id} value={subdivision.id}>{subdivision.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} s={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setshippingOption(e.target.value)}>
                                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
