import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import NguoiDung from '../models/nguoidungModel.js';
import { generateToken } from '../utils.js';

const nguoidungRouter = express.Router();

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

export default nguoidungRouter;