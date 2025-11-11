import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { CreditCard, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: any;
}

const Billing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    fetchPlansAndSubscriptions();
  }, []);

  const fetchPlansAndSubscriptions = async () => {
    const { data: plansData, error: plansError } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true);

    if (plansError) {
      toast.error("Erro ao carregar planos");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: subsData } = await supabase
        .from("subscriptions")
        .select("plan_id")
        .eq("user_id", user.id)
        .eq("status", "active");

      setActiveSubscriptions(subsData?.map((s) => s.plan_id) || []);
    }

    setPlans(plansData || []);
    setLoading(false);
  };

  const subscribeToPlan = async (planId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan_id: planId,
      status: "active",
    });

    if (error) {
      toast.error("Erro ao assinar plano");
    } else {
      toast.success("Plano assinado com sucesso!");
      fetchPlansAndSubscriptions();
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
        <div>
          <h1 className="text-4xl font-bold mb-2">Faturamento</h1>
          <p className="text-muted-foreground">
            Gerencie seus planos e assinaturas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isSubscribed = activeSubscriptions.includes(plan.id);
            const isComplete = plan.name === "Plano Completo";

            return (
              <Card
                key={plan.id}
                className={`hover:shadow-lg transition-all ${
                  isComplete ? "border-primary border-2" : ""
                }`}
              >
                <CardHeader>
                  {isComplete && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-primary text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">
                        R$ {plan.price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground ml-2">/mês</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(plan.features as unknown as string[]).map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={isComplete ? "default" : "outline"}
                    disabled={isSubscribed}
                    onClick={() => subscribeToPlan(plan.id)}
                  >
                    {isSubscribed ? "Plano Ativo" : "Assinar Agora"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>
              Integração com Mercado Pago e Stripe em breve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sistema de pagamentos recorrentes será ativado em breve. Por enquanto, os planos
              podem ser assinados para teste.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
