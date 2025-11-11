import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Globe, Smartphone, Bot, Mail, ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    sites: 0,
    apps: 0,
    chatbots: 0,
    automations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [sites, apps, chatbots, automations] = await Promise.all([
        supabase.from("sites").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("apps").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("chatbots").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("automations").select("id", { count: "exact" }).eq("user_id", user.id),
      ]);

      setStats({
        sites: sites.count || 0,
        apps: apps.count || 0,
        chatbots: chatbots.count || 0,
        automations: automations.count || 0,
      });
    };

    fetchStats();
  }, []);

  const services = [
    {
      icon: Globe,
      title: "Gerador de Sites",
      description: "Crie sites profissionais com templates prontos",
      count: stats.sites,
      action: () => navigate("/dashboard/site-builder"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Smartphone,
      title: "Gerador de Apps",
      description: "Transforme seu site em um app instalável",
      count: stats.apps,
      action: () => navigate("/dashboard/app-builder"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Bot,
      title: "Chatbots Inteligentes",
      description: "Crie chatbots para atendimento automático",
      count: stats.chatbots,
      action: () => navigate("/dashboard/chatbots"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Mail,
      title: "Automação de Marketing",
      description: "Automatize suas campanhas e posts",
      count: stats.automations,
      action: () => navigate("/dashboard/automation"),
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo à Fluxy Platform! Gerencie todos os seus projetos em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={service.action}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}
                >
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{service.count}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.count === 1 ? "projeto" : "projetos"}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-primary text-white border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Comece seu primeiro projeto!
            </CardTitle>
            <CardDescription className="text-white/80">
              Escolha uma das ferramentas acima e crie algo incrível em minutos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/dashboard/site-builder")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Novo Projeto
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
