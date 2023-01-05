import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from "./screens/HomeScreen";
import SanPhamScreen from './screens/SanPhamScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import GioHangScreen from './screens/GioHangScreen';
import DangNhapScreen from './screens/DangNhapScreen';
import GiaoHangScreen from './screens/GiaoHangScreen';
import DangKiScreen from './screens/DangKiScreen';
import ThanhToanScreen from './screens/ThanhToanScreen';
import DonHangScreen from './screens/DonHangScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext( Store );
  const { giohang, userInfo } = state;

  const ThoatHandler = () => {
    ctxDispatch( { type: 'NGƯỜI_DÙNG_THOÁT' } );
    localStorage.removeItem( 'userInfo' );
    localStorage.removeItem( 'shippingAddress' );
    localStorage.removeItem( 'paymentMethod' );
  };
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={ 1 } />
        <header>
          <Navbar bg="black" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Trầm Nhi's Store</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/giohang" className="nav-link">
                  Giỏ hàng
                  { giohang.vatpham.length > 0 && (
                    <Badge pill bg="danger">
                      { giohang.vatpham.reduce( ( a, c ) => a + c.sohang, 0 ) }
                    </Badge>
                  ) }
                </Link>
                { userInfo ? (
                  <NavDropdown title={ userInfo.ten } id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Hồ sơ</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Lịch sử đơn hàng</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={ ThoatHandler }
                    >
                      Thoát
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/dangnhap">
                    Đăng nhập
                  </Link>
                ) }
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className='mt-3'>
            <Routes>
              <Route path="/sanpham/slug/:slug" element={ <SanPhamScreen /> } />
              <Route path="/giohang" element={ <GioHangScreen /> } />
              <Route path="/dangnhap" element={ <DangNhapScreen /> } />
              <Route path="/dangki" element={ <DangKiScreen /> } />
              <Route path="/placeorder" element={ <DonHangScreen /> } />
              <Route
                path="/shipping"
                element={ <GiaoHangScreen /> }
              ></Route>
              <Route path="/payment" element={ <ThanhToanScreen /> }></Route>
              <Route path="/" element={ <HomeScreen /> } />
            </Routes>
          </Container>
        </main >
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div >
    </BrowserRouter>
  );
}

export default App;
