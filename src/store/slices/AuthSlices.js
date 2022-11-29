import { createSlice } from '@reduxjs/toolkit'
const templateState = JSON.parse (localStorage.getItem('isAuthAuc'))
const reg =JSON.parse(localStorage.getItem('IsReg'))
const user = JSON.parse(localStorage.getItem('user'))
const initialState = {
    isAuth : templateState ? templateState : false,
    IsReg : reg ? reg : false,
    user : user? user : null
}

export const authSlice = createSlice({

    name: 'auth',
    initialState,
    reducers : {
        setAuth : (state) => {
            state.isAuth = true
            localStorage.setItem('isAuthAuc' , JSON.parse(true))
        },
        deleteAuth : (state) => {
            state.isAuth = false
            localStorage.clear();
        },
        setUser : (state,action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload))
        }
    }
});
export const { setAuth, deleteAuth, setUser } = authSlice.actions

export default authSlice.reducer