import bcrypt from 'bcryptjs';

const data = {
    nguoidung: [
        {
            ten: 'huy',
            email: 'admin@example.com',
            password: bcrypt.hashSync( '123456' ),
            isAdmin: true,
        },
        {
            ten: 'gest',
            email: 'user@example.com',
            password: bcrypt.hashSync( '123456' ),
            isAdmin: false,
        },
    ],
    sanpham: [
        {
            //_id: '1',
            tensp: 'Áo trẻ em 1',
            slug: 'ao-tre-em-1',
            loaisp: 'ao',
            anh: '/images/a1.jpg',
            gia: 80000,
            soluong: 0,
            ncc: 'Supreme',
            danhgia: 5,
            sldanhgia: 10,
            mota: 'áo nam dành cho trẻ em chất lượng cao',
        },
        {
            //_id: '2',
            tensp: 'Quần trẻ em 1',
            slug: 'quan-tre-em-1',
            loaisp: 'quan',
            anh: '/images/q1.jpg',
            gia: 80000,
            soluong: 20,
            ncc: 'Supreme',
            danhgia: 4.5,
            sldanhgia: 10,
            mota: 'quần nam dành cho trẻ em chất lượng cao',
        },
        {
            //_id: '3',
            tensp: 'Mũ trẻ em 1',
            slug: 'mu-tre-em-1',
            loaisp: 'mu',
            anh: '/images/m1.jpg',
            gia: 50000,
            soluong: 20,
            ncc: 'Supreme',
            danhgia: 3,
            sldanhgia: 10,
            mota: 'mũ nam dành cho trẻ em chất lượng cao',
        },
        {
            //_id: '4',
            tensp: 'Váy trẻ em 1',
            slug: 'vay-tre-em-1',
            loaisp: 'vay',
            anh: '/images/v1.jpg',
            gia: 50000,
            soluong: 20,
            ncc: 'Supreme',
            danhgia: 5,
            sldanhgia: 10,
            mota: 'váy dành cho trẻ em chất lượng cao',
        }
    ],
};
export default data;