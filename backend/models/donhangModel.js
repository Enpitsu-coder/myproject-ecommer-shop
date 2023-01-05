import mongoose from 'mongoose';

const donhangSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                slug: { type: String, required: true },
                tensp: { type: String, required: true },
                sohang: { type: Number, required: true },
                anh: { type: String, required: true },
                gia: { type: Number, required: true },
                sp: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'SanPham',
                    required: true,
                },
            },
        ],
        shippingAddress: {
            hoten: { type: String, required: true },
            diachi: { type: String, required: true },
            thanhpho: { type: String, required: true },
        },
        paymentMethod: { type: String, required: true },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String,
        },
        giahang: { type: Number, required: true },
        cuocvanchuyen: { type: Number, required: true },
        thue: { type: Number, required: true },
        tongcong: { type: Number, required: true },
        nguoidung: { type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung', required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

const DonHang = mongoose.model( 'DonHang', donhangSchema );
export default DonHang;