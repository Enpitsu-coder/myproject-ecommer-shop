import { useParams } from "react-router-dom";

function SanPhamScreen() {
    const params = useParams();
    const { slug } = params;
    return ( <div>
        <h1>{ slug }</h1>
    </div> );
}
export default SanPhamScreen;