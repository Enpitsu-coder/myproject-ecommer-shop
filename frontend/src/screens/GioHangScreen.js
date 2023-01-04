import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GioHangScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext( Store );
    const {
        giohang: { vatpham },
    } = state;

    const updateGioHandler = async ( hang, sohang ) => {
        const { data } = await axios.get( `/api/sanpham/${ hang._id }` );
        if ( data.soluong < sohang ) {
            window.alert( 'Xin lỗi. Đã hết hàng' );
            return;
        }
        ctxDispatch( {
            type: 'THÊM_HÀNG',
            payload: { ...hang, sohang },
        } );
    };
    const boHangHandler = ( hang ) => {
        ctxDispatch( { type: 'BỎ_HÀNG', payload: hang } );
    };

    const tinhTienHandler = () => {
        navigate( '/dangnhap?redirect=/shipping' );
    };

    return (
        <div>
            <Helmet>
                <title>Giỏ hàng</title>
            </Helmet>
            <h1>Giỏ hàng</h1>
            <Row>
                <Col md={ 8 }>
                    { vatpham.length === 0 ? (
                        <MessageBox>
                            Giỏ đang trống. <Link to="/">Mua hàng</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            { vatpham.map( ( hang ) => (
                                <ListGroup.Item key={ hang._id }>
                                    <Row className="align-items-center">
                                        <Col md={ 4 }>
                                            <img
                                                src={ hang.anh }
                                                alt={ hang.tensp }
                                                className="img-fluid rounded img-thumbnail"
                                            ></img>{ ' ' }
                                            <Link to={ `/sanpham/slug/${ hang.slug }` }>{ hang.tensp }</Link>
                                        </Col>
                                        <Col md={ 3 }>
                                            <Button
                                                onClick={ () =>
                                                    updateGioHandler( hang, hang.sohang - 1 )
                                                }
                                                variant="light"
                                                disabled={ hang.sohang === 1 }
                                            >
                                                <i className="fas fa-minus-circle"></i>
                                            </Button>{ ' ' }
                                            <span>{ hang.sohang }</span>{ ' ' }
                                            <Button
                                                variant="light"
                                                onClick={ () =>
                                                    updateGioHandler( hang, hang.sohang + 1 )
                                                }
                                                disabled={ hang.sohang === hang.soluong }
                                            >
                                                <i className="fas fa-plus-circle"></i>
                                            </Button>
                                        </Col>
                                        <Col md={ 3 }>{ hang.gia } VNĐ</Col>
                                        <Col md={ 2 }>
                                            <Button
                                                onClick={ () => boHangHandler( hang ) }
                                                variant="light"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ) ) }
                        </ListGroup>
                    ) }
                </Col>
                <Col md={ 4 }>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Tổng cộng ({ vatpham.reduce( ( a, c ) => a + c.sohang, 0 ) }{ ' ' }
                                        món hàng) :
                                        { vatpham.reduce( ( a, c ) => a + c.gia * c.sohang, 0 ) } VNĐ
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={ tinhTienHandler }
                                            disabled={ vatpham.length === 0 }
                                        >
                                            Tính tiền
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}