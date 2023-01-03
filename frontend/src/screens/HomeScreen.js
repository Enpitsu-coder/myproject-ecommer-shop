import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomeScreen() {
    const [ sanpham, setProducts ] = useState( [] );
    useEffect( () => {
        const fetchData = async () => {
            const result = await axios.get( '/api/sanpham' );
            setProducts( result.data );
        };
        fetchData();
    }, [] );
    return ( <div>
        <h1>Sản phẩm nổi bật</h1>
        <div className="sanpham">
            {
                sanpham.map( sp => (
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
                    </div> ) )
            }
        </div>
    </div> );
}
export default HomeScreen;