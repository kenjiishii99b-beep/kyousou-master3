"use client";

type ApplicantSectionProps = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
};

export default function ApplicantSection({
  companyName,
  contactName,
  email,
  phone,
}: ApplicantSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">
        申請者情報
      </h2>

      <div className="mt-8 grid gap-6">

        {/* 企業名 */}
        <div>
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-semibold"
          >
            企業名
          </label>

          <input
            id="companyName"
            type="text"
            value={companyName}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
          />
        </div>

        {/* 担当者名 */}
        <div>
          <label
            htmlFor="contactName"
            className="mb-2 block text-sm font-semibold"
          >
            担当者名
          </label>

          <input
            id="contactName"
            type="text"
            value={contactName}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold"
          >
            メールアドレス
          </label>

          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
          />
        </div>

        {/* 電話番号 */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold"
          >
            電話番号
          </label>

          <input
            id="phone"
            type="tel"
            value={phone}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
          />
        </div>

      </div>
    </section>
  );
}