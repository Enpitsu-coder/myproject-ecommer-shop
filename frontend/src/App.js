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
import DatHangScreen from './screens/DatHangScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext( Store );
  const { giohang, userInfo } = state;

  const ThoatHandler = () => {
    ctxDispatch( { type: 'NGƯỜI_DÙNG_THOÁT' } );
    localStorage.removeItem( 'userInfo' );
    localStorage.removeItem( 'shippingAddress' );
    localStorage.removeItem( 'paymentMethod' );
    window.location.href = '/dangnhap';
  };
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={ 1 } />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Trầm Nhi's Store</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto  w-100  justify-content-end">
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
                        <NavDropdown.Item>Hồ sơ người dùng</NavDropdown.Item>
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
                        Đăng xuất
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/dangnhap">
                      Đăng nhập
                    </Link>
                  ) }
                </Nav>
              </Navbar.Collapse>
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
              <Route path="/profile" element={ <ProfileScreen /> } />
              <Route path="/placeorder" element={ <DonHangScreen /> } />
              <Route path="/order/:id" element={ <DatHangScreen /> }></Route>
              <Route
                path="/orderhistory"
                element={ <OrderHistoryScreen /> }
              ></Route>
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
