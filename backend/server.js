import express from "express";
import data from "./data.js";

const app = express();

app.get( '/api/sanpham', ( req, res ) => {
    res.send( data.sanpham );
} );

const port = process.env.PORT || 9000;
app.listen( port, () => {
    console.log( `serve at http://localhost:${ port }` );
} );