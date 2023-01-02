import data from "./data";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a href="/">Trầm Nhi's Store</a>
      </header>
      <main>
        <h1>Sản phẩm nổi bật</h1>
        <div className="sanpham">
          {
            data.sanpham.map( sp => (
              <div className="sp" key={ sp.slug }>
                <a href={ `/sanpham/${ sp.slug }` }>
                  <img src={ sp.anh } alt={ sp.tensp } />
                </a>
                <div className="sp-thongtin">
                  <a href={ `/sanpham/${ sp.slug }` }>
                    <p>{ sp.tensp }</p>
                  </a>
                  <p><strong>{ sp.gia } VNĐ</strong></p>
                  <button>Thêm vào giỏ</button>
                </div>
              </div> ) )
          }
        </div>
      </main >
    </div >
  );
}

export default App;
