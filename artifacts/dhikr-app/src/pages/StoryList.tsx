import { useParams, Link } from "wouter";
import { ChevronRight, Clock } from "lucide-react";
import { useStories } from "@/hooks/use-stories";

export default function StoryList() {
  const { categoryId } = useParams();
  const { data: stories, isLoading } = useStories(categoryId);

  const sList = stories?.length ? stories : [
    {
      id: "ibrahim-fire",
      categoryId: categoryId || "prophets",
      title: "Ibrahim and the Fire",
      subtitle: "The Father of Prophets",
      arabicTitle: "إِبْرَاهِيمُ وَالنَّار",
      readTime: 5,
      tags: ["Tawakkul", "Patience", "Miracle"],
      content: []
    },
    {
      id: "yusuf-patience",
      categoryId: categoryId || "prophets",
      title: "Yusuf — The Best of Stories",
      subtitle: "From the well to the throne",
      arabicTitle: "يُوسُفُ — أَحْسَنُ الْقَصَص",
      readTime: 7,
      tags: ["Patience", "Gratitude", "Trust in Allah"],
      content: []
    }
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-primary mt-20">Loading Stories...</div>;
  }

  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ') : "Category";

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="px-5 pt-2 pb-2">
        <h1 className="text-xl font-bold text-foreground">{categoryName}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {sList.map((story) => (
          <Link key={story.id} href={`/library/stories/${categoryId}/${story.id}`} className="bg-card rounded-3xl p-5 shadow-sm border border-border block group cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start gap-2 mb-3">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {story.title}
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {story.subtitle}
                </p>
              </div>
              {story.arabicTitle && (
                <span className="text-xl arabic-text text-secondary opacity-80 shrink-0">
                  {story.arabicTitle}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex gap-2 flex-wrap">
                {story.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-muted text-[10px] font-bold text-muted-foreground rounded-md uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {story.readTime} min
                </span>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
