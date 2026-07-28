"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

type ApplyPanelProps = {
  showroomId: number;
};

export default function ApplyPanel({
  showroomId,
}: ApplyPanelProps) {
  const router = useRouter();

  const handleApply = () => {
    // JWT取得
    const token = localStorage.getItem("access_token");

    // 未ログインならログイン画面へ
    if (!token) {
      router.push(
        `/login?redirect=/apply?showroomId=${showroomId}`
      );
      return;
    }

    // ログイン済みなら申請画面へ
    router.push(`/apply?showroomId=${showroomId}`);
  };

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-gray-500">
        出展検討中の方へ
      </p>

      <h2 className="mt-2 text-2xl font-bold leading-snug text-gray-900">
        このショールームに申請する
      </h2>

      <p className="mt-4 text-sm leading-7 text-gray-500">
        申請承認後、担当スタッフより搬入日程等の
        お打ち合わせのご連絡を差し上げます。
      </p>

      <button
        type="button"
        onClick={handleApply}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0e2147] px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        この枠で展示申請へ進む
        <ArrowUpRight className="h-4 w-4" />
      </button>

      <p className="mt-5 text-center text-xs leading-5 text-gray-400">
        ※ 申請完了時点では予約確定とはなりません。
        <br />
        担当者からのご連絡後に正式確定となります。
      </p>
    </aside>
  );
}