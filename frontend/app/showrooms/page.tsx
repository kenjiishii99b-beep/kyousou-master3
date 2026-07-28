"use client";

import { useEffect, useState } from "react";

import SearchFilter from "@/components/showrooms/SearchFilter";
import ShowroomList from "@/components/showrooms/ShowroomList";

import {
  DEFAULT_FILTERS,
  SearchFilters,
  Showroom,
} from "@/types/showroom";

import { fetchShowrooms } from "@/lib/api/showrooms";

export default function ShowroomsPage() {
  const [filters, setFilters] =
    useState<SearchFilters>(DEFAULT_FILTERS);

  const [showrooms, setShowrooms] =
    useState<Showroom[]>([]);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    handleSearch();
  }, []);

  async function handleSearch() {
    try {
      setLoading(true);
      setError("");

      const result = await fetchShowrooms(filters);

      setShowrooms(result.items);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
      setError("ショールーム情報の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          ショールーム検索
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          条件を指定してショールームを検索できます。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* 左 */}
        <aside className="lg:col-span-4">
          <SearchFilter
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
          />
        </aside>

        {/* 右 */}
        <section className="lg:col-span-8">
          {loading ? (
            <div className="rounded-lg border bg-white p-6">
              読み込み中...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-red-600">
              {error}
            </div>
          ) : (
            <ShowroomList
              showrooms={showrooms}
              total={total}
            />
          )}
        </section>
      </div>
    </main>
  );
}