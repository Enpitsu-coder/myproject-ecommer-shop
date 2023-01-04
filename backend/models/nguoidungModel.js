import mongoose from 'mongoose';

const nguoidungSchema = new mongoose.Schema(
    {
        ten: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        matkhau: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
    },
    {
        timestamps: true,
    }
);

const NguoiDung = mongoose.model( 'nguoidung', nguoidungSchema );
export default NguoiDung;