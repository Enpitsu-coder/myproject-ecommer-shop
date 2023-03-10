import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import NguoiDung from '../models/nguoidungModel.js';
import { isAuth, isAdmin, generateToken } from '../utils.js';

const nguoidungRouter = express.Router();

nguoidungRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler( async ( req, res ) => {
        const users = await NguoiDung.find( {} );
        res.send( users );
    } )
);

nguoidungRouter.get(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler( async ( req, res ) => {
        const user = await NguoiDung.findById( req.params.id );
        if ( user ) {
            res.send( user );
        } else {
            res.status( 404 ).send( { message: 'Không tìm thấy người dùng' } );
        }
    } )
);

nguoidungRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler( async ( req, res ) => {
        const user = await NguoiDung.findById( req.params.id );
        if ( user ) {
            user.ten = req.body.ten || user.ten;
            user.email = req.body.email || user.email;
            user.isAdmin = Boolean( req.body.isAdmin );
            const updatedUser = await user.save();
            res.send( { message: 'Cập nhật thành công', user: updatedUser } );
        } else {
            res.status( 404 ).send( { message: 'Không tìm thấy người dùng' } );
        }
    } )
);

nguoidungRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler( async ( req, res ) => {
        const user = await NguoiDung.findById( req.params.id );
        if ( user ) {
            if ( user.email === 'admin@example.com' ) {
                res.status( 400 ).send( { message: 'Không thể delete admin' } );
                return;
            }
            await user.remove();
            res.send( { message: 'Xóa thành công' } );
        } else {
            res.status( 404 ).send( { message: 'Không tìm thấy người dùng' } );
        }
    } )
);

nguoidungRouter.post(
    '/dangnhap',
    expressAsyncHandler( async ( req, res ) => {
        const nguoidung = await NguoiDung.findOne( { email: req.body.email } );
        if ( nguoidung ) {
            if ( bcrypt.compareSync( req.body.password, nguoidung.password ) ) {
                res.send( {
                    _id: nguoidung._id,
                    ten: nguoidung.ten,
                    email: nguoidung.email,
                    isAdmin: nguoidung.isAdmin,
                    token: generateToken( nguoidung ),
                } );
                return;
            }
        }
        res.status( 401 ).send( { message: 'Nhập sai email hoặc password' } );
    } )
);

nguoidungRouter.post(
    '/dangki',
    expressAsyncHandler( async ( req, res ) => {
        const newUser = new NguoiDung( {
            ten: req.body.ten,
            email: req.body.email,
            password: bcrypt.hashSync( req.body.password ),
        } );
        const user = await newUser.save();
        res.send( {
            _id: user._id,
            ten: user.ten,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken( user ),
        } );
    } )
);

nguoidungRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler( async ( req, res ) => {
        const user = await NguoiDung.findById( req.user._id );
        if ( user ) {
            user.ten = req.body.ten || user.ten;
            user.email = req.body.email || user.email;
            if ( req.body.password ) {
                user.password = bcrypt.hashSync( req.body.password, 8 );
            }

            const updatedUser = await user.save();
            res.send( {
                _id: updatedUser._id,
                ten: updatedUser.ten,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken( updatedUser ),
            } );
        } else {
            res.status( 404 ).send( { message: 'Không tìm thấy người dùng' } );
        }
    } )
);

export default nguoidungRouter;