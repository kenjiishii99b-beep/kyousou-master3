const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function fetchMypage() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  if (!token) {
    throw new Error("ログインしてください。");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // プロフィール取得
  const meRes = await fetch(
    `${API_BASE_URL}/api/auth/me`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (!meRes.ok) {
    throw new Error("プロフィール取得に失敗しました。");
  }

  const profile = await meRes.json();

  // 展示申請履歴取得
  const appRes = await fetch(
    `${API_BASE_URL}/api/applications/me`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (!appRes.ok) {
    throw new Error("申請履歴取得に失敗しました。");
  }

  const applications = await appRes.json();

  return {
    profile,

    applications: applications.map((item: any) => ({
      id: item.id,

      showroomId: item.showroom_id,

      showroomName: item.product_name,

      periodFrom: item.requested_start_date,

      periodTo: item.requested_end_date,

      categories: [],

      status:
        item.status === "pending"
          ? "pending"
          : item.status === "approved"
          ? "exhibiting"
          : item.status === "rejected"
          ? "cancelled"
          : "finished",
    })),

    reports: [],
  };
}