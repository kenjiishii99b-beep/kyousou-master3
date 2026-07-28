"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ApplyHeader from "@/components/applications/ApplyHeader";
import ApplicantSection from "@/components/applications/ApplicantSection";
import AttachmentSection from "@/components/applications/AttachmentSection";
import CompleteDialog from "@/components/applications/CompleteDialog";
import AgreementSection from "@/components/applications/AgreementSection";
import ProductSection from "@/components/applications/ProductSection";
import ShowroomSection from "@/components/applications/ShowroomSection";
import SubmitSection from "@/components/applications/SubmitSection";

import {
  ApplicationFormData,
  EMPTY_APPLICATION_FORM,
} from "@/types/application";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type MeResponse = {
  id: number;
  company_name: string;
  user_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
};

export default function ApplyPage() {
  const searchParams = useSearchParams();

  const showroomId = Number(
    searchParams.get("showroomId") ?? 0
  );

  const [openCompleteDialog, setOpenCompleteDialog] =
    useState(false);

  const [user, setUser] = useState<MeResponse>({
    id: 0,
    company_name: "",
    user_name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });

  const [application, setApplication] =
    useState<ApplicationFormData>({
      ...EMPTY_APPLICATION_FORM,
      showroomId: showroomId
        ? String(showroomId)
        : "",
    });

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        setUser(data);

        setApplication((prev) => ({
          ...prev,
          companyName: data.company_name,
          contactName: data.user_name,
          email: data.email,
          phone: data.phone,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log(application);

    if (!application.showroomId) {
      alert("ショールームを選択してください。");
      return;
    }

    if (!application.periodFrom) {
      alert("展示開始日を入力してください。");
      return;
    }

    if (!application.periodTo) {
      alert("展示終了日を入力してください。");
      return;
    }

    if (application.periodFrom > application.periodTo) {
      alert("展示終了日は開始日以降の日付を選択してください。");
      return;
    }

    if (application.categories.length === 0) {
      alert("展示カテゴリを選択してください。");
      return;
    }

    if (!application.exhibitTitle.trim()) {
      alert("商品名を入力してください。");
      return;
    }

    if (!application.exhibitDescription.trim()) {
      alert("商品概要を入力してください。");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("ログインしてください。");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/applications/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            showroom_id: application.showroomId,
            showroom_name: application.showroomName,
            period_from: application.periodFrom,
            period_to: application.periodTo,
            category: application.categories.join(", "),
            notes: `
商品名：${application.exhibitTitle}

商品概要：
${application.exhibitDescription}
`.trim(),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);

        throw new Error(
          err?.detail ??
            err?.message ??
            "申請に失敗しました。"
        );
      }

      setOpenCompleteDialog(true);
            } catch (err) {
        console.error(err);

        alert(
          err instanceof Error
            ? err.message
            : "申請に失敗しました。"
        );
      }
    };

    return (
      <>
        <main className="mx-auto max-w-5xl px-6 py-10">
          <ApplyHeader />

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <ShowroomSection
              value={application}
              onChange={setApplication}
            />

            <ApplicantSection
              companyName={application.companyName}
              contactName={application.contactName}
              email={application.email}
              phone={application.phone}
            />

            <ProductSection
              value={application}
              onChange={setApplication}
            />

            <AttachmentSection />

            <AgreementSection />

            <SubmitSection />
          </form>
        </main>

        <CompleteDialog
          open={openCompleteDialog}
          applicationNo="SR-20260727-000001"
          onClose={() =>
            setOpenCompleteDialog(false)
          }
        />
      </>
    );
}