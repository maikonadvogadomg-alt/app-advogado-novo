import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Zap, LogOut, AlertCircle, DollarSign, Calendar, FileText, Gavel, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [_, setLocation] = useLocation();

  const handleLogout = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="w-full border-b border-white/10 backdrop-blur-md bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ConnectHub</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium">João Silva</span>
              <span className="text-xs text-muted-foreground">ID: MG183712</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-white/5">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Painel do Colaborador</h1>
        <p className="text-muted-foreground mb-8">Gerencie seus benefícios e solicitações.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Salary Advance Card - BLOCKED */}
          <Card className="bg-card/50 backdrop-blur-sm border-destructive/50 shadow-lg relative overflow-hidden col-span-1 md:col-span-2 flex flex-col">
            <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Solicitação Negada</span>
                </div>
                <DollarSign className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl mt-2">Adiantamento Salarial</CardTitle>
              <CardDescription>Status da sua solicitação de antecipação</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                <p className="text-destructive font-medium">Não é possível realizar o adiantamento.</p>
                <p className="text-sm text-destructive/80 mt-1">
                  O seu ID (MG183712) não possui margem consignável disponível ou não atende aos critérios de elegibilidade neste ciclo.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted">
                  Solicitar Novo Adiantamento
                </Button>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
               <Button 
                variant="outline" 
                className="w-full border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400 text-blue-500 group"
                onClick={() => setLocation("/pje")}
              >
                <Gavel className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Consultar Processo Judicial (eProc)
                <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
              </Button>
            </CardFooter>
          </Card>

          {/* Other Services */}
          <div className="space-y-6">
             <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Holerite Digital</CardTitle>
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Visualize e baixe seus últimos comprovantes.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Férias</CardTitle>
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Saldo disponível: 15 dias</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
