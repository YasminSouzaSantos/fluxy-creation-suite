import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ElementCanvas, { ElementItem } from "@/components/templates/ElementCanvas";

interface SiteData {
  name: string;
  content: any;
}

const PublicSite = () => {
  const { slug } = useParams();
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSite = async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("name, content")
        .eq("url_slug", slug)
        .maybeSingle();

      if (!error && data) setSite(data as SiteData);
      setLoading(false);
    };
    fetchSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Site não encontrado.</p>
      </div>
    );
  }

  const elements: ElementItem[] | undefined = site.content?.elements;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {elements ? (
          <ElementCanvas elements={elements} />
        ) : (
          <div className="text-center text-muted-foreground py-20">
            Conteúdo indisponível.
          </div>
        )}
      </div>
    </main>
  );
};

export default PublicSite;
