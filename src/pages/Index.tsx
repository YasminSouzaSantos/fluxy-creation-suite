import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Globe, Smartphone, Bot, Mail, ArrowRight, Check } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Globe,
      title: "Gerador de Sites",
      description: "Crie sites profissionais com 100+ templates em minutos",
      price: "R$ 39,90/mês",
    },
    {
      icon: Smartphone,
      title: "Gerador de Apps (PWA)",
      description: "Transforme seu site em um app instalável automaticamente",
      price: "R$ 59,90/mês",
    },
    {
      icon: Bot,
      title: "Chatbots Inteligentes",
      description: "Crie chatbots para site e WhatsApp com editor visual",
      price: "R$ 29,90/mês",
    },
    {
      icon: Mail,
      title: "Automação de Marketing",
      description: "Gere conteúdo com IA e agende postagens automaticamente",
      price: "R$ 49,90/mês",
    },
  ];

  const benefits = [
    "Editor visual drag & drop",
    "100+ templates profissionais",
    "Hospedagem incluída",
    "Domínio personalizado",
    "QR Codes automáticos",
    "Integração WhatsApp",
    "Geração de conteúdo com IA",
    "Suporte prioritário",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Fluxy Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Crie sites, apps, chatbots e automatize seu marketing. Tudo em uma plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg h-14 px-8"
                onClick={() => navigate("/auth")}
              >
                Começar Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg h-14 px-8"
                onClick={() => navigate("/auth")}
              >
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Todas as ferramentas que você precisa
          </h2>
          <p className="text-xl text-muted-foreground">
            Escolha os serviços que fazem sentido para o seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <p className="text-2xl font-bold text-primary">{feature.price}</p>
            </div>
          ))}
        </div>

        {/* Plano Completo */}
        <div className="max-w-2xl mx-auto bg-gradient-primary rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Plano Completo</h3>
          <p className="text-xl mb-6 text-white/90">
            Tenha acesso a todos os recursos por
          </p>
          <p className="text-5xl font-bold mb-6">R$ 149,90/mês</p>
          <p className="text-white/80 mb-8">Economize R$ 29,70 por mês</p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 text-lg h-14 px-8"
            onClick={() => navigate("/auth")}
          >
            Assinar Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Por que escolher a Fluxy?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Pronto para começar?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de empresas que já automatizaram seu marketing e presença online
        </p>
        <Button
          size="lg"
          className="text-lg h-14 px-8"
          onClick={() => navigate("/auth")}
        >
          Criar Conta Grátis
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
