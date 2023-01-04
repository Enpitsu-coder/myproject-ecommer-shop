import express from "express";
import data from "./data.js";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import sanphamRouter from './routes/sanphamRoutes.js';

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

app.use( '/api/seed', seedRouter );
app.use( '/api/sanpham', sanphamRouter );

const port = process.env.PORT || 5000;
app.listen( port, () => {
    console.log( `serve at http://localhost:${ port }` );
} );