import { create } from 'zustand';

export type ReimbursementType = {
  id: string;
  organization_code: string;
  code: string;
  name: string;
  description: string;
};

interface ReimbursementStore {
  selectedReimbursement: string;
  reimbursementTypes: ReimbursementType[];
  setSelectedReimbursement: (value: string) => void;
  setReimbursementTypes: (types: ReimbursementType[]) => void;
  initializeReimbursementTypes: (types: ReimbursementType[]) => void;
}

export const useReimbursementStore = create<ReimbursementStore>((set) => ({
  selectedReimbursement: '',
  reimbursementTypes: [],
  setSelectedReimbursement: (value) => set({ selectedReimbursement: value }),
  setReimbursementTypes: (types) => set({ reimbursementTypes: types }),
  initializeReimbursementTypes: (types) => set({ reimbursementTypes: types })
}));
