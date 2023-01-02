import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from "./screens/HomeScreen";
import SanPhamScreen from './screens/SanPhamScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Link to="/">Trầm Nhi's Store</Link>
        </header>
        <main>
          <Routes>
            <Route path="/sanpham/:slug" element={ <SanPhamScreen /> } />
            <Route path="/" element={ <HomeScreen /> } />
          </Routes>
        </main >
      </div >
    </BrowserRouter>
  );
}

export default App;
