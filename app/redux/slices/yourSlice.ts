// redux/slices/yourSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "@/app/services/events";

const initialState: { events: Event[] } = {
  events: [],
};

const eventsSlice = createSlice({
  name: "eventsSlice",
  initialState,
  reducers: {
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
  },
});

export const { setEvents } = eventsSlice.actions;

export default eventsSlice.reducer;
