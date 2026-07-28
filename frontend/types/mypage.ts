// frontend/types/mypage.ts

export type ApplicationStatus =
  | "pending"
  | "approved"
  | "returned"
  | "rejected"
  | "exhibiting"
  | "completed";

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: "審査中",
  approved: "承認",
  returned: "差戻し",
  rejected: "却下",
  exhibiting: "展示中",
  completed: "展示終了",
};

export interface UserProfile {
  id: number;
  companyName: string;
  userName: string;
  email: string;
  phone: string;
}

export interface ApplicationHistoryItem {
  id: number;
  applicationNo: string;
  showroomName: string;
  productName: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface ReportHistoryItem {
  id: number;
  title: string;
  date: string;
  downloadUrl: string;
}