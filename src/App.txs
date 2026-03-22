import { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaInstallBanner } from "@/components/pwa-install";
import NotFound from "@/pages/not-found";
import Playground from "@/pages/playground";
import LegalAssistant from "@/pages/legal-assistant";
import TokenGenerator from "@/pages/token-generator";
import ComparadorJuridico from "@/pages/comparador-juridico";
import AuditoriaFinanceira from "@/pages/auditoria-financeira";
import ConsultaProcessual from "@/pages/consulta-processual";
import PainelProcessos from "@/pages/painel-processos";
import ConsultaCorporativo from "@/pages/consulta-corporativo";
import ConsultaPdpj from "@/pages/consulta-pdpj";
import LoginPage from "@/pages/login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LegalAssistant} />
      <Route path="/assistente">{() => <Redirect to="/" />}</Route>
      <Route path="/playground" component={Playground} />
      <Route path="/token" component={TokenGenerator} />
      <Route path="/comparador" component={ComparadorJuridico} />
      <Route path="/auditoria" component={AuditoriaFinanceira} />
      <Route path="/consulta" component={ConsultaProcessual} />
      <Route path="/painel" component={PainelProcessos} />
      <Route path="/corporativo" component={ConsultaCorporativo} />
      <Route path="/pdpj" component={ConsultaPdpj} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [authState, setAuthState] = useState<"loading" | "login" | "authenticated">("loading");

  useEffect(() => {
    fetch("/api/auth/check")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated || !data.passwordRequired) {
          setAuthState("authenticated");
        } else {
          setAuthState("login");
        }
      })
      .catch(() => setAuthState("authenticated"));
  }, []);

  if (authState === "loading") {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </ThemeProvider>
    );
  }

  if (authState === "login") {
    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <LoginPage onLogin={() => setAuthState("authenticated")} />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <PwaInstallBanner />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
