import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ArrowLeft, Bot, Play, RefreshCw, Settings, Upload, Eye, EyeOff,
  CheckCircle2, XCircle, Clock, Loader2, Key, FileText, Save,
  AlertCircle, List,
} from "lucide-react";

type Tab = "status" | "configuracoes" | "execucao" | "historico";

interface RoboRun {
  id: string;
  startedAt: string;
  finishedAt?: string;
  status: string;
  output?: string;
  error?: string;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "success") return <Badge className="bg-green-600 text-white"><CheckCircle2 className="w-3 h-3 mr-1" /> Sucesso</Badge>;
  if (status === "error") return <Badge className="bg-red-600 text-white"><XCircle className="w-3 h-3 mr-1" /> Erro</Badge>;
  if (status === "running") return <Badge className="bg-blue-600 text-white"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Executando</Badge>;
  return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>;
}

function fmt(d?: string) {
  if (!d) return "-";
  return new Date(d).toLocaleString("pt-BR");
}

const ROBO_SETTING_KEYS = [
  { key: "djen_token", label: "DJEN Token", placeholder: "Token de autenticação DJEN/CNJ", sensitive: true },
  { key: "pdpj_pem_private_key", label: "Chave PEM Privada (PDPJ)", placeholder: "-----BEGIN PRIVATE KEY-----\n...", sensitive: true, multiline: true },
  { key: "advogado_cpf", label: "CPF do Advogado", placeholder: "000.000.000-00", sensitive: false },
  { key: "datajud_api_key", label: "DataJud API Key", placeholder: "Chave de API DataJud", sensitive: true },
  { key: "gemini_api_key", label: "Gemini API Key", placeholder: "Chave API Google Gemini", sensitive: true },
  { key: "email_login", label: "E-mail (Gmail)", placeholder: "seu@gmail.com", sensitive: false },
  { key: "senha_app", label: "Senha de Aplicativo (Gmail)", placeholder: "xxxx xxxx xxxx xxxx", sensitive: true },
];

export default function RoboJuridico() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("status");
  const [settingValues, setSettingValues] = useState<Record<string, string>>({});
  const [revealMap, setRevealMap] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pemSettingKey, setPemSettingKey] = useState("pdpj_pem_private_key");

  // ── Status do robô ─────────────────────────────────────────────────────────
  const { data: statusData, isLoading: statusLoading, refetch: refetchStatus } = useQuery<any>({
    queryKey: ["/api/robo-juridico/status"],
    refetchInterval: 30000,
  });

  // ── Histórico de execuções ─────────────────────────────────────────────────
  const { data: runs, isLoading: runsLoading, refetch: refetchRuns } = useQuery<RoboRun[]>({
    queryKey: ["/api/robo/runs"],
    enabled: tab === "historico",
  });

  // ── Executar robô ──────────────────────────────────────────────────────────
  const runMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/robo/run", {}),
    onSuccess: () => {
      toast({ title: "Robô executado!", description: "Verifique o histórico para o resultado." });
      queryClient.invalidateQueries({ queryKey: ["/api/robo/runs"] });
    },
    onError: (e: any) => toast({ title: "Erro ao executar robô", description: e.message, variant: "destructive" }),
  });

  // ── Salvar configuração ────────────────────────────────────────────────────
  const saveSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      apiRequest("PUT", `/api/settings/${key}`, { value }),
    onSuccess: (_d, vars) => {
      toast({ title: `"${vars.key}" salvo!` });
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${vars.key}`] });
    },
    onError: (e: any) => toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" }),
  });

  // ── Upload de arquivo PEM ──────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "pem");
      formData.append("settingKey", pemSettingKey);
      const res = await fetch("/api/files", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Erro no upload" }));
        throw new Error(err.message);
      }
      toast({ title: "Arquivo PEM enviado!", description: `Salvo em "${pemSettingKey}"` });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    } catch (err: any) {
      toast({ title: "Erro no upload", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const stats = statusData?.data?.statistics || {};
  const configs = stats.configuracoes || {};
  const allOk = stats.todos_configurados === true;

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: "status", label: "Status", icon: <Bot className="w-4 h-4" /> },
    { id: "configuracoes", label: "Configurações", icon: <Settings className="w-4 h-4" /> },
    { id: "execucao", label: "Executar", icon: <Play className="w-4 h-4" /> },
    { id: "historico", label: "Histórico", icon: <List className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-lg">Robô Jurídico</span>
              {allOk
                ? <Badge className="bg-green-600 text-white text-xs">Ativo</Badge>
                : <Badge variant="outline" className="text-xs">Configuração incompleta</Badge>}
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 pb-0 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        {/* ── Status Tab ─────────────────────────────────────────────────── */}
        {tab === "status" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Status do Robô</h2>
              <Button variant="outline" size="sm" onClick={() => refetchStatus()} disabled={statusLoading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${statusLoading ? "animate-spin" : ""}`} /> Atualizar
              </Button>
            </div>

            {statusLoading ? (
              <Card><CardContent className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Configurações</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(configs).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-mono">{k}</span>
                        {v ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Arquivos do Robô</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(stats.arquivos || {}).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-mono text-xs">{k}</span>
                        {v ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className={`border ${allOk ? "border-green-500/30 bg-green-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
              <CardContent className="py-4 flex items-start gap-3">
                {allOk
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  : <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />}
                <div>
                  <p className="font-medium text-sm">{statusData?.data?.message || "Verificando..."}</p>
                  {!allOk && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Vá até a aba <strong>Configurações</strong> para preencher as chaves faltantes.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Configurações Tab ───────────────────────────────────────────── */}
        {tab === "configuracoes" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Configurações do Robô Jurídico</h2>
            <p className="text-sm text-muted-foreground">
              As configurações são salvas de forma segura no banco de dados.
              Valores sensíveis são mascarados — clique em <Eye className="w-3 h-3 inline" /> para revelar.
            </p>

            {/* Upload de arquivo PEM */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload de Arquivo PEM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Faça upload de um arquivo <code>.pem</code> ou <code>.key</code>. O conteúdo será salvo
                  automaticamente na configuração selecionada abaixo.
                </p>
                <div className="flex gap-2">
                  <select
                    value={pemSettingKey}
                    onChange={e => setPemSettingKey(e.target.value)}
                    className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {ROBO_SETTING_KEYS.filter(s => s.multiline).map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
                    {uploading ? "Enviando..." : "Selecionar arquivo"}
                  </Button>
                  <input ref={fileInputRef} type="file" accept=".pem,.key,.crt,.cer,text/plain" className="hidden" onChange={handleFileUpload} />
                </div>
              </CardContent>
            </Card>

            {/* Settings individuais */}
            <div className="space-y-3">
              {ROBO_SETTING_KEYS.map(({ key, label, placeholder, sensitive, multiline }) => (
                <SettingField
                  key={key}
                  settingKey={key}
                  label={label}
                  placeholder={placeholder}
                  sensitive={sensitive}
                  multiline={multiline}
                  value={settingValues[key] ?? undefined}
                  onValueChange={(v) => setSettingValues(prev => ({ ...prev, [key]: v }))}
                  reveal={revealMap[key] ?? false}
                  onToggleReveal={() => setRevealMap(prev => ({ ...prev, [key]: !prev[key] }))}
                  onSave={(v) => saveSettingMutation.mutate({ key, value: v })}
                  saving={saveSettingMutation.isPending && (saveSettingMutation.variables as { key: string } | undefined)?.key === key}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Executar Tab ────────────────────────────────────────────────── */}
        {tab === "execucao" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Executar Robô Jurídico</h2>

            <Card>
              <CardContent className="py-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Bot className="w-8 h-8 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Execução Manual</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Clique em <strong>Executar Agora</strong> para rodar o robô imediatamente.
                      O resultado ficará disponível no <strong>Histórico</strong>.
                    </p>
                    {!allOk && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Configuração incompleta — algumas funções podem falhar.
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => runMutation.mutate()}
                  disabled={runMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {runMutation.isPending
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Executando...</>
                    : <><Play className="w-4 h-4 mr-2" /> Executar Agora</>}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Execução Automática (Vercel Cron)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Para execução automática via Vercel Cron Jobs, adicione ao <code>vercel.json</code>:
                </p>
                <pre className="bg-muted rounded p-3 text-xs overflow-x-auto">{`{
  "crons": [
    {
      "path": "/api/robo/cron",
      "schedule": "0 8 * * 1-5"
    }
  ]
}`}</pre>
                <p>
                  Defina a variável <code>CRON_SECRET</code> no ambiente Vercel e adicione o header
                  <code> Authorization: Bearer &lt;CRON_SECRET&gt;</code> à chamada.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Histórico Tab ───────────────────────────────────────────────── */}
        {tab === "historico" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Histórico de Execuções</h2>
              <Button variant="outline" size="sm" onClick={() => refetchRuns()} disabled={runsLoading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${runsLoading ? "animate-spin" : ""}`} /> Atualizar
              </Button>
            </div>

            {runsLoading ? (
              <Card><CardContent className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></CardContent></Card>
            ) : !runs || runs.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma execução registrada.</CardContent></Card>
            ) : (
              <div className="space-y-2">
                {runs.map((run) => (
                  <Card key={run.id}>
                    <CardContent className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={run.status} />
                          <span className="text-sm font-mono text-muted-foreground">{run.id.slice(0, 8)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground space-x-2">
                          <span>Início: {fmt(run.startedAt)}</span>
                          {run.finishedAt && <span>Fim: {fmt(run.finishedAt)}</span>}
                        </div>
                      </div>
                      {run.error && (
                        <p className="text-xs text-red-500 font-mono mt-1 bg-red-500/10 rounded p-2 whitespace-pre-wrap">{run.error}</p>
                      )}
                      {run.output && run.status === "success" && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Ver saída</summary>
                          <pre className="mt-1 bg-muted rounded p-2 overflow-x-auto whitespace-pre-wrap">{run.output}</pre>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Componente para campo de configuração individual ──────────────────────────
function SettingField({
  settingKey, label, placeholder, sensitive, multiline,
  value, onValueChange, reveal, onToggleReveal, onSave, saving,
}: {
  settingKey: string;
  label: string;
  placeholder?: string;
  sensitive?: boolean;
  multiline?: boolean;
  value?: string;
  onValueChange: (v: string) => void;
  reveal: boolean;
  onToggleReveal: () => void;
  onSave: (v: string) => void;
  saving?: boolean;
}) {
  const { data: saved } = useQuery<{ value: string | null }>({
    queryKey: [`/api/settings/${settingKey}`],
  });

  const displayValue = value !== undefined ? value : (saved?.value || "");
  const hasSaved = saved?.value && saved.value !== "";

  return (
    <Card>
      <CardContent className="py-3 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-muted-foreground" />
            {label}
            {hasSaved && <Badge className="text-xs bg-green-600/20 text-green-700 dark:text-green-400 border-green-600/30">Salvo</Badge>}
          </label>
          {sensitive && (
            <button onClick={onToggleReveal} className="text-muted-foreground hover:text-foreground">
              {reveal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {multiline ? (
            <Textarea
              placeholder={placeholder}
              value={displayValue}
              onChange={e => onValueChange(e.target.value)}
              className="font-mono text-xs h-24"
            />
          ) : (
            <Input
              type={sensitive && !reveal ? "password" : "text"}
              placeholder={placeholder}
              value={displayValue}
              onChange={e => onValueChange(e.target.value)}
              className="font-mono text-sm"
            />
          )}
          <Button
            size="sm"
            onClick={() => onSave(displayValue)}
            disabled={saving || !displayValue}
            className="shrink-0"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
