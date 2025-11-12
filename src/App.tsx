import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import SiteBuilder from "./pages/SiteBuilder";
import AppBuilder from "./pages/AppBuilder";
import Chatbots from "./pages/Chatbots";
import Automation from "./pages/Automation";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PublicSite from "./pages/PublicSite";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/sites" element={<Sites />} />
          <Route path="/dashboard/site-builder" element={<SiteBuilder />} />
          <Route path="/dashboard/app-builder" element={<AppBuilder />} />
          <Route path="/dashboard/chatbots" element={<Chatbots />} />
          <Route path="/dashboard/automation" element={<Automation />} />
          <Route path="/dashboard/billing" element={<Billing />} />
          <Route path="/dashboard/admin" element={<Admin />} />
          <Route path="/s/:slug" element={<PublicSite />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
