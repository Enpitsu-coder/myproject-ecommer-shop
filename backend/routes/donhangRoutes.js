import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import DonHang from '../models/donhangModel.js';
import NguoiDung from '../models/nguoidungModel.js';
import SanPham from '../models/sanphamModel.js';
import { isAuth, isAdmin } from '../utils.js';

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
    '/summary',
    isAuth,
    isAdmin,
    expressAsyncHandler( async ( req, res ) => {
        const orders = await DonHang.aggregate( [
            {
                $group: {
                    _id: null,
                    numOrders: { $sum: 1 },
                    totalSales: { $sum: '$tongcong' },
                },
            },
        ] );
        const users = await NguoiDung.aggregate( [
            {
                $group: {
                    _id: null,
                    numUsers: { $sum: 1 },
                },
            },
        ] );
        const dailyOrders = await DonHang.aggregate( [
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    sales: { $sum: '$tongcong' },
                },
            },
            { $sort: { _id: 1 } },
        ] );
        const productCategories = await SanPham.aggregate( [
            {
                $group: {
                    _id: '$loaisp',
                    count: { $sum: 1 },
                },
            },
        ] );
        res.send( { users, orders, dailyOrders, productCategories } );
    } )
);

donhangRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler( async ( req, res ) => {
        const orders = await DonHang.find( { user: req.user._id } );
        res.send( orders );
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

donhangRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler( async ( req, res ) => {
        const order = await DonHang.findById( req.params.id );
        if ( order ) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();
            res.send( { message: 'Đã thanh toán', order: updatedOrder } );
        } else {
            res.status( 404 ).send( { message: 'Không tìm thấy hóa đơn' } );
        }
    } )
);

export default donhangRouter;