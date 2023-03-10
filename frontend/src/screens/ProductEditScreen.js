import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
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
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };
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
    const [ { loading, error, loadingUpdate, loadingUpload }, dispatch ] =
        useReducer( reducer, {
            loading: true,
            error: '',
        } );

    const [ tensp, setName ] = useState( '' );
    const [ slug, setSlug ] = useState( '' );
    const [ gia, setPrice ] = useState( '' );
    const [ anh, setImage ] = useState( '' );
    const [ images, setImages ] = useState( [] );
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
                setImages( data.images );
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
                    images,
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
            toast.success( 'C???p nh???t th??nh c??ng' );
            navigate( '/admin/products' );
        } catch ( err ) {
            toast.error( getError( err ) );
            dispatch( { type: 'UPDATE_FAIL' } );
        }
    };
    const uploadFileHandler = async ( e, forImages ) => {
        const file = e.target.files[ 0 ];
        const bodyFormData = new FormData();
        bodyFormData.append( 'file', file );
        try {
            dispatch( { type: 'UPLOAD_REQUEST' } );
            const { data } = await axios.post( '/api/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${ userInfo.token }`,
                },
            } );
            dispatch( { type: 'UPLOAD_SUCCESS' } );

            if ( forImages ) {
                setImages( [ ...images, data.secure_url ] );
            } else {
                setImage( data.secure_url );
            }
            toast.success( 'Upload th??nh c??ng' );
        } catch ( err ) {
            toast.error( getError( err ) );
            dispatch( { type: 'UPLOAD_FAIL', payload: getError( err ) } );
        }
    };
    const deleteFileHandler = async ( fileName, f ) => {
        console.log( fileName, f );
        console.log( images );
        console.log( images.filter( ( x ) => x !== fileName ) );
        setImages( images.filter( ( x ) => x !== fileName ) );
        toast.success( 'Remove ???nh th??nh c??ng' );
    };
    return (
        <Container className="small-container">
            <Helmet>
                <title>S???a s???n ph???m ${ productId }</title>
            </Helmet>
            <h1>S???a s???n ph???m { productId }</h1>

            { loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{ error }</MessageBox>
            ) : (
                <Form onSubmit={ submitHandler }>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>T??n</Form.Label>
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
                        <Form.Label>Gi??</Form.Label>
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
                    <Form.Group className="mb-3" controlId="imageFile">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type="file" onChange={ uploadFileHandler } />
                        { loadingUpload && <LoadingBox></LoadingBox> }
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="additionalImage">
                        <Form.Label>Th??m Images</Form.Label>
                        { images.length === 0 && <MessageBox>Kh??ng c?? ???nh</MessageBox> }
                        <ListGroup variant="flush">
                            { images.map( ( x ) => (
                                <ListGroup.Item key={ x }>
                                    { x }
                                    <Button variant="light" onClick={ () => deleteFileHandler( x ) }>
                                        <i className="fa fa-times-circle"></i>
                                    </Button>
                                </ListGroup.Item>
                            ) ) }
                        </ListGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="additionalImageFile">
                        <Form.Label>Upload Th??m Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={ ( e ) => uploadFileHandler( e, true ) }
                        />
                        { loadingUpload && <LoadingBox></LoadingBox> }
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Th??? lo???i</Form.Label>
                        <Form.Control
                            value={ loaisp }
                            onChange={ ( e ) => setCategory( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="brand">
                        <Form.Label>H??ng</Form.Label>
                        <Form.Control
                            value={ ncc }
                            onChange={ ( e ) => setBrand( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="countInStock">
                        <Form.Label>S??? l?????ng t???n</Form.Label>
                        <Form.Control
                            value={ soluong }
                            onChange={ ( e ) => setCountInStock( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>M?? t???</Form.Label>
                        <Form.Control
                            value={ mota }
                            onChange={ ( e ) => setDescription( e.target.value ) }
                            required
                        />
                    </Form.Group>
                    <div className="mb-3">
                        <Button disabled={ loadingUpdate } type="submit">
                            C???p nh???t
                        </Button>
                        { loadingUpdate && <LoadingBox></LoadingBox> }
                    </div>
                </Form>
            ) }
        </Container>
    );
}