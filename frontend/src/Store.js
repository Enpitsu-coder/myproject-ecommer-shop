import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
    userInfo: localStorage.getItem( 'userInfo' )
        ? JSON.parse( localStorage.getItem( 'userInfo' ) )
        : null,

    giohang: {
        shippingAddress: localStorage.getItem( 'shippingAddress' )
            ? JSON.parse( localStorage.getItem( 'shippingAddress' ) )
            : {},
        vatpham: localStorage.getItem( 'vatpham' )
            ? JSON.parse( localStorage.getItem( 'vatpham' ) )
            : [],
    },
};
function reducer( state, action ) {
    switch ( action.type ) {
        case 'THÊM_HÀNG':
            const hangthem = action.payload;
            const tontai = state.giohang.vatpham.find(
                ( hang ) => hang._id === hangthem._id
            );
            const vatpham = tontai
                ? state.giohang.vatpham.map( ( hang ) =>
                    hang._id === tontai._id ? hangthem : hang
                )
                : [ ...state.giohang.vatpham, hangthem ];
            localStorage.setItem( 'vatpham', JSON.stringify( vatpham ) );
            return { ...state, giohang: { ...state.giohang, vatpham } };
        case 'BỎ_HÀNG': {
            const vatpham = state.giohang.vatpham.filter(
                ( hang ) => hang._id !== action.payload._id
            );
            localStorage.setItem( 'vatpham', JSON.stringify( vatpham ) );
            return { ...state, giohang: { ...state.giohang, vatpham } };
        }
        case 'NGƯỜI_DÙNG_ĐĂNG_NHẬP':
            return { ...state, userInfo: action.payload };
        case 'NGƯỜI_DÙNG_THOÁT':
            return {
                ...state,
                userInfo: null,
                giohang: {
                    vatpham: [],
                    shippingAddress: {},
                },
            };
        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                giohang: {
                    ...state.giohang,
                    shippingAddress: action.payload,
                },
            };
        default:
            return state;
    }
}

export function StoreProvider( props ) {
    const [ state, dispatch ] = useReducer( reducer, initialState );
    const value = { state, dispatch };
    return <Store.Provider value={ value }>{ props.children } </Store.Provider>;
}