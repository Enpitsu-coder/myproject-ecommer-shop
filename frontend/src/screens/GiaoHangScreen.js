import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import BuocTinhTien from '../components/BuocTinhTien';

export default function GiaoHangScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext( Store );
    const {
        userInfo,
        giohang: { shippingAddress },
    } = state;
    const [ hoten, setFullName ] = useState( shippingAddress.hoten || '' );
    const [ diachi, setAddress ] = useState( shippingAddress.diachi || '' );
    const [ thanhpho, setCity ] = useState( shippingAddress.thanhpho || '' );

    useEffect( () => {
        if ( !userInfo ) {
            navigate( '/dangnhap?redirect=/shipping' );
        }
    }, [ userInfo, navigate ] );
    const submitHandler = ( e ) => {
        e.preventDefault();
        ctxDispatch( {
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                hoten,
                diachi,
                thanhpho,
            },
        } );
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify( {
                hoten,
                diachi,
                thanhpho,
            } )
        );
        navigate( '/thanhtoan' );
    };
    return (
        <div>
            <Helmet>
                <title>Địa chỉ giao hàng</title>
            </Helmet>

            <BuocTinhTien step1 step2></BuocTinhTien>
            <div className="container small-container">
                <h1 className="my-3">Địa chỉ giao hàng</h1>
                <Form onSubmit={ submitHandler }>
                    <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                            value={ hoten }
                            onChange={ ( e ) => setFullName( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                            value={ diachi }
                            onChange={ ( e ) => setAddress( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>Thành phố</Form.Label>
                        <Form.Control
                            value={ thanhpho }
                            onChange={ ( e ) => setCity( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <div className="mb-3">
                        <Button variant="primary" type="submit">
                            Tiếp tục
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}