import express from 'express';
import SanPham from '../models/sanphamModel.js';
import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get( '/', async ( req, res ) => {
    await SanPham.remove( {} );
    const taoSanPham = await SanPham.insertMany( data.sanpham );
    res.send( { taoSanPham } );
} );
export default seedRouter;