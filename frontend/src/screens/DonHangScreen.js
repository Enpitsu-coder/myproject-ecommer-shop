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
                '/api/orders',
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
            navigate( `/order/${ data.order._id }` );
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
                <title>????n h??ng</title>
            </Helmet>
            <h1 className="my-3">????n h??ng</h1>
            <Row>
                <Col md={ 8 }>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>V???n chuy???n</Card.Title>
                            <Card.Text>
                                <strong>T??n:</strong> { giohang.shippingAddress.hoten } <br />
                                <strong>?????a ch???: </strong> { giohang.shippingAddress.diachi },
                                { giohang.shippingAddress.thanhpho }
                            </Card.Text>
                            <Link to="/shipping">Ch???nh s???a</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Thanh to??n</Card.Title>
                            <Card.Text>
                                <strong>Ph????ng th???c:</strong> { giohang.paymentMethod }
                            </Card.Text>
                            <Link to="/payment">Ch???nh s???a</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>H??ng</Card.Title>
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
                                            <Col md={ 3 }>{ hang.gia } VN??</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ) ) }
                            </ListGroup>
                            <Link to="/giohang">Ch???nh s???a</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={ 4 }>
                    <Card>
                        <Card.Body>
                            <Card.Title>T???ng ????n</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>H??ng h??a</Col>
                                        <Col>{ giohang.giahang } VN??</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>V???n chuy???n</Col>
                                        <Col>{ giohang.cuocvanchuyen } VN??</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Thu???</Col>
                                        <Col>{ giohang.thue } VN??</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> T???ng c???ng</strong>
                                        </Col>
                                        <Col>
                                            <strong>{ giohang.tongcong } VN??</strong>
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
                                            Ch???t ????n
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