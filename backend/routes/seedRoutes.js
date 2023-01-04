import express from 'express';
import SanPham from '../models/sanphamModel.js';
import data from '../data.js';
import NguoiDung from '../models/nguoidungModel.js';

const seedRouter = express.Router();

seedRouter.get( '/', async ( req, res ) => {
    await SanPham.remove( {} );
    const taoSanPham = await SanPham.insertMany( data.sanpham );
    await NguoiDung.remove( {} );
    const taoNguoiDung = await NguoiDung.insertMany( data.nguoidung );
    res.send( { taoSanPham, taoNguoiDung } );
} );
export default seedRouter;