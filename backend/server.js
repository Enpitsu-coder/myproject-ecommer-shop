import express from "express";
import data from "./data.js";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose
    .connect( process.env.MONGODB_URI )
    .then( () => {
        console.log( 'connected to db' );
    } )
    .catch( ( err ) => {
        console.log( err.message );
    } );

const app = express();

app.get( '/api/sanpham', ( req, res ) => {
    res.send( data.sanpham );
} );

app.get( '/api/sanpham/slug/:slug', ( req, res ) => {
    const sp = data.sanpham.find( ( x ) => x.slug === req.params.slug );
    if ( sp ) {
        res.send( sp );
    } else {
        res.status( 404 ).send( { message: 'Không tìm thấy sản phẩm' } );
    }
} );

app.get( '/api/sanpham/:id', ( req, res ) => {
    const sp = data.sanpham.find( ( x ) => x._id === req.params.id );
    if ( sp ) {
        res.send( sp );
    } else {
        res.status( 404 ).send( { message: 'Không tìm thấy sản phẩm' } );
    }
} );

const port = process.env.PORT || 5000;
app.listen( port, () => {
    console.log( `serve at http://localhost:${ port }` );
} );