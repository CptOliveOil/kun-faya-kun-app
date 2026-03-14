import { useParams } from "wouter";
import { useDuasByCategory } from "@/hooks/use-duas";

export default function DuaDetail() {
  const { categoryId } = useParams();
  const { data: duas, isLoading } = useDuasByCategory(categoryId || "");

  const defaultDuas = duas?.length ? duas : [
    {
      id: "1",
      categoryId: categoryId || "general",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Bismillahir Rahmanir Raheem",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      reference: "Quran 1:1",
      order: 1
    },
    {
      id: "2",
      categoryId: categoryId || "general",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      transliteration: "Rabbi zidni 'ilma",
      translation: "My Lord, increase me in knowledge.",
      reference: "Quran 20:114",
      order: 2
    },
    {
      id: "3",
      categoryId: categoryId || "general",
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbana atina fid-dunya hasanatan wa fil-'akhirati hasanatan waqina 'adhaban-nar",
      translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
      reference: "Quran 2:201",
      order: 3
    }
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-primary mt-20">Loading Duas...</div>;
  }

  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ') : "Category";

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="px-5 pt-2 pb-2">
        <h1 className="text-xl font-bold text-foreground">{categoryName} Duas</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-24">
        {defaultDuas.map((dua) => (
          <div
            key={dua.id}
            className="bg-card rounded-3xl p-6 shadow-sm border border-border"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20">
                {dua.reference}
              </span>
            </div>
            
            <p className="text-3xl leading-[2.5] arabic-text text-foreground mb-6 text-right">
              {dua.arabic}
            </p>
            
            <div className="space-y-3">
              <p className="text-base text-primary font-medium italic">
                {dua.transliteration}
              </p>
              <div className="h-px w-full bg-border" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {dua.translation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
