import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SignupScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams( search ).get( 'redirect' );
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [ ten, setName ] = useState( '' );
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );

    const { state, dispatch: ctxDispatch } = useContext( Store );
    const { userInfo } = state;
    const submitHandler = async ( e ) => {
        e.preventDefault();
        if ( password !== confirmPassword ) {
            toast.error( 'Mật khẩu nhập lại không đúng' );
            return;
        }
        try {
            const { data } = await Axios.post( '/api/nguoidung/dangki', {
                ten,
                email,
                password,
            } );
            ctxDispatch( { type: 'NGƯỜI_DÙNG_ĐĂNG_NHẬP', payload: data } );
            localStorage.setItem( 'userInfo', JSON.stringify( data ) );
            navigate( redirect || '/' );
        } catch ( err ) {
            toast.error( getError( err ) );
        }
    };

    useEffect( () => {
        if ( userInfo ) {
            navigate( redirect );
        }
    }, [ navigate, redirect, userInfo ] );

    return (
        <Container className="small-container">
            <Helmet>
                <title>Đăng kí</title>
            </Helmet>
            <h1 className="my-3">Đăng kí</h1>
            <Form onSubmit={ submitHandler }>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control onChange={ ( e ) => setName( e.target.value ) } required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        required
                        onChange={ ( e ) => setEmail( e.target.value ) }
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        onChange={ ( e ) => setPassword( e.target.value ) }
                    />
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            onChange={ ( e ) => setConfirmPassword( e.target.value ) }
                            required
                        />
                    </Form.Group>
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Đăng kí</Button>
                </div>
                <div className="mb-3">
                    Đã có tài khoản?{ ' ' }
                    <Link to={ `/dangnhap?redirect=${ redirect }` }>Đăng nhập</Link>
                </div>
            </Form>
        </Container>
    );
}