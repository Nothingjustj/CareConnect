import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    list: []
}

const hospitalSlice = createSlice({
    name: 'hospital',
    initialState,
    reducers: {
        setHospital: (state, action: PayloadAction<any>) => {
            state.list = action.payload
        }
    }
})

export const { setHospital } = hospitalSlice.actions
export default hospitalSlice.reducer;