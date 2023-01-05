import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from "./screens/HomeScreen";
import SanPhamScreen from './screens/SanPhamScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
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
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';

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
  const [ sidebarIsOpen, setSidebarIsOpen ] = useState( false );
  const [ categories, setCategories ] = useState( [] );

  useEffect( () => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get( `/api/sanpham/categories` );
        setCategories( data );
      } catch ( err ) {
        toast.error( getError( err ) );
      }
    };
    fetchCategories();
  }, [] );
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={ 1 } />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={ () => setSidebarIsOpen( !sidebarIsOpen ) }
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Trầm Nhi's Store</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
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
                  { userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Trang chính</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Sản phẩm</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Người dùng</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  ) }
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Loại hàng</strong>
            </Nav.Item>
            { categories.map( ( category ) => (
              <Nav.Item key={ category }>
                <LinkContainer
                  to={ { pathname: '/search', search: `loaisp=${ category }` } }
                  onClick={ () => setSidebarIsOpen( false ) }
                >
                  <Nav.Link>{ category }</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ) ) }
          </Nav>
        </div>
        <main>
          <Container className='mt-3'>
            <Routes>
              <Route path="/sanpham/slug/:slug" element={ <SanPhamScreen /> } />
              <Route path="/giohang" element={ <GioHangScreen /> } />
              <Route path="/dangnhap" element={ <DangNhapScreen /> } />
              <Route path="/search" element={ <SearchScreen /> } />
              <Route path="/dangki" element={ <DangKiScreen /> } />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={ <DonHangScreen /> } />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <DatHangScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={ <GiaoHangScreen /> }
              ></Route>
              <Route path="/payment" element={ <ThanhToanScreen /> }></Route>
              {/* Admin Routes */ }
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
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
