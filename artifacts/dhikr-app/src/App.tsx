import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Home from "@/pages/Home";
import Counter from "@/pages/Counter";
import Prayers from "@/pages/Prayers";
import Library from "@/pages/Library";
import DuaDetail from "@/pages/DuaDetail";
import StoryList from "@/pages/StoryList";
import StoryDetail from "@/pages/StoryDetail";
import QuranTracker from "@/pages/QuranTracker";
import More from "@/pages/More";
import Qibla from "@/pages/Qibla";
import Quiz from "@/pages/Quiz";
import Settings from "@/pages/Settings";
import Stats from "@/pages/Stats";
import Videos from "@/pages/Videos";
import HalalTok from "@/pages/HalalTok";
import Qurandle from "@/pages/Qurandle";
import PrayerTimeSettings from "@/pages/PrayerTimeSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dhikr" component={Counter} />
        <Route path="/prayers" component={Prayers} />
        
        <Route path="/library" component={Library} />
        <Route path="/library/duas/:categoryId" component={DuaDetail} />
        <Route path="/library/stories/:categoryId" component={StoryList} />
        <Route path="/library/stories/:categoryId/:id" component={StoryDetail} />
        
        <Route path="/quran" component={QuranTracker} />
        <Route path="/halaltok" component={HalalTok} />
        <Route path="/qurandle" component={Qurandle} />
        <Route path="/videos" component={Videos} />
        <Route path="/more" component={More} />
        <Route path="/stats" component={Stats} />
        <Route path="/qibla" component={Qibla} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/settings" component={Settings} />
        <Route path="/prayer-settings" component={PrayerTimeSettings} />
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppRoutes />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
