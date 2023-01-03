import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DanhGia from './DanhGia';

function SanPham( props ) {
    const { sp } = props;
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
                <Button>Thêm vào giỏ</Button>
            </Card.Body>
        </Card>
    );
}
export default SanPham;