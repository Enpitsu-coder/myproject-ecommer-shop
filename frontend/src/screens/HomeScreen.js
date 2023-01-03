import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SanPham from '../components/SanPham';
import { Helmet } from 'react-helmet-async';

const reducer = ( state, action ) => {
    switch ( action.type ) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, sanpham: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function HomeScreen() {
    const [ { loading, error, sanpham }, dispatch ] = useReducer( logger( reducer ), {
        sanpham: [],
        loading: true,
        error: '',
    } );
    useEffect( () => {
        const fetchData = async () => {
            dispatch( { type: 'FETCH_REQUEST' } );
            try {
                const result = await axios.get( '/api/sanpham' );
                dispatch( { type: 'FETCH_SUCCESS', payload: result.data } );
            } catch ( err ) {
                dispatch( { type: 'FETCH_FAIL', payload: err.message } );
            }
        };
        fetchData();
    }, [] );
    return (
        <div>
            <Helmet>
                <title>Trầm Nhi's Store</title>
            </Helmet>
            <h1>Sản phẩm nổi bật</h1>
            <div className="sanpham">
                { loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{ error }</div>
                ) : (
                    <Row>
                        { sanpham.map( ( sp ) => (
                            <Col key={ sp.slug } sm={ 6 } md={ 4 } lg={ 3 } className="mb-3">
                                <SanPham sp={ sp }>S</SanPham>
                            </Col>
                        ) ) }
                    </Row>
                ) }
            </div>
        </div >
    );
}
export default HomeScreen;