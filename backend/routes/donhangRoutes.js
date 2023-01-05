import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import DonHang from '../models/donhangModel.js';
import { isAuth } from '../utils.js';

const donhangRouter = express.Router();
donhangRouter.post(
    '/',
    isAuth,
    expressAsyncHandler( async ( req, res ) => {
        const newOrder = new DonHang( {
            orderItems: req.body.orderItems.map( ( x ) => ( { ...x, sp: x._id } ) ),
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            giahang: req.body.giahang,
            cuocvanchuyen: req.body.cuocvanchuyen,
            thue: req.body.thue,
            tongcong: req.body.tongcong,
            nguoidung: req.user._id,
        } );

        const order = await newOrder.save();
        res.status( 201 ).send( { message: 'Đã tạo đơn hàng mới', order } );
    } )
);

donhangRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler( async ( req, res ) => {
        const order = await DonHang.findById( req.params.id );
        if ( order ) {
            res.send( order );
        } else {
            res.status( 404 ).send( { message: 'Không tìm thấy đơn hàng' } );
        }
    } )
);


export default donhangRouter;