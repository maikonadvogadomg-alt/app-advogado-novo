1| import { useState, useCallback } from "react";
2| import { Link } from "wouter";
3| import { Button } from "@/components/ui/button";
4| import { Input } from "@/components/ui/input";
5| import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
6| import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
7| import { useToast } from "@/hooks/use-toast";
8| import { Search, Gavel, ArrowLeft, Calendar, Building2, FileText, Tag, Clock, ChevronDown, ChevronUp, Copy, Loader2 } from "lucide-react";
9| 
10| interface Movimento {
11|   dataHora: string;
12|   nome: string;
13|   codigo: string;
14|   complementos: Array<{ nome: string; valor: string; descricao?: string }>; 
15| }
16| 
17| interface ProcessoData {
18|   numero: string;
19|   classe: string;
20|   classeCode: string;
21|   sistema: string;
22|   formato: string;
23|   orgaoJulgador: string;
24|   codigoOrgao: string;
25|   municipio: string;
26|   dataAjuizamento: string;
27|   dataUltimaAtualizacao: string;
28|   grau: string;
29|   nivelSigilo: number;
30|   assuntos: Array<{ nome: string; codigo: string }>; 
31|   movimentos: Movimento[];
32| }
33| 
34| const TRIBUNAIS_POPULARES = [
35|   { sigla: "auto", label: "Detectar automaticamente" },
36|   { sigla: "TJMG", label: "TJMG - Minas Gerais" },
37|   { sigla: "TJSP", label: "TJSP - Sao Paulo" },
38|   { sigla: "TJRJ", label: "TJRJ - Rio de Janeiro" },
39|   { sigla: "TJBA", label: "TJBA - Bahia" },
40|   { sigla: "TJPR", label: "TJPR - Parana" },
41|   { sigla: "TJRS", label: "TJRS - Rio Grande do Sul" },
42|   { sigla: "TJSC", label: "TJSC - Santa Catarina" },
43|   { sigla: "TJGO", label: "TJGO - Goias" },
44|   { sigla: "TJDFT", label: "TJDFT - Distrito Federal" },
45|   { sigla: "TJCE", label: "TJCE - Ceara" },
46|   { sigla: "TJPE", label: "TJPE - Pernambuco" },
47|   { sigla: "TJMA", label: "TJMA - Maranhao" },
48|   { sigla: "TJPA", label: "TJPA - Para" },
49|   { sigla: "TJES", label: "TJES - Espirito Santo" },
50|   { sigla: "TJMT", label: "TJMT - Mato Grosso" },
51|   { sigla: "TJMS", label: "TJMS - Mato Grosso do Sul" },
52|   { sigla: "TJAL", label: "TJAL - Alagoas" },
53|   { sigla: "TJSE", label: "TJSE - Sergipe" },
54|   { sigla: "TJPB", label: "TJPB - Paraiba" },
55|   { sigla: "TJRN", label: "TJRN - Rio Grande do Norte" },
56|   { sigla: "TJPI", label: "TJPI - Piaui" },
57|   { sigla: "TJTO", label: "TJTO - Tocantins" },
58|   { sigla: "TJAC", label: "TJAC - Acre" },
59|   { sigla: "TJAM", label: "TJAM - Amazonas" },
60|   { sigla: "TJAP", label: "TJAP - Amapa" },
61|   { sigla: "TJRO", label: "TJRO - Rondonia" },
62|   { sigla: "TJRR", label: "TJRR - Roraima" },
63|   { sigla: "TRF1", label: "TRF1 - 1a Regiao" },
64|   { sigla: "TRF2", label: "TRF2 - 2a Regiao" },
65|   { sigla: "TRF3", label: "TRF3 - 3a Regiao" },
66|   { sigla: "TRF4", label: "TRF4 - 4a Regiao" },
67|   { sigla: "TRF5", label: "TRF5 - 5a Regiao" },
68|   { sigla: "TRF6", label: "TRF6 - 6a Regiao" },
69|   { sigla: "STJ", label: "STJ - Superior Tribunal de Justica" },
70|   { sigla: "STF", label: "STF - Supremo Tribunal Federal" },
71|   { sigla: "TST", label: "TST - Tribunal Superior do Trabalho" },
72| ];
73| 
74| function formatDate(dateStr: string): string {
75|   if (!dateStr) return "";
76|   try {
77|     const d = new Date(dateStr);
78|     return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
79|   } catch { return dateStr; }
80| }
81| 
82| function formatDateShort(dateStr: string): string {
83|   if (!dateStr) return "";
84|   try {
85|     const d = new Date(dateStr);
86|     return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
87|   } catch { return dateStr; }
88| }
89| 
90| function formatProcessoNumber(num: string): string {
91|   const c = num.replace(/\D/g, "");
92|   if (c.length === 20) {
93|     return `${c.slice(0,7)}-${c.slice(7,9)}.${c.slice(9,13)}.${c.slice(13,14)}.${c.slice(14,16)}.${c.slice(16,20)}`;
94|   }
95|   return num;
96| }
97| 
98| interface ProcessoOabResult {
99|   numero: string;
100|   classe: string;
101|   orgaoJulgador: string;
102|   dataAjuizamento: string;
103|   dataUltimaAtualizacao: string;
104|   assuntos: Array<{ nome: string; codigo: string }>; 
105|   ultimaMovimentacao: string;
106|   ultimaMovimentacaoData: string;
107|   totalMovimentos: number;
108| }
109| 
110| export default function ConsultaProcessual() {
111|   const [numero, setNumero] = useState("");
112|   const [tribunal, setTribunal] = useState("auto");
113|   const [loading, setLoading] = useState(false);
114|   const [processo, setProcesso] = useState<ProcessoData | null>(null);
115|   const [tribunalDetectado, setTribunalDetectado] = useState("");
116|   const [notFound, setNotFound] = useState(false);
117|   const [errorMsg, setErrorMsg] = useState("");
118|   const [showAll, setShowAll] = useState(false);
119|   const [modoBusca, setModoBusca] = useState<"processo" | "oab" | "cpf">("processo");
120|   const [oab, setOab] = useState(() => localStorage.getItem("consulta_oab") || "");
121|   const [oabUf, setOabUf] = useState(() => localStorage.getItem("consulta_oab_uf") || "MG");
122|   const [resultadosOab, setResultadosOab] = useState<ProcessoOabResult[]>([]);
123|   const [tribunalOab, setTribunalOab] = useState(() => localStorage.getItem("consulta_tribunal_oab") || "TJMG");
124|   const [cpfBusca, setCpfBusca] = useState(() => localStorage.getItem("consulta_cpf") || "");
125|   const [tribunalCpf, setTribunalCpf] = useState(() => localStorage.getItem("consulta_tribunal_cpf") || "TJMG");
126|   const { toast } = useToast();
...