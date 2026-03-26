import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Scale, Bell, User, ChevronDown, Home, Search, Folder, Calendar, Mail, Settings, LogOut, FileText, ExternalLink, Clock, AlertCircle, Building } from "lucide-react";

interface Comunicacao {
  id: number;
  data_disponibilizacao: string;
  siglaTribunal: string;
  tipoComunicacao: string;
  nomeOrgao: string;
  texto: string;
  numero_processo: string;
  link: string | null;
  tipoDocumento: string;
  nomeClasse: string;
  codigoClasse: string;
  numeroprocessocommascara: string;
  status: string;
  advogado: {
    nome: string;
    numero_oab: string;
    uf_oab: string;
  };
}

export default function Intimacoes() {
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    fetch("/api/comunicacoes")
      .then(res => res.json())
      .then(data => {
        setComunicacoes(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-800 font-sans text-sm">
      {/* PJe Top Header */}
      <header className="bg-[#0d47a1] text-white">
        <div className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#0d47a1]" />
              </div>
              <div>
                <span className="font-bold text-lg">PJe</span>
                <span className="text-xs ml-2 opacity-80">Processo Judicial Eletrônico</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs opacity-80">01/12/2025 22:50:32</span>
            <Bell className="w-4 h-4 opacity-80" />
            <Settings className="w-4 h-4 opacity-80" />
          </div>
        </div>
      </header>

      {/* Secondary Nav */}
      <div className="bg-[#1565c0] text-white">
        <div className="flex items-center justify-between px-4 h-10">
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 px-3 text-xs gap-2" onClick={() => setLocation("/dashboard")}>
              <Home className="w-3.5 h-3.5" /> Painel
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 px-3 text-xs gap-2" onClick={() => setLocation("/pje-cnj")}>
              <Search className="w-3.5 h-3.5" /> Processo
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 px-3 text-xs gap-2">
              <Folder className="w-3.5 h-3.5" /> Peticionamento
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 px-3 text-xs gap-2">
              <Calendar className="w-3.5 h-3.5" /> Audiências
            </Button>
            <Button variant="ghost" size="sm" className="text-white bg-white/20 h-8 px-3 text-xs gap-2">
              <Mail className="w-3.5 h-3.5" /> Intimações
            </Button>
          </nav>
          <div className="flex items-center gap-2 bg-white/10 rounded px-2 py-1">
            <User className="w-4 h-4" />
            <div className="text-xs">
              <div className="font-medium">MAIKON DA ROCHA CALDEIRA</div>
              <div className="opacity-70 text-[10px]">OAB/MG 183712</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Home className="w-3.5 h-3.5" />
          <span>/</span>
          <span className="text-slate-700 font-medium">Intimações e Comunicações</span>
        </div>
      </div>

      <main className="p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded shadow-sm border border-slate-200 mb-4">
          <div className="bg-[#1976d2] text-white px-4 py-3 rounded-t flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <div>
                <div className="font-bold text-lg">Domicílio Judicial Eletrônico</div>
                <div className="text-xs opacity-80">Intimações e Comunicações Processuais</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-medium">
                {comunicacoes.length} PENDENTES
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Filtrar por número do processo..." 
                  className="text-xs border border-slate-200 rounded px-3 py-2 w-64"
                  data-testid="input-filtro"
                />
                <Button size="sm" variant="outline" className="text-xs h-8">
                  <Search className="w-3.5 h-3.5 mr-1" /> Buscar
                </Button>
              </div>
              <div className="text-xs text-slate-500">
                Exibindo {comunicacoes.length} comunicações
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-slate-500">Carregando intimações...</div>
            ) : (
              <div className="space-y-3">
                {comunicacoes.map((com) => (
                  <div 
                    key={com.id} 
                    className={`border rounded-lg p-4 ${
                      com.status === "P" ? "bg-yellow-50 border-yellow-200" : "bg-white border-slate-200"
                    }`}
                    data-testid={`comunicacao-${com.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {com.status === "P" && (
                            <span className="bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                              PENDENTE
                            </span>
                          )}
                          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded font-medium">
                            {com.siglaTribunal}
                          </span>
                          <span className="text-xs text-slate-500">
                            {com.tipoComunicacao}
                          </span>
                        </div>
                        
                        <div className="font-bold text-slate-800 mb-1" data-testid={`processo-${com.id}`}>
                          {com.numeroprocessocommascara}
                        </div>
                        
                        <div className="text-xs text-slate-600 mb-2">
                          <span className="font-medium">{com.nomeClasse}</span>
                          <span className="mx-2">•</span>
                          <span>{com.nomeOrgao}</span>
                        </div>
                        
                        <div className="text-xs text-slate-500 line-clamp-2">
                          {com.texto}
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(com.data_disponibilizacao)}
                        </div>
                        
                        <div className="flex gap-2">
                          {com.link && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-7 gap-1"
                              onClick={() => window.open(com.link!, "_blank")}
                              data-testid={`link-doc-${com.id}`}
                            >
                              <FileText className="w-3 h-3" /> Ver Doc
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            className="text-xs h-7 gap-1 bg-[#1976d2] hover:bg-[#1565c0]"
                            onClick={() => setLocation("/pje-cnj")}
                            data-testid={`link-autos-${com.id}`}
                          >
                            <ExternalLink className="w-3 h-3" /> Autos
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d47a1] text-white/80 text-xs py-3 mt-4">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-4 h-4" />
            <span>PJe - Processo Judicial Eletrônico</span>
            <span className="opacity-50">|</span>
            <span>Domicílio Judicial Eletrônico - CNJ</span>
          </div>
          <span>Versão 2.7.1.0</span>
        </div>
      </footer>
    </div>
  );
}
