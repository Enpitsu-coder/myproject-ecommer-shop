import axios from "axios";
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import DanhGia from '../components/DanhGia';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = ( state, action ) => {
    switch ( action.type ) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, sp: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

function SanPhamScreen() {
    const [ selectedImage, setSelectedImage ] = ( '' );
    const navigate = useNavigate();
    const params = useParams();
    const { slug } = params;
    const [ { loading, error, sp }, dispatch ] = useReducer( reducer, {
        sp: [],
        loading: true,
        error: '',
    } );

    useEffect( () => {
        const fetchData = async () => {
            dispatch( { type: 'FETCH_REQUEST' } );
            try {
                const result = await axios.get( `/api/sanpham/slug/${ slug }` );
                dispatch( { type: 'FETCH_SUCCESS', payload: result.data } );
            } catch ( err ) {
                dispatch( { type: 'FETCH_FAIL', payload: getError( err ) } );
            }
        };
        fetchData();
    }, [ slug ] );

    const { state, dispatch: ctxDispatch } = useContext( Store );
    const { giohang } = state;
    const themHangHandler = async () => {
        const tontai = giohang.vatpham.find( ( x ) => x._id === sp._id );
        const sohang = tontai ? tontai.sohang + 1 : 1;
        const { data } = await axios.get( `/api/sanpham/${ sp._id }` );
        if ( data.soluong < sohang ) {
            window.alert( 'Xin l???i. ???? h???t h??ng' );
            return;
        }
        ctxDispatch( {
            type: 'TH??M_H??NG',
            payload: { ...sp, sohang },
        } );
        navigate( '/giohang' );
    };

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{ error }</MessageBox>
    ) : (
        <div>
            <Row>
                <Col md={ 6 }>
                    <img
                        className="img-large"
                        src={ selectedImage || sp.anh }
                        alt={ sp.tensp }
                    ></img>
                </Col>
                <Col md={ 3 }>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{ sp.tensp }</title>
                            </Helmet>
                            <h1>{ sp.tensp }</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <DanhGia
                                rating={ sp.danhgia }
                                numReviews={ sp.sldanhgia }
                            ></DanhGia>
                        </ListGroup.Item>
                        <ListGroup.Item>Gi??: { sp.gia } VN??</ListGroup.Item>
                        <ListGroup.Item>
                            <Row xs={ 1 } md={ 2 } className="g-2">
                                { [ sp.anh, ...sp.images ].map( ( x ) => (
                                    <Col key={ x }>
                                        <Card>
                                            <Button
                                                className="thumbnail"
                                                type="button"
                                                variant="light"
                                                onClick={ () => setSelectedImage( x ) }
                                            >
                                                <Card.Img variant="top" src={ x } alt="product" />
                                            </Button>
                                        </Card>
                                    </Col>
                                ) ) }
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Chi ti???t s???n ph???m:
                            <p>{ sp.mota }</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={ 3 }>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Gi??:</Col>
                                        <Col>{ sp.gia } VN??</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>T??nh tr???ng:</Col>
                                        <Col>
                                            { sp.soluong > 0 ? (
                                                <Badge bg="success">C??n h??ng</Badge>
                                            ) : (
                                                <Badge bg="danger">H???t h??ng</Badge>
                                            ) }
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                { sp.soluong > 0 && (
                                    <ListGroup.Item>
                                        <div className="d-grid">
                                            <Button onClick={ themHangHandler } variant="primary">Th??m v??o gi???</Button>
                                        </div>
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
export default SanPhamScreen;;