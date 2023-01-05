import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import BuocTinhTien from '../components/BuocTinhTien';
import LoadingBox from '../components/LoadingBox';

const reducer = ( state, action ) => {
    switch ( action.type ) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default function DonHangScreen() {
    const navigate = useNavigate();

    const [ { loading }, dispatch ] = useReducer( reducer, {
        loading: false,
    } );

    const { state, dispatch: ctxDispatch } = useContext( Store );
    const { giohang, userInfo } = state;

    const round2 = ( num ) => Math.round( num * 100 + Number.EPSILON ) / 100; // 123.2345 => 123.23
    giohang.giahang = round2(
        giohang.vatpham.reduce( ( a, c ) => a + c.sohang * c.gia, 0 )
    );
    giohang.cuocvanchuyen = giohang.giahang > 100 ? round2( 0 ) : round2( 10 );
    giohang.thue = round2( 0.15 * giohang.giahang );
    giohang.tongcong = giohang.giahang + giohang.cuocvanchuyen + giohang.thue;

    const placeOrderHandler = async () => {
        try {
            dispatch( { type: 'CREATE_REQUEST' } );

            const { data } = await Axios.post(
                '/api/donhang',
                {
                    orderItems: giohang.vatpham,
                    shippingAddress: giohang.shippingAddress,
                    paymentMethod: giohang.paymentMethod,
                    giahang: giohang.giahang,
                    cuocvanchuyen: giohang.cuocvanchuyen,
                    thue: giohang.thue,
                    tongcong: giohang.tongcong,
                },
                {
                    headers: {
                        authorization: `Bearer ${ userInfo.token }`,
                    },
                }
            );
            ctxDispatch( { type: 'CART_CLEAR' } );
            dispatch( { type: 'CREATE_SUCCESS' } );
            localStorage.removeItem( 'vatpham' );
            //navigate( `/donhang/${ data.donhang._id }` );
        } catch ( err ) {
            dispatch( { type: 'CREATE_FAIL' } );
            toast.error( getError( err ) );
        }
    };

    useEffect( () => {
        if ( !giohang.paymentMethod ) {
            navigate( '/payment' );
        }
    }, [ giohang, navigate ] );

    return (
        <div>
            <BuocTinhTien step1 step2 step3 step4></BuocTinhTien>
            <Helmet>
                <title>Đơn hàng</title>
            </Helmet>
            <h1 className="my-3">Đơn hàng</h1>
            <Row>
                <Col md={ 8 }>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Vận chuyển</Card.Title>
                            <Card.Text>
                                <strong>Tên:</strong> { giohang.shippingAddress.hoten } <br />
                                <strong>Địa chỉ: </strong> { giohang.shippingAddress.diachi },
                                { giohang.shippingAddress.thanhpho }
                            </Card.Text>
                            <Link to="/shipping">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Thanh toán</Card.Title>
                            <Card.Text>
                                <strong>Phương thức:</strong> { giohang.paymentMethod }
                            </Card.Text>
                            <Link to="/payment">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Hàng</Card.Title>
                            <ListGroup variant="flush">
                                { giohang.vatpham.map( ( hang ) => (
                                    <ListGroup.Item key={ hang._id }>
                                        <Row className="align-items-center">
                                            <Col md={ 6 }>
                                                <img
                                                    src={ hang.anh }
                                                    alt={ hang.tensp }
                                                    className="img-fluid rounded img-thumbnail"
                                                ></img>{ ' ' }
                                                <Link to={ `/sanpham/${ hang.slug }` }>{ hang.tensp }</Link>
                                            </Col>
                                            <Col md={ 3 }>
                                                <span>{ hang.sohang }</span>
                                            </Col>
                                            <Col md={ 3 }>{ hang.gia } VNĐ</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ) ) }
                            </ListGroup>
                            <Link to="/giohang">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={ 4 }>
                    <Card>
                        <Card.Body>
                            <Card.Title>Tổng đơn</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Hàng hóa</Col>
                                        <Col>{ giohang.giahang } VNĐ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Vận chuyển</Col>
                                        <Col>{ giohang.cuocvanchuyen } VNĐ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Thuế</Col>
                                        <Col>{ giohang.thue } VNĐ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Tổng cộng</strong>
                                        </Col>
                                        <Col>
                                            <strong>{ giohang.tongcong } VNĐ</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={ placeOrderHandler }
                                            disabled={ giohang.vatpham.length === 0 }
                                        >
                                            Chốt đơn
                                        </Button>
                                    </div>
                                    { loading && <LoadingBox></LoadingBox> }
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}