import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeScreen from "./screens/HomeScreen";
import SanPhamScreen from './screens/SanPhamScreen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="black" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Trầm Nhi's Store</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className='mt-3'>
            <Routes>
              <Route path="/sanpham/slug/:slug" element={ <SanPhamScreen /> } />
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
