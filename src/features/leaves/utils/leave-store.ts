import { create } from 'zustand';
import { LeaveType } from '../types';

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
