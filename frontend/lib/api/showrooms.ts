import { SearchFilters, Showroom } from "@/types/showroom";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface FetchShowroomsResponse {
  items: Showroom[];
  total: number;
}

function formatShowroom(item: any): Showroom {
  let parsedFacilities: string[] = [];

  if (typeof item.facilities === "string") {
    try {
      parsedFacilities = JSON.parse(item.facilities);
    } catch {
      parsedFacilities = [];
    }
  } else if (Array.isArray(item.facilities)) {
    parsedFacilities = item.facilities;
  }

  return {
    ...item,

    // FastAPI(image_url) → Frontend(thumbnailUrl)
    thumbnailUrl: item.image_url ?? item.thumbnailUrl ?? "",

    facilities: parsedFacilities,

    monthlyVisitors:
      typeof item.capacity === "number"
        ? item.capacity
        : (item.monthlyVisitors ?? 0),

    availableFrom:
      item.availableFrom ??
      (item.created_at
        ? new Date(item.created_at).toLocaleDateString("ja-JP")
        : "随時"),
  };
}

/**
 * ショールーム一覧取得
 */
export async function fetchShowrooms(
  filters: SearchFilters
): Promise<FetchShowroomsResponse> {
  const params = new URLSearchParams();

  if (filters.prefecture) {
    params.append("prefecture", filters.prefecture);
  }

  if (filters.area) {
    params.append("area", filters.area);
  }

  if (filters.categories?.length) {
    params.append(
      "categories",
      filters.categories.join(",")
    );
  }

  if (filters.visitorAttribute) {
    params.append(
      "visitorAttribute",
      filters.visitorAttribute
    );
  }

  const url = `${API_BASE_URL}/api/showrooms/?${params.toString()}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `APIエラー (${res.status})`
    );
  }

  const data = await res.json();

  return {
    items: (data.items ?? []).map(formatShowroom),
    total: data.total ?? 0,
  };
}

/**
 * ショールーム詳細取得
 */
export async function fetchShowroom(
  id: number
): Promise<Showroom> {
  const res = await fetch(
    `${API_BASE_URL}/api/showrooms/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `ショールーム取得失敗 (${res.status})`
    );
  }

  const data = await res.json();

  return formatShowroom(data);
}