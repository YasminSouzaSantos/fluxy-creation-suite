import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Smartphone, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Site {
  id: string;
  name: string;
  description: string;
}

const AppBuilder = () => {
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
      .select("id, name, description")
      .eq("user_id", user.id);

    if (error) {
      toast.error("Erro ao carregar sites");
    } else {
      setSites(data || []);
    }
    setLoading(false);
  };

  const generateApp = async (siteId: string, siteName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("apps").insert({
      user_id: user.id,
      site_id: siteId,
      name: `${siteName} App`,
      is_active: true,
    });

    if (error) {
      toast.error("Erro ao gerar app");
    } else {
      toast.success("App PWA gerado com sucesso!");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gerador de Apps (PWA)</h1>
          <p className="text-muted-foreground">
            Transforme seus sites em apps instaláveis automaticamente
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Smartphone className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum site disponível</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Você precisa criar um site primeiro para poder gerar um app
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <Card key={site.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{site.name}</CardTitle>
                  <CardDescription>
                    {site.description || "Sem descrição"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => generateApp(site.id, site.name)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Gerar App PWA
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>O que é um PWA?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              ✅ Instalável no celular como um app nativo
            </p>
            <p>
              ✅ Funciona offline
            </p>
            <p>
              ✅ Notificações push
            </p>
            <p>
              ✅ QR Code para compartilhamento
            </p>
            <p>
              ✅ Sem necessidade de publicar na App Store ou Google Play
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppBuilder;
