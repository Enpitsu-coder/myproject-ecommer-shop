import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';

function reducer( state, action ) {
    switch ( action.type ) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true };
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true };
        case 'PAY_FAIL':
            return { ...state, loadingPay: false };
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false };

        default:
            return state;
    }
}
export default function DatHangScreen() {
    const { state } = useContext( Store );
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();

    const [ { loading, error, order, successPay, loadingPay }, dispatch ] =
        useReducer( reducer, {
            loading: true,
            order: {},
            error: '',
            successPay: false,
            loadingPay: false,
        } );

    const [ { isPending }, paypalDispatch ] = usePayPalScriptReducer();

    function createOrder( data, actions ) {
        return actions.order
            .create( {
                purchase_units: [
                    {
                        amount: { value: order.tongcong },
                    },
                ],
            } )
            .then( ( orderID ) => {
                return orderID;
            } );
    }

    function onApprove( data, actions ) {
        return actions.order.capture().then( async function ( details ) {
            try {
                dispatch( { type: 'PAY_REQUEST' } );
                const { data } = await axios.put(
                    `/api/orders/${ order._id }/pay`,
                    details,
                    {
                        headers: { authorization: `Bearer ${ userInfo.token }` },
                    }
                );
                dispatch( { type: 'PAY_SUCCESS', payload: data } );
                toast.success( 'Đã thanh toán' );
            } catch ( err ) {
                dispatch( { type: 'PAY_FAIL', payload: getError( err ) } );
                toast.error( getError( err ) );
            }
        } );
    }
    function onError( err ) {
        toast.error( getError( err ) );
    }

    useEffect( () => {
        const fetchOrder = async () => {
            try {
                dispatch( { type: 'FETCH_REQUEST' } );
                const { data } = await axios.get( `/api/orders/${ orderId }`, {
                    headers: { authorization: `Bearer ${ userInfo.token }` },
                } );
                dispatch( { type: 'FETCH_SUCCESS', payload: data } );
            } catch ( err ) {
                dispatch( { type: 'FETCH_FAIL', payload: getError( err ) } );
            }
        };

        if ( !userInfo ) {
            return navigate( '/dangnhap' );
        }
        if ( !order._id || successPay || ( order._id && order._id !== orderId ) ) {
            fetchOrder();
            if ( successPay ) {
                dispatch( { type: 'PAY_RESET' } );
            }
        } else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get( '/api/keys/paypal', {
                    headers: { authorization: `Bearer ${ userInfo.token }` },
                } );
                paypalDispatch( {
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD',
                    },
                } );
                paypalDispatch( { type: 'setLoadingStatus', value: 'pending' } );
            };
            loadPaypalScript();
        }
    }, [ order, userInfo, orderId, navigate, paypalDispatch, successPay ] );
    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{ error }</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Đơn hàng { orderId }</title>
            </Helmet>
            <h1 className="my-3">Đơn hàng { orderId }</h1>
            <Row>
                <Col md={ 8 }>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Vận chuyển</Card.Title>
                            <Card.Text>
                                <strong>Tên:</strong> { order.shippingAddress.hoten } <br />
                                <strong>Địa chỉ: </strong> { order.shippingAddress.diachi },
                                { order.shippingAddress.thanhpho }
                            </Card.Text>
                            { order.isDelivered ? (
                                <MessageBox variant="success">
                                    Ngày giao: { order.deliveredAt }
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Chưa giao</MessageBox>
                            ) }
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Thanh toán</Card.Title>
                            <Card.Text>
                                <strong>Phương thức:</strong> { order.paymentMethod }
                            </Card.Text>
                            { order.isPaid ? (
                                <MessageBox variant="success">
                                    Đã thanh toán: { order.paidAt }
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Chưa thanh toán</MessageBox>
                            ) }
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Hàng hóa</Card.Title>
                            <ListGroup variant="flush">
                                { order.orderItems?.map( ( item ) => (
                                    <ListGroup.Item key={ item._id }>
                                        <Row className="align-items-center">
                                            <Col md={ 6 }>
                                                <img
                                                    src={ item.anh }
                                                    alt={ item.tensp }
                                                    className="img-fluid rounded img-thumbnail"
                                                ></img>{ ' ' }
                                                <Link to={ `/sanpham/${ item.slug }` }>{ item.tensp }</Link>
                                            </Col>
                                            <Col md={ 3 }>
                                                <span>{ item.sohang }</span>
                                            </Col>
                                            <Col md={ 3 }>{ item.gia } VNĐ</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ) ) }
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={ 4 }>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Tổng đơn</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Hàng hóa</Col>
                                        <Col>{ order.giahang } VNĐ</Col>;
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Vận chuyển</Col>
                                        <Col>{ order.cuocvanchuyen } VNĐ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Thuế</Col>
                                        <Col>{ order.thue } VNĐ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Tổng cộng</strong>
                                        </Col>
                                        <Col>
                                            <strong>{ order.tongcong } VNĐ</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                { !order.isPaid && (
                                    <ListGroup.Item>
                                        { isPending ? (
                                            <LoadingBox />
                                        ) : (
                                            <div>
                                                <PayPalButtons
                                                    createOrder={ createOrder }
                                                    onApprove={ onApprove }
                                                    onError={ onError }
                                                ></PayPalButtons>
                                            </div>
                                        ) }
                                        { loadingPay && <LoadingBox></LoadingBox> }
                                    </ListGroup.Item>
                                ) }
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}