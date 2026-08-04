// frontend/types/mypage.ts

export type ApplicationStatus = "pending" | "exhibiting" | "finished" | "cancelled";

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: "審査中",
  exhibiting: "展示中",
  finished: "終了",
  cancelled: "却下",
};

export interface ProfileInfo {
  lastName: string;
  firstName: string;
  companyName: string;
  email: string;
  phone: string;
}

export interface ApplicationHistoryItem {
  id: number;
  showroomId: number;
  showroomName: string;
  periodFrom: string;
  periodTo: string;
  categories: string[];
  status: ApplicationStatus;
}

export interface ReportHistoryItem {
  id: number;
  title: string;
  date: string;
  downloadUrl: string;
}

export interface MypageResponse {
  profile: ProfileInfo;
  applications: ApplicationHistoryItem[];
  reports: ReportHistoryItem[];
}
