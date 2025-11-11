import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { toast } from "sonner";

interface CustomerData {
  id: string;
  email: string;
  full_name: string;
  subscriptions: Array<{
    plan: {
      name: string;
      price: number;
    };
    status: string;
    started_at: string;
  }>;
}

const Admin = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    // Fetch all profiles with their subscriptions
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select(`
        id,
        email,
        full_name
      `);

    if (profilesError) {
      toast.error("Erro ao carregar dados");
      return;
    }

    // Fetch all subscriptions with plans
    const { data: subsData, error: subsError } = await supabase
      .from("subscriptions")
      .select(`
        user_id,
        status,
        started_at,
        plan:plans(name, price)
      `)
      .eq("status", "active");

    if (subsError) {
      toast.error("Erro ao carregar assinaturas");
      return;
    }

    // Combine data
    const customersWithSubs = profilesData.map((profile) => ({
      ...profile,
      subscriptions: subsData?.filter((sub) => sub.user_id === profile.id) || [],
    }));

    // Calculate metrics
    const revenue = subsData?.reduce((acc, sub) => {
      const price = (sub.plan as any)?.price || 0;
      return acc + Number(price);
    }, 0) || 0;

    setCustomers(customersWithSubs);
    setTotalRevenue(revenue);
    setActiveSubscriptions(subsData?.length || 0);
    setLoading(false);
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
          <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral de clientes e receitas
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">Planos ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total do mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes e Assinaturas</CardTitle>
            <CardDescription>
              Lista completa de clientes com seus planos ativos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Planos Ativos</TableHead>
                  <TableHead className="text-right">Valor Mensal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => {
                  const monthlyTotal = customer.subscriptions.reduce(
                    (acc, sub) => acc + Number((sub.plan as any)?.price || 0),
                    0
                  );

                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.full_name || "Sem nome"}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {customer.subscriptions.length > 0 ? (
                            customer.subscriptions.map((sub, idx) => (
                              <Badge key={idx} variant="secondary">
                                {(sub.plan as any)?.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Nenhum plano
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {monthlyTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
