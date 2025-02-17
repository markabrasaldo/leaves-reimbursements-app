export interface ReimbursementType {
  reimbursement_type_id: string;
  name: string;
  code?: string;
}

export interface Organization {
  organization_id: string;
  name: string;
}

export interface Reimbursement {
  tempId?: number;
  id: string;
  reimbursementType: ReimbursementType;
  organization: Organization;
  date: Date | string;
  amount: number;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
  created_by: Date | string;
  updated_by: Date | string;
  attachments: string;
  description?: string;
}
