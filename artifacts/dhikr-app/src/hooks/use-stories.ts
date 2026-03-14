import { useQuery } from "@tanstack/react-query";
import { getStoryCategories, getStories, getStory } from "@workspace/api-client-react";

export function useStoryCategories() {
  return useQuery({
    queryKey: ["story-categories"],
    queryFn: () => getStoryCategories(),
  });
}

export function useStories(categoryId?: string) {
  return useQuery({
    queryKey: ["stories", categoryId],
    queryFn: () => getStories(categoryId ? { categoryId } : undefined),
  });
}

export function useStoryDetail(id: string) {
  return useQuery({
    queryKey: ["story", id],
    queryFn: () => getStory({ id }),
    enabled: !!id,
  });
}
