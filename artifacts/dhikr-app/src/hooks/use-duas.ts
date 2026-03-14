import { useGetDuaCategories, useGetDuas } from "@workspace/api-client-react";

export function useDuaCategories() {
  return useGetDuaCategories({
    query: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    }
  });
}

export function useDuasByCategory(categoryId: string) {
  return useGetDuas(
    { categoryId },
    {
      query: {
        enabled: !!categoryId,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
      }
    }
  );
}
