import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from "./screens/HomeScreen";
import SanPhamScreen from './screens/SanPhamScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import GioHangScreen from './screens/GioHangScreen';

function App() {
  const { state } = useContext( Store );
  const { giohang } = state;
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
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
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className='mt-3'>
            <Routes>
              <Route path="/sanpham/slug/:slug" element={ <SanPhamScreen /> } />
              <Route path="/giohang" element={ <GioHangScreen /> } />
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
