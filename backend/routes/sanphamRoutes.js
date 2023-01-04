import express from 'express';
import SanPham from '../models/sanphamModel.js';

const sanphamRouter = express.Router();

sanphamRouter.get( '/', async ( req, res ) => {
    const sanpham = await SanPham.find();
    res.send( sanpham );
} );

sanphamRouter.get( '/slug/:slug', async ( req, res ) => {
    const sp = await SanPham.findOne( { slug: { $eq: req.params.slug } } );
    if ( sp ) {
        res.send( sp );
    } else {
        res.status( 404 ).send( { message: 'Không tìm thấy sản phẩm' } );
    }
} );
sanphamRouter.get( '/:id', async ( req, res ) => {
    const sp = await SanPham.findById( req.params.id );
    if ( sp ) {
        res.send( sp );
    } else {
        res.status( 404 ).send( { message: 'Không tìm thấy sản phẩm' } );
    }
} );

export default sanphamRouter;