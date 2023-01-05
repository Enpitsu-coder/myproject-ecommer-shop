import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import SanPham from '../models/sanphamModel.js';
import { isAuth, isAdmin } from '../utils.js';

const sanphamRouter = express.Router();

sanphamRouter.get( '/', async ( req, res ) => {
    const sanpham = await SanPham.find();
    res.send( sanpham );
} );

sanphamRouter.post(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler( async ( req, res ) => {
        const newProduct = new SanPham( {
            tensp: 'sample name ' + Date.now(),
            slug: 'sample-name-' + Date.now(),
            anh: '/images/a1.jpg',
            gia: 0,
            loaisp: 'sample category',
            ncc: 'sample brand',
            soluong: 0,
            danhgia: 0,
            sldanhgia: 0,
            mota: 'sample description',
        } );
        const product = await newProduct.save();
        res.send( { message: 'Tạo mới sản phẩm', product } );
    } )
);

sanphamRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler( async ( req, res ) => {
        const productId = req.params.id;
        const product = await SanPham.findById( productId );
        if ( product ) {
            product.tensp = req.body.tensp;
            product.slug = req.body.slug;
            product.gia = req.body.gia;
            product.anh = req.body.anh;
            product.loaisp = req.body.loaisp;
            product.ncc = req.body.ncc;
            product.soluong = req.body.soluong;
            product.mota = req.body.mota;
            await product.save();
            res.send( { message: 'Sản phẩm cập nhật' } );
        } else {
            res.status( 404 ).send( { message: 'Không tìm thấy sản phẩm' } );
        }
    } )
);

sanphamRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler( async ( req, res ) => {
        const product = await SanPham.findById( req.params.id );
        if ( product ) {
            await product.remove();
            res.send( { message: 'Đã xóa sản phẩm' } );
        } else {
            res.status( 404 ).send( { message: 'Không tìm thấy sản phẩm' } );
        }
    } )
);


const PAGE_SIZE = 3;

sanphamRouter.get(
    '/admin',
    isAuth,
    isAdmin,
    expressAsyncHandler( async ( req, res ) => {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;

        const products = await SanPham.find()
            .skip( pageSize * ( page - 1 ) )
            .limit( pageSize );
        const countProducts = await SanPham.countDocuments();
        res.send( {
            products,
            countProducts,
            page,
            pages: Math.ceil( countProducts / pageSize ),
        } );
    } )
);

sanphamRouter.get(
    '/search',
    expressAsyncHandler( async ( req, res ) => {
        const { query } = req;
        const pageSize = query.pageSize || PAGE_SIZE;
        const page = query.page || 1;
        const loaisp = query.loaisp || '';
        const gia = query.gia || '';
        const danhgia = query.danhgia || '';
        const order = query.order || '';
        const searchQuery = query.query || '';

        const queryFilter =
            searchQuery && searchQuery !== 'all'
                ? {
                    name: {
                        $regex: searchQuery,
                        $options: 'i',
                    },
                }
                : {};
        const categoryFilter = loaisp && loaisp !== 'all' ? { loaisp } : {};
        const ratingFilter =
            danhgia && danhgia !== 'all'
                ? {
                    danhgia: {
                        $gte: Number( danhgia ),
                    },
                }
                : {};
        const priceFilter =
            gia && gia !== 'all'
                ? {
                    // 1-50
                    gia: {
                        $gte: Number( gia.split( '-' )[ 0 ] ),
                        $lte: Number( gia.split( '-' )[ 1 ] ),
                    },
                }
                : {};
        const sortOrder =
            order === 'featured'
                ? { featured: -1 }
                : order === 'lowest'
                    ? { gia: 1 }
                    : order === 'highest'
                        ? { gia: -1 }
                        : order === 'toprated'
                            ? { danhgia: -1 }
                            : order === 'newest'
                                ? { createdAt: -1 }
                                : { _id: -1 };

        const sanpham = await SanPham.find( {
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
        } )
            .sort( sortOrder )
            .skip( pageSize * ( page - 1 ) )
            .limit( pageSize );

        const countProducts = await SanPham.countDocuments( {
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
        } );
        res.send( {
            sanpham,
            countProducts,
            page,
            pages: Math.ceil( countProducts / pageSize ),
        } );
    } )
);

sanphamRouter.get(
    '/categories',
    expressAsyncHandler( async ( req, res ) => {
        const categories = await SanPham.find().distinct( 'loaisp' );
        res.send( categories );
    } )
);


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