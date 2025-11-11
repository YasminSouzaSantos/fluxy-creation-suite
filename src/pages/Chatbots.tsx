import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Bot, Plus, Edit, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Chatbot {
  id: string;
  name: string;
  is_active: boolean;
  whatsapp_number: string | null;
  created_at: string;
}

const Chatbots = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [botName, setBotName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchChatbots();
  }, []);

  const fetchChatbots = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("chatbots")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar chatbots");
    } else {
      setChatbots(data || []);
    }
    setLoading(false);
  };

  const createChatbot = async () => {
    if (!botName) {
      toast.error("Digite um nome para o chatbot");
      return;
    }

    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("chatbots").insert({
      user_id: user.id,
      name: botName,
      whatsapp_number: whatsappNumber || null,
      is_active: true,
    });

    if (error) {
      toast.error("Erro ao criar chatbot");
    } else {
      toast.success("Chatbot criado com sucesso!");
      setBotName("");
      setWhatsappNumber("");
      setShowCreateForm(false);
      fetchChatbots();
    }
    setCreating(false);
  };

  const deleteChatbot = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este chatbot?")) return;

    const { error } = await supabase.from("chatbots").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir chatbot");
    } else {
      toast.success("Chatbot excluído com sucesso");
      fetchChatbots();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Chatbots Inteligentes</h1>
            <p className="text-muted-foreground">
              Crie chatbots para automatizar atendimento no site e WhatsApp
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Novo Chatbot
          </Button>
        </div>

        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Chatbot</CardTitle>
              <CardDescription>
                Configure seu chatbot com fluxos personalizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot-name">Nome do Chatbot</Label>
                <Input
                  id="bot-name"
                  placeholder="Ex: Atendimento Principal"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Número WhatsApp (opcional)</Label>
                <Input
                  id="whatsapp"
                  placeholder="Ex: +5511999999999"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
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
                  onClick={createChatbot}
                  disabled={creating}
                >
                  {creating ? "Criando..." : "Criar Chatbot"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : chatbots.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bot className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum chatbot criado ainda</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Crie seu primeiro chatbot e automatize o atendimento
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                Criar Primeiro Chatbot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((bot) => (
              <Card key={bot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    {bot.is_active && (
                      <Badge variant="default">Ativo</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{bot.name}</CardTitle>
                  <CardDescription>
                    {bot.whatsapp_number ? (
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>{bot.whatsapp_number}</span>
                      </div>
                    ) : (
                      "Sem WhatsApp configurado"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Fluxos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => deleteChatbot(bot.id)}
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

export default Chatbots;
