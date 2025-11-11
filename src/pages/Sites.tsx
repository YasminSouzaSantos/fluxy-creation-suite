import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Globe, ExternalLink, Edit, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Site {
  id: string;
  name: string;
  description: string;
  category: string;
  is_published: boolean;
  url_slug: string;
  created_at: string;
}

const Sites = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("sites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar sites");
      console.error(error);
    } else {
      setSites(data || []);
    }
    setLoading(false);
  };

  const deleteSite = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este site?")) return;

    const { error } = await supabase.from("sites").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir site");
    } else {
      toast.success("Site excluído com sucesso");
      fetchSites();
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Meus Sites</h1>
            <p className="text-muted-foreground">
              Gerencie todos os seus sites criados
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/site-builder")} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Criar Novo Site
          </Button>
        </div>

        {sites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Globe className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum site criado ainda</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Comece criando seu primeiro site profissional em minutos com nossos templates
              </p>
              <Button onClick={() => navigate("/dashboard/site-builder")}>
                Criar Primeiro Site
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <Card key={site.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    {site.is_published && (
                      <Badge variant="default">Publicado</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{site.name}</CardTitle>
                  <CardDescription>
                    {site.description || "Sem descrição"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Categoria:</span>
                    <Badge variant="outline">{site.category || "Geral"}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSite(site.id)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Sites;
