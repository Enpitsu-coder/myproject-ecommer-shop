import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';

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
            <h1>Sản phẩm nổi bật</h1>
            <div className="sanpham">
                { loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{ error }</div>
                ) : (
                    sanpham.map( ( sp ) => (
                        <div className="sp" key={ sp.slug }>
                            <Link to={ `/sanpham/${ sp.slug }` }>
                                <img src={ sp.anh } alt={ sp.tensp } />
                            </Link>
                            <div className="sp-thongtin">
                                <Link to={ `/sanpham/${ sp.slug }` }>
                                    <p>{ sp.tensp }</p>
                                </Link>
                                <p><strong>{ sp.gia } VNĐ</strong></p>
                                <button>Thêm vào giỏ</button>
                            </div>
                        </div>
                    ) )
                ) }
            </div>
        </div >
    );
}
export default HomeScreen;