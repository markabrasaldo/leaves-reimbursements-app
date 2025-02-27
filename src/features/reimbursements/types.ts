export interface ReimbursementType {
  reimbursement_type_id: string;
  name: string;
  code?: string;
}

export interface Organization {
  id: string;
  name: string;
}

export interface Attachment {
  id: string;
  reimbursement_application_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
}

export interface Reimbursement {
  id: string;
  reimbursement_type: ReimbursementType;
  organization: Organization;
  date: Date | string;
  amount: number;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
  created_by: Date | string;
  updated_by: Date | string;
  attachments: Attachment[];
  description?: string;
}

export interface ReimbursementsResponse {
  data: Reimbursement[];
  message: string;
}
