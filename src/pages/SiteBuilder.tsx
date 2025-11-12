import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Globe, Search, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { siteTemplates } from "@/data/siteTemplates";
import SitePreview from "@/components/templates/SitePreview";
import VisualEditor from "@/components/editor/VisualEditor";

const SiteBuilder = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  const categories = ["todos", ...new Set(siteTemplates.map((t) => t.category))];

  const filteredTemplates = siteTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "todos" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateSite = async (content: any) => {
    if (!selectedTemplate) return;

    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const template = siteTemplates.find((t) => t.id === selectedTemplate);
    const slugBase = (template?.name || "site")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const rand = Math.random().toString(36).slice(2, 6);
    const url_slug = `${slugBase}-${rand}`;

    const { error } = await supabase.from("sites").insert({
      user_id: user.id,
      name: template?.name || "Novo Site",
      description: template?.category || "",
      template_id: selectedTemplate,
      category: template?.category || "",
      url_slug,
      is_published: true,
      content: content,
    });

    if (error) {
      toast.error("Erro ao criar site");
      console.error(error);
    } else {
      const publicUrl = `${window.location.origin}/s/${url_slug}`;
      toast.success(`Site publicado! ${publicUrl}`);
      navigate("/dashboard/sites");
      window.open(publicUrl, "_blank");
    }
    setCreating(false);
  };

  const currentTemplate = siteTemplates.find((t) => t.id === selectedTemplate);
  const previewTemplateData = siteTemplates.find((t) => t.id === previewTemplate);

  if (isEditing && currentTemplate) {
    return (
      <VisualEditor
        templateContent={editedContent || currentTemplate.content}
        onSave={handleCreateSite}
        onPreview={() => setIsEditing(false)}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gerador de Sites</h1>
          <p className="text-muted-foreground">
            Escolha um template profissional e personalize visualmente
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="group hover:shadow-xl transition-all overflow-hidden"
                >
                  <CardHeader className="p-0">
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <CardTitle className="text-white text-xl mb-1">
                          {template.name}
                        </CardTitle>
                        <CardDescription className="text-white/80 capitalize">
                          {template.category}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Template
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(template.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
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
        ) : null}

        {/* Preview Dialog */}
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-6xl h-[90vh] p-0">
            {previewTemplateData && (
              <SitePreview template={previewTemplateData} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SiteBuilder;
