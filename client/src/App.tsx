import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import PhonePage from "@/pages/phone";
import { NotificationProvider } from "@/context/NotificationContext";
import { LanguageProvider } from "./hooks/useLanguage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PhonePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <LanguageProvider >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
