import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { getCurrentUser, signOut, isAdmin } from "@/lib/supabase";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Globe,
  Smartphone,
  Bot,
  Mail,
  CreditCard,
  LogOut,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await getCurrentUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { isAdmin: adminStatus } = await isAdmin(user.id);
      setUserIsAdmin(adminStatus);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      toast.success("Logout realizado com sucesso");
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Globe, label: "Meus Sites", path: "/dashboard/sites" },
    { icon: Globe, label: "Gerador de Sites", path: "/dashboard/site-builder" },
    { icon: Smartphone, label: "Gerador de Apps", path: "/dashboard/app-builder" },
    { icon: Bot, label: "Chatbots Inteligentes", path: "/dashboard/chatbots" },
    { icon: Mail, label: "Automação de Marketing", path: "/dashboard/automation" },
    { icon: CreditCard, label: "Faturamento", path: "/dashboard/billing" },
  ];

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Fluxy</h1>
              <p className="text-xs text-muted-foreground">Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}

          {userIsAdmin && (
            <NavLink
              to="/dashboard/admin"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Painel Admin</span>
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/dashboard/settings")}
          >
            <Settings className="w-5 h-5 mr-3" />
            <span className="text-sm">Configurações</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
