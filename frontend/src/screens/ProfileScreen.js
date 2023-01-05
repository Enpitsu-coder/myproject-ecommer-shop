import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = ( state, action ) => {
    switch ( action.type ) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };

        default:
            return state;
    }
};

export default function ProfileScreen() {
    const { state, dispatch: ctxDispatch } = useContext( Store );
    const { userInfo } = state;
    const [ ten, setName ] = useState( userInfo.ten );
    const [ email, setEmail ] = useState( userInfo.email );
    const [ password, setPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );

    const [ { loadingUpdate }, dispatch ] = useReducer( reducer, {
        loadingUpdate: false,
    } );

    const submitHandler = async ( e ) => {
        e.preventDefault();
        if ( password !== confirmPassword ) {
            toast.error( 'Password không trùng' );
            return;
        }
        try {
            const { data } = await axios.put(
                '/api/nguoidung/profile',
                {
                    ten,
                    email,
                    password,
                },
                {
                    headers: { Authorization: `Bearer ${ userInfo.token }` },
                }
            );
            dispatch( {
                type: 'UPDATE_SUCCESS',
            } );
            ctxDispatch( { type: 'NGƯỜI_DÙNG_ĐĂNG_NHẬP', payload: data } );
            localStorage.setItem( 'userInfo', JSON.stringify( data ) );
            toast.success( 'Đã cập nhật thông tin người dùng' );
        } catch ( err ) {
            dispatch( {
                type: 'FETCH_FAIL',
            } );
            toast.error( getError( err ) );
        }
    };

    return (
        <div className="container small-container">
            <Helmet>
                <title>Hồ sơ người dùng</title>
            </Helmet>
            <h1 className="my-3">Hồ sơ người dùng</h1>
            <form onSubmit={ submitHandler }>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                        value={ ten }
                        onChange={ ( e ) => setName( e.target.value ) }
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={ email }
                        onChange={ ( e ) => setEmail( e.target.value ) }
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={ ( e ) => setPassword( e.target.value ) }
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={ ( e ) => setConfirmPassword( e.target.value ) }
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Cập nhật</Button>
                </div>
            </form>
        </div>
    );
}