import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Globe, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SiteBuilder = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const categories = [
    "todos", "loja virtual", "cardápio digital", "portfólio", "salão de beleza",
    "academia", "pet shop", "restaurante", "oficina", "eventos", "fotógrafo",
    "clínica", "escola", "advocacia", "consultoria", "imobiliária"
  ];

  const templates = [
    { id: "1", name: "Loja Moderna", category: "loja virtual", preview: "🛍️" },
    { id: "2", name: "Cardápio Elegante", category: "cardápio digital", preview: "🍽️" },
    { id: "3", name: "Portfólio Criativo", category: "portfólio", preview: "🎨" },
    { id: "4", name: "Salão Premium", category: "salão de beleza", preview: "💇" },
    { id: "5", name: "Fitness Pro", category: "academia", preview: "💪" },
    { id: "6", name: "Pet Care", category: "pet shop", preview: "🐾" },
    { id: "7", name: "Restaurante Gourmet", category: "restaurante", preview: "🍴" },
    { id: "8", name: "Auto Center", category: "oficina", preview: "🔧" },
    { id: "9", name: "Eventos Especiais", category: "eventos", preview: "🎉" },
    { id: "10", name: "Foto Studio", category: "fotógrafo", preview: "📸" },
    { id: "11", name: "Clínica Saúde", category: "clínica", preview: "🏥" },
    { id: "12", name: "Escola Digital", category: "escola", preview: "📚" },
    { id: "13", name: "Advocacia Pro", category: "advocacia", preview: "⚖️" },
    { id: "14", name: "Consultoria Expert", category: "consultoria", preview: "💼" },
    { id: "15", name: "Imóveis Prime", category: "imobiliária", preview: "🏠" },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateSite = async () => {
    if (!selectedTemplate || !siteName) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const template = templates.find((t) => t.id === selectedTemplate);
    const { error } = await supabase.from("sites").insert({
      user_id: user.id,
      name: siteName,
      description: siteDescription,
      template_id: selectedTemplate,
      category: template?.category || "",
      url_slug: siteName.toLowerCase().replace(/\s+/g, "-"),
    });

    if (error) {
      toast.error("Erro ao criar site");
      console.error(error);
    } else {
      toast.success("Site criado com sucesso!");
      navigate("/dashboard/sites");
    }
    setCreating(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gerador de Sites</h1>
          <p className="text-muted-foreground">
            Escolha um template e personalize seu site em minutos
          </p>
        </div>

        {!selectedTemplate ? (
          <>
            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates por nome ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors capitalize"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader>
                    <div className="w-full h-32 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <span className="text-6xl">{template.preview}</span>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {template.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Globe className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum template encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente buscar por outro termo ou categoria
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Configure seu Site</CardTitle>
                  <CardDescription>
                    Personalize as informações do seu novo site
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nome do Site *</Label>
                <Input
                  id="site-name"
                  placeholder="Ex: Minha Loja Online"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Descrição</Label>
                <Textarea
                  id="site-description"
                  placeholder="Descreva seu site..."
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreateSite}
                  disabled={creating}
                >
                  {creating ? "Criando..." : "Criar Site"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SiteBuilder;
