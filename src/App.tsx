import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Cartoes from "./pages/Cartoes";
import Clientes from "./pages/Clientes";
import Cobrancas from "./pages/Cobrancas";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";
import { useDatabase } from "./hooks/useDatabase";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isInitialized } = useDatabase();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cartoes" element={<Cartoes />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="cobrancas" element={<Cobrancas />} />
          <Route path="relatorios" element={<Relatorios />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
