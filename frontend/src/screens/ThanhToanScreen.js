import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import BuocTinhTien from '../components/BuocTinhTien';
import { Store } from '../Store';

export default function ThanhToanScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext( Store );
    const {
        giohang: { shippingAddress, paymentMethod },
    } = state;

    const [ paymentMethodName, setPaymentMethod ] = useState(
        paymentMethod || 'PayPal'
    );

    useEffect( () => {
        if ( !shippingAddress.diachi ) {
            navigate( '/shipping' );
        }
    }, [ shippingAddress, navigate ] );
    const submitHandler = ( e ) => {
        e.preventDefault();
        ctxDispatch( { type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName } );
        localStorage.setItem( 'paymentMethod', paymentMethodName );
        navigate( '/placeorder' );
    };
    return (
        <div>
            <BuocTinhTien step1 step2 step3></BuocTinhTien>
            <div className="container small-container">
                <Helmet>
                    <title>Phương thức thanh toán</title>
                </Helmet>
                <h1 className="my-3">Phương thức thanh toán</h1>
                <Form onSubmit={ submitHandler }>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="PayPal"
                            label="PayPal"
                            value="PayPal"
                            checked={ paymentMethodName === 'PayPal' }
                            onChange={ ( e ) => setPaymentMethod( e.target.value ) }
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Stripe"
                            label="Stripe"
                            value="Stripe"
                            checked={ paymentMethodName === 'Stripe' }
                            onChange={ ( e ) => setPaymentMethod( e.target.value ) }
                        />
                    </div>
                    <div className="mb-3">
                        <Button type="submit">Tiếp tục</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}