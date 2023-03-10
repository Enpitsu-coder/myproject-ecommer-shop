import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = ( state, action ) => {
    switch ( action.type ) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                orders: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};
export default function OrderListScreen() {
    const navigate = useNavigate();
    const { state } = useContext( Store );
    const { userInfo } = state;
    const [ { loading, error, orders, loadingDelete, successDelete }, dispatch ] =
        useReducer( reducer, {
            loading: true,
            error: '',
        } );

    useEffect( () => {
        const fetchData = async () => {
            try {
                dispatch( { type: 'FETCH_REQUEST' } );
                const { data } = await axios.get( `/api/orders`, {
                    headers: { Authorization: `Bearer ${ userInfo.token }` },
                } );
                dispatch( { type: 'FETCH_SUCCESS', payload: data } );
            } catch ( err ) {
                dispatch( {
                    type: 'FETCH_FAIL',
                    payload: getError( err ),
                } );
            }
        };
        if ( successDelete ) {
            dispatch( { type: 'DELETE_RESET' } );
        } else {
            fetchData();
        }
    }, [ userInfo, successDelete ] );

    const deleteHandler = async ( order ) => {
        if ( window.confirm( 'Ch???c ch???n x??a?' ) ) {
            try {
                dispatch( { type: 'DELETE_REQUEST' } );
                await axios.delete( `/api/orders/${ order._id }`, {
                    headers: { Authorization: `Bearer ${ userInfo.token }` },
                } );
                toast.success( 'X??a th??nh c??ng' );
                dispatch( { type: 'DELETE_SUCCESS' } );
            } catch ( err ) {
                toast.error( getError( error ) );
                dispatch( {
                    type: 'DELETE_FAIL',
                } );
            }
        }
    };

    return (
        <div>
            <Helmet>
                <title>????n</title>
            </Helmet>
            <h1>????n</h1>
            { loadingDelete && <LoadingBox></LoadingBox> }
            { loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{ error }</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ng?????i d??ng</th>
                            <th>Ng??y</th>
                            <th>T???ng c???ng</th>
                            <th>PAID</th>
                            <th>V???n chuy???n</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        { orders.map( ( order ) => (
                            <tr key={ order._id }>
                                <td>{ order._id }</td>
                                <td>{ order.nguoidung ? order.nguoidung.ten : 'DELETED USER' }</td>
                                <td>{ order.createdAt.substring( 0, 10 ) }</td>
                                <td>{ order.tongcong }</td>
                                <td>{ order.isPaid ? order.paidAt.substring( 0, 10 ) : 'Ch??a' }</td>
                                <td>
                                    { order.isDelivered
                                        ? order.deliveredAt.substring( 0, 10 )
                                        : 'Ch??a' }
                                </td>
                                <td>
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={ () => {
                                            navigate( `/order/${ order._id }` );
                                        } }
                                    >
                                        Chi ti???t
                                    </Button>
                                    &nbsp;
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={ () => deleteHandler( order ) }
                                    >
                                        X??a
                                    </Button>
                                </td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            ) }
        </div>
    );
}