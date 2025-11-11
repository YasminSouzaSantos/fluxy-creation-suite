import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Mail, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Automation {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  created_at: string;
}

const Automation = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [automationName, setAutomationName] = useState("");
  const [automationType, setAutomationType] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("automations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar automações");
    } else {
      setAutomations(data || []);
    }
    setLoading(false);
  };

  const createAutomation = async () => {
    if (!automationName || !automationType) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("automations").insert({
      user_id: user.id,
      name: automationName,
      type: automationType,
      content: content,
      is_active: true,
    });

    if (error) {
      toast.error("Erro ao criar automação");
    } else {
      toast.success("Automação criada com sucesso!");
      setAutomationName("");
      setAutomationType("");
      setContent("");
      setShowCreateForm(false);
      fetchAutomations();
    }
    setCreating(false);
  };

  const deleteAutomation = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta automação?")) return;

    const { error } = await supabase.from("automations").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir automação");
    } else {
      toast.success("Automação excluída com sucesso");
      fetchAutomations();
    }
  };

  const automationTypes = [
    { value: "email", label: "Email Marketing" },
    { value: "post", label: "Post em Redes Sociais" },
    { value: "sms", label: "SMS" },
    { value: "whatsapp", label: "WhatsApp" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Automação de Marketing</h1>
            <p className="text-muted-foreground">
              Automatize campanhas, posts e comunicações com IA
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Nova Automação
          </Button>
        </div>

        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Automação</CardTitle>
              <CardDescription>
                Configure sua automação de marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="automation-name">Nome da Automação</Label>
                <Input
                  id="automation-name"
                  placeholder="Ex: Campanha de Lançamento"
                  value={automationName}
                  onChange={(e) => setAutomationName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="automation-type">Tipo de Automação</Label>
                <Select value={automationType} onValueChange={setAutomationType}>
                  <SelectTrigger id="automation-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {automationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo (a IA pode ajudar a melhorar)</Label>
                <Textarea
                  id="content"
                  placeholder="Digite o conteúdo da sua campanha..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={createAutomation}
                  disabled={creating}
                >
                  {creating ? "Criando..." : "Criar Automação"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : automations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Mail className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma automação criada ainda</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Crie sua primeira automação e economize tempo com marketing
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                Criar Primeira Automação
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map((automation) => (
              <Card key={automation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    {automation.is_active && (
                      <Badge variant="default">Ativa</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{automation.name}</CardTitle>
                  <CardDescription className="capitalize">
                    {automation.type.replace("_", " ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => deleteAutomation(automation.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Automation;
