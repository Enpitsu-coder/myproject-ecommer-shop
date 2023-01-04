import mongoose from 'mongoose';

const sanphamSchema = new mongoose.Schema(
    {
        tensp: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        loaisp: { type: String, required: true },
        anh: { type: String, required: true },
        gia: { type: Number, required: true },
        soluong: { type: Number, required: true },
        ncc: { type: String, required: true },
        danhgia: { type: Number, required: true },
        sldanhgia: { type: Number, required: true },
        mota: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const SanPham = mongoose.model( 'sanpham', sanphamSchema );
export default SanPham;