import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
    giohang: {
        vatpham: [],
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
            return { ...state, giohang: { ...state.giohang, vatpham } };
        default:
            return state;
    }
}

export function StoreProvider( props ) {
    const [ state, dispatch ] = useReducer( reducer, initialState );
    const value = { state, dispatch };
    return <Store.Provider value={ value }>{ props.children } </Store.Provider>;
}