import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';

const reducer = ( state, action ) => {
    switch ( action.type ) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
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
export default function ProductEditScreen() {
    const navigate = useNavigate();
    const params = useParams(); // /product/:id
    const { id: productId } = params;

    const { state } = useContext( Store );
    const { userInfo } = state;
    const [ { loading, error, loadingUpdate }, dispatch ] = useReducer( reducer, {
        loading: true,
        error: '',
    } );

    const [ tensp, setName ] = useState( '' );
    const [ slug, setSlug ] = useState( '' );
    const [ gia, setPrice ] = useState( '' );
    const [ anh, setImage ] = useState( '' );
    const [ loaisp, setCategory ] = useState( '' );
    const [ soluong, setCountInStock ] = useState( '' );
    const [ ncc, setBrand ] = useState( '' );
    const [ mota, setDescription ] = useState( '' );

    useEffect( () => {
        const fetchData = async () => {
            try {
                dispatch( { type: 'FETCH_REQUEST' } );
                const { data } = await axios.get( `/api/sanpham/${ productId }` );
                setName( data.tensp );
                setSlug( data.slug );
                setPrice( data.gia );
                setImage( data.anh );
                setCategory( data.loaisp );
                setCountInStock( data.soluong );
                setBrand( data.ncc );
                setDescription( data.mota );
                dispatch( { type: 'FETCH_SUCCESS' } );
            } catch ( err ) {
                dispatch( {
                    type: 'FETCH_FAIL',
                    payload: getError( err ),
                } );
            }
        };
        fetchData();
    }, [ productId ] );

    const submitHandler = async ( e ) => {
        e.preventDefault();
        try {
            dispatch( { type: 'UPDATE_REQUEST' } );
            await axios.put(
                `/api/sanpham/${ productId }`,
                {
                    _id: productId,
                    tensp,
                    slug,
                    gia,
                    anh,
                    loaisp,
                    ncc,
                    soluong,
                    mota,
                },
                {
                    headers: { Authorization: `Bearer ${ userInfo.token }` },
                }
            );
            dispatch( {
                type: 'UPDATE_SUCCESS',
            } );
            toast.success( 'Cập nhật thành công' );
            navigate( '/admin/products' );
        } catch ( err ) {
            toast.error( getError( err ) );
            dispatch( { type: 'UPDATE_FAIL' } );
        }
    };

    return (
        <Container className="small-container">
            <Helmet>
                <title>Sửa sản phẩm ${ productId }</title>
            </Helmet>
            <h1>Sửa sản phẩm { productId }</h1>

            { loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{ error }</MessageBox>
            ) : (
                <Form onSubmit={ submitHandler }>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control
                            value={ tensp }
                            onChange={ ( e ) => setName( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="slug">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                            value={ slug }
                            onChange={ ( e ) => setSlug( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control
                            value={ gia }
                            onChange={ ( e ) => setPrice( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Image File</Form.Label>
                        <Form.Control
                            value={ anh }
                            onChange={ ( e ) => setImage( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Thể loại</Form.Label>
                        <Form.Control
                            value={ loaisp }
                            onChange={ ( e ) => setCategory( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="brand">
                        <Form.Label>Hãng</Form.Label>
                        <Form.Control
                            value={ ncc }
                            onChange={ ( e ) => setBrand( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="countInStock">
                        <Form.Label>Số lượng tồn</Form.Label>
                        <Form.Control
                            value={ soluong }
                            onChange={ ( e ) => setCountInStock( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            value={ mota }
                            onChange={ ( e ) => setDescription( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <div className="mb-3">
                        <Button disabled={ loadingUpdate } type="submit">
                            Cập nhật
                        </Button>
                        { loadingUpdate && <LoadingBox></LoadingBox> }
                    </div>
                </Form>
            ) }
        </Container>
    );
}