"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { fetchShowroom } from "@/lib/api/showrooms";
import { Showroom } from "@/types/showroom";

import ApplyPanel from "@/components/showrooms/ApplyPanel";
import BackButton from "@/components/showrooms/BackButton";
import FacilitySection from "@/components/showrooms/FacilitySection";
import ShowroomHeader from "@/components/showrooms/ShowroomHeader";
import ShowroomImage from "@/components/showrooms/ShowroomImage";
import SummarySection from "@/components/showrooms/SummarySection";

export default function ShowroomDetailPage() {
  const params = useParams();

  const showroomId = Number(params.id);

  const [showroom, setShowroom] = useState<Showroom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShowroom = async () => {
      try {
        const data = await fetchShowroom(showroomId);
        setShowroom(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isNaN(showroomId)) {
      loadShowroom();
    }
  }, [showroomId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        読み込み中...
      </main>
    );
  }

  if (!showroom) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        ショールームが見つかりません。
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <BackButton />

      <ShowroomHeader
        category={showroom.category ?? "ショールーム"}
        name={showroom.name}
        address={showroom.address}
        availableFrom={showroom.availableFrom}
        available={true}
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ShowroomImage
            imageUrl={showroom.thumbnailUrl}
            alt={showroom.name}
          />
        </div>

        <div className="lg:col-span-4">
          <ApplyPanel showroomId={showroom.id} />
        </div>
      </section>

      <SummarySection
        summary={
          showroom.summary ??
          "ショールームの説明は登録されていません。"
        }
      />

      <FacilitySection
        boothType={showroom.boothType ?? "-"}
        boothSize={showroom.boothSize ?? "-"}
        power={showroom.power ?? "-"}
        wifi={showroom.wifi ?? "-"}
        parking={showroom.parking ?? "-"}
        carryIn={showroom.carryIn ?? "-"}
      />
    </main>
  );
}