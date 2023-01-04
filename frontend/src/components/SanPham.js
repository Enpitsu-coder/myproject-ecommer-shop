import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DanhGia from './DanhGia';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function SanPham( props ) {
    const { sp } = props;

    const { state, dispatch: ctxDispatch } = useContext( Store );
    const {
        giohang: { vatpham },
    } = state;

    const themHangHandler = async ( hang ) => {
        const tontai = vatpham.find( ( x ) => x._id === sp._id );
        const sohang = tontai ? tontai.sohang + 1 : 1;
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

    return (
        <Card>
            <Link to={ `/sanpham/slug/${ sp.slug }` }>
                <img src={ sp.anh } className="card-img-top" alt={ sp.tensp } />
            </Link>
            <Card.Body>
                <Link to={ `/sanpham/slug/${ sp.slug }` }>
                    <Card.Title>{ sp.tensp }</Card.Title>
                </Link>
                <DanhGia rating={ sp.danhgia } numReviews={ sp.sldanhgia } />
                <Card.Title>{ sp.gia } VNĐ</Card.Title>
                { sp.soluong === 0 ? (
                    <Button variant="light" disabled>
                        Hết hàng
                    </Button>
                ) : (
                    <Button onClick={ () => themHangHandler( sp ) }>Thêm vào giỏ</Button>
                ) }
            </Card.Body>
        </Card>
    );
}
export default SanPham;