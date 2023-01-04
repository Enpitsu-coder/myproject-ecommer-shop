import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
    giohang: {
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
        default:
            return state;
    }
}

export function StoreProvider( props ) {
    const [ state, dispatch ] = useReducer( reducer, initialState );
    const value = { state, dispatch };
    return <Store.Provider value={ value }>{ props.children } </Store.Provider>;
}