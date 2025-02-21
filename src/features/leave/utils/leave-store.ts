import { create } from 'zustand';

export interface LeaveType {
  id: string;
  name: string;
  color: string;
  description: string;
  icon: string;
}

interface LeaveStore {
  selectedLeave: string;
  leaveTypes: LeaveType[];
  setSelectedLeave: (value: string) => void;
  setLeaveTypes: (types: LeaveType[]) => void;
  initializeLeaveTypes: (types: LeaveType[]) => void;
}

export const useLeaveStore = create<LeaveStore>((set) => ({
  selectedLeave: '',
  leaveTypes: [],
  setSelectedLeave: (value) => set({ selectedLeave: value }),
  setLeaveTypes: (types) => set({ leaveTypes: types }),
  initializeLeaveTypes: (types) => set({ leaveTypes: types })
}));
