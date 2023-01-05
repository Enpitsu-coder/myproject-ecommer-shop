import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DanhGia from '../components/DanhGia';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import SanPham from '../components/SanPham';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

const reducer = ( state, action ) => {
    switch ( action.type ) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                sanpham: action.payload.sanpham,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

const prices = [
    {
        name: '10000VNĐ đến 50000VNĐ',
        value: '10000-50000',
    },
    {
        name: '51000VNĐ đến 200000VNĐ',
        value: '51000-200000',
    },
    {
        name: '200000VNĐ to 500000VNĐ',
        value: '201000-500000',
    },
];

export const ratings = [
    {
        name: '4stars trở lên',
        rating: 4,
    },

    {
        name: '3stars trở lên',
        rating: 3,
    },

    {
        name: '2stars trở lên',
        rating: 2,
    },

    {
        name: '1stars trở lên',
        rating: 1,
    },
];

export default function SearchScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams( search ); // /search?category=Shirts
    const loaisp = sp.get( 'loaisp' ) || 'all';
    const query = sp.get( 'query' ) || 'all';
    const gia = sp.get( 'gia' ) || 'all';
    const danhgia = sp.get( 'danhgia' ) || 'all';
    const order = sp.get( 'order' ) || 'newest';
    const page = sp.get( 'page' ) || 1;

    const [ { loading, error, sanpham, pages, countProducts }, dispatch ] =
        useReducer( reducer, {
            loading: true,
            error: '',
        } );

    useEffect( () => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `/api/sanpham/search?page=${ page }&query=${ query }&loaisp=${ loaisp }&gia=${ gia }&danhgia=${ danhgia }&order=${ order }`
                );
                dispatch( { type: 'FETCH_SUCCESS', payload: data } );
            } catch ( err ) {
                dispatch( {
                    type: 'FETCH_FAIL',
                    payload: getError( error ),
                } );
            }
        };
        fetchData();
    }, [ loaisp, error, order, page, gia, query, danhgia ] );

    const [ categories, setCategories ] = useState( [] );
    useEffect( () => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get( `/api/sanpham/categories` );
                setCategories( data );
            } catch ( err ) {
                toast.error( getError( err ) );
            }
        };
        fetchCategories();
    }, [ dispatch ] );

    const getFilterUrl = ( filter ) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.loaisp || loaisp;
        const filterQuery = filter.query || query;
        const filterRating = filter.danhgia || danhgia;
        const filterPrice = filter.gia || gia;
        const sortOrder = filter.order || order;
        return `/search?loaisp=${ filterCategory }&query=${ filterQuery }&gia=${ filterPrice }&danhgia=${ filterRating }&order=${ sortOrder }&page=${ filterPage }`;
    };
    return (
        <div>
            <Helmet>
                <title>Tìm sản phẩm</title>
            </Helmet>
            <Row>
                <Col md={ 3 }>
                    <h3>Loai</h3>
                    <div>
                        <ul>
                            <li>
                                <Link
                                    className={ 'all' === loaisp ? 'text-bold' : '' }
                                    to={ getFilterUrl( { loaisp: 'all' } ) }
                                >
                                    Any
                                </Link>
                            </li>
                            { categories.map( ( c ) => (
                                <li key={ c }>
                                    <Link
                                        className={ c === loaisp ? 'text-bold' : '' }
                                        to={ getFilterUrl( { loaisp: c } ) }
                                    >
                                        { c }
                                    </Link>
                                </li>
                            ) ) }
                        </ul>
                    </div>
                    <div>
                        <h3>Giá</h3>
                        <ul>
                            <li>
                                <Link
                                    className={ 'all' === gia ? 'text-bold' : '' }
                                    to={ getFilterUrl( { gia: 'all' } ) }
                                >
                                    Any
                                </Link>
                            </li>
                            { prices.map( ( p ) => (
                                <li key={ p.value }>
                                    <Link
                                        to={ getFilterUrl( { gia: p.value } ) }
                                        className={ p.value === gia ? 'text-bold' : '' }
                                    >
                                        { p.name }
                                    </Link>
                                </li>
                            ) ) }
                        </ul>
                    </div>
                    <div>
                        {/* <h3>Đánh giá khách hàng</h3>
                        <ul>
                            { ratings.map( ( r ) => (
                                <li key={ r.name }>
                                    <Link
                                        to={ getFilterUrl( { rating: r.ranting } ) }
                                        className={ `${ r.ranting }` === `${ danhgia }` ? 'text-bold' : '' }
                                    >
                                        <DanhGia caption={ ' trở lên' } rating={ r.rating }></DanhGia>
                                    </Link>
                                </li>
                            ) ) }
                            <li>
                                <Link
                                    to={ getFilterUrl( { danhgia: 'all' } ) }
                                    className={ danhgia === 'all' ? 'text-bold' : '' }
                                >
                                    <DanhGia caption={ ' trở lên' } danhgia={ 0 }></DanhGia>
                                </Link>
                            </li>
                        </ul> */}
                    </div>
                </Col>
                <Col md={ 9 }>
                    { loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{ error }</MessageBox>
                    ) : (
                        <>
                            <Row className="justify-content-between mb-3">
                                <Col md={ 6 }>
                                    <div>
                                        { countProducts === 0 ? 'No' : countProducts } Results
                                        { query !== 'all' && ' : ' + query }
                                        { loaisp !== 'all' && ' : ' + loaisp }
                                        { gia !== 'all' && ' : gia ' + gia }
                                        { danhgia !== 'all' && ' : danhgia ' + danhgia + ' & up' }
                                        { query !== 'all' ||
                                            loaisp !== 'all' ||
                                            danhgia !== 'all' ||
                                            gia !== 'all' ? (
                                            <Button
                                                variant="light"
                                                onClick={ () => navigate( '/search' ) }
                                            >
                                                <i className="fas fa-times-circle"></i>
                                            </Button>
                                        ) : null }
                                    </div>
                                </Col>
                                <Col className="text-end">
                                    Xếp theo{ ' ' }
                                    <select
                                        value={ order }
                                        onChange={ ( e ) => {
                                            navigate( getFilterUrl( { order: e.target.value } ) );
                                        } }
                                    >
                                        <option value="newest">Mới nhất</option>
                                        <option value="lowest">Giá: thấp đến cao</option>
                                        <option value="highest">Giá: cao đến thấp</option>
                                        <option value="toprated">Đánh giá bình quân</option>
                                    </select>
                                </Col>
                            </Row>
                            { sanpham.length === 0 && (
                                <MessageBox>Không tìm thấy sản phẩm</MessageBox>
                            ) }

                            <Row>
                                { sanpham.map( ( sp ) => (
                                    <Col sm={ 6 } lg={ 4 } className="mb-3" key={ sp._id }>
                                        <SanPham sp={ sp }></SanPham>
                                    </Col>
                                ) ) }
                            </Row>

                            <div>
                                { [ ...Array( pages ).keys() ].map( ( x ) => (
                                    <LinkContainer
                                        key={ x + 1 }
                                        className="mx-1"
                                        to={ {
                                            pathname: "/search",
                                            search: getFilterUrl( { page: x + 1 } ).substring( 7 ),
                                        } }
                                    >
                                        <Button
                                            className={ Number( page ) === x + 1 ? 'text-bold' : '' }
                                            variant="light"
                                        >
                                            { x + 1 }
                                        </Button>
                                    </LinkContainer>
                                ) ) }
                            </div>
                        </>
                    ) }
                </Col>
            </Row>
        </div>
    );
}