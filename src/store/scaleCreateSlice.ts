import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// 定义状态类型
interface ScaleCreateState {
  evaluateId: string | null;
}

// 初始状态
const initialState: ScaleCreateState = {
  evaluateId: null,
};

// 创建slice
export const scaleCreateSlice = createSlice({
  name: "scaleCreate",
  initialState,
  reducers: {
    // 设置评估ID
    setEvaluateId: (state, action: PayloadAction<string>) => {
      state.evaluateId = action.payload;
    },
    // 清除评估ID
    clearEvaluateId: (state) => {
      state.evaluateId = null;
    },
  },
});

// 导出actions
export const { setEvaluateId, clearEvaluateId } = scaleCreateSlice.actions;

// 导出reducer
export default scaleCreateSlice.reducer;
