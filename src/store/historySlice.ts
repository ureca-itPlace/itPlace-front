// src/store/historySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryState {
  totalAmount: number;
}

const initialState: HistoryState = {
  totalAmount: 0,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setTotalAmount: (state, action: PayloadAction<number>) => {
      state.totalAmount = action.payload;
    },
  },
});

export const { setTotalAmount } = historySlice.actions;
export default historySlice.reducer;
