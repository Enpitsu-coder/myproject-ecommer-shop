import { Link } from "react-router-dom";
import data from "../data";

function HomeScreen() {
    return ( <div>
        <h1>Sản phẩm nổi bật</h1>
        <div className="sanpham">
            {
                data.sanpham.map( sp => (
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