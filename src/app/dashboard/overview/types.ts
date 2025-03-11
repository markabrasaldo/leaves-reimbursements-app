interface StatisticCount {
  approved: number;
  submitted: number;
  cancelled: number;
  draft: number;
  rejected: number;
}

export interface DashboardStatisticsResponse {
  leaves: StatisticCount;
  reimbursements: StatisticCount;
}
