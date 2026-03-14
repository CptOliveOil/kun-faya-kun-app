import { useParams } from "wouter";
import { Clock, BookOpen } from "lucide-react";
import { useStoryDetail } from "@/hooks/use-stories";
import { useTheme } from "@/contexts/ThemeContext";

export default function StoryDetail() {
  const { categoryId, id } = useParams();
  const { data: story, isLoading } = useStoryDetail(id || "");
  const { alwaysShowArabic } = useTheme();

  // Fallback content if missing
  const content = story?.content?.length ? story.content : [
    {
      type: "paragraph",
      text: "Ibrahim (AS) grew up in a society drowned in idol worship. His own father, Azar, was a sculptor of the very idols the people worshipped. But Ibrahim's heart was drawn to truth — he questioned everything, looked at the stars, the moon and the sun, and concluded that none of these were worthy of worship. Only the One who created them all deserved his complete devotion."
    },
    {
      type: "highlight",
      text: "When his people led him to be thrown into a blazing fire, Ibrahim placed his trust entirely in Allah. He said: 'HasbiyAllahu wa ni'mal wakeel' — Allah is sufficient for me and He is the best Disposer of affairs.",
      arabic: "حَسْبِيَ اللهُ وَنِعْمَ الْوَكِيلُ",
      reference: "Quran 3:173"
    },
    {
      type: "verse",
      text: "We said: O Fire, be coolness and safety upon Ibrahim.",
      arabic: "قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ",
      reference: "Quran 21:69"
    }
  ];

  const storyData = story || {
    title: "Ibrahim and the Fire",
    subtitle: "The Father of Prophets",
    arabicTitle: "إِبْرَاهِيمُ وَالنَّار",
    readTime: 5,
    tags: ["Tawakkul", "Patience", "Miracle"],
  };

  if (isLoading) {
    return <div className="p-8 text-center text-primary mt-20">Loading Story...</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <header className="px-5 pt-2 pb-2 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground truncate">{storyData.title}</h1>
        <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full shrink-0">
          <Clock className="w-3.5 h-3.5" />
          {storyData.readTime} min read
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-24">
        {/* Story Header */}
        <div className="mb-10 text-center space-y-4">
          {storyData.arabicTitle && alwaysShowArabic && (
            <h2 className="text-4xl arabic-text text-secondary opacity-80 mb-6 text-center w-full">
              {storyData.arabicTitle}
            </h2>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {storyData.title}
          </h1>
          <p className="text-lg font-medium text-muted-foreground italic">
            {storyData.subtitle}
          </p>
          <div className="flex gap-2 justify-center flex-wrap pt-2">
            {storyData.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Story Content */}
        <div className="space-y-6 max-w-2xl mx-auto">
          {content.map((section: any, index: number) => {
            if (section.type === "paragraph") {
              return (
                <p key={index} className="text-base text-foreground/90 leading-relaxed font-medium">
                  {section.text}
                </p>
              );
            }
            
            if (section.type === "verse") {
              return (
                <div key={index} className="my-8 p-6 bg-[#FAF7E6] dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-[2rem] relative shadow-sm">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-[10px] font-bold rounded-full border border-yellow-200 dark:border-yellow-700 flex items-center gap-1 uppercase tracking-wider">
                    <BookOpen className="w-3 h-3" />
                    {section.reference || "Quran"}
                  </div>
                  {alwaysShowArabic && section.arabic && (
                    <p className="text-2xl md:text-3xl arabic-text text-foreground mb-6 text-right leading-[2.5]">
                      {section.arabic}
                    </p>
                  )}
                  <p className="text-base font-medium italic text-foreground/80 border-l-2 border-yellow-300 dark:border-yellow-700 pl-4">
                    "{section.text}"
                  </p>
                </div>
              );
            }

            if (section.type === "hadith") {
              return (
                <div key={index} className="my-8 p-6 bg-[#F2FAF6] dark:bg-primary/10 border border-primary/20 rounded-[2rem] relative shadow-sm">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full border border-primary/30 uppercase tracking-wider">
                    {section.reference || "Hadith"}
                  </div>
                  {alwaysShowArabic && section.arabic && (
                    <p className="text-2xl md:text-3xl arabic-text text-foreground mb-6 text-right leading-[2.5]">
                      {section.arabic}
                    </p>
                  )}
                  <p className="text-base font-medium text-foreground/80 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              );
            }

            if (section.type === "highlight") {
              return (
                <div key={index} className="my-8 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] border-l-4 border-l-secondary text-foreground">
                  <p className="font-bold text-lg leading-relaxed">
                    {section.text}
                  </p>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
