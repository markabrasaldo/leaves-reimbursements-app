import { PaginationTypes } from 'types';

export interface LeaveType {
  id: string;
  name: string;
  color: string;
  description: string;
  icon: string;
}

export interface Leave {
  days_applied: number;
  end_date: string;
  google_event_id: string;
  id: string;
  leave_type: LeaveType;
  organization_name: string;
  start_date: string;
  status: string;
  user_email: string;
  user_id: string;
  remarks: string;
}

export interface LeavesResponse {
  data: Leave[];
  message: string;
  meta?: PaginationTypes;
}
