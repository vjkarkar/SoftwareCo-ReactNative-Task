import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { NotificationItem } from '../types';

interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.items = action.payload;
    },
    toggleMain: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.enabled = !item.enabled;
        if (!item.enabled && item.subItems) {
          item.subItems.forEach(sub => (sub.enabled = false));
        }
      }
    },
    toggleSubItem: (
      state,
      action: PayloadAction<{ mainId: string; subId: string }>,
    ) => {
      const mainItem = state.items.find(i => i.id === action.payload.mainId);
      if (mainItem?.subItems) {
        const subItem = mainItem.subItems.find(
          s => s.id === action.payload.subId,
        );
        if (subItem && mainItem.enabled) {
          subItem.enabled = !subItem.enabled;
        }
      }
    },
  },
});

export const { setNotifications, toggleMain, toggleSubItem } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
