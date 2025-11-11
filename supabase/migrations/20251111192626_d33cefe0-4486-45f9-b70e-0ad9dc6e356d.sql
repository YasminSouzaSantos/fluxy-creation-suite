-- Criar tipo enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de roles de usuários
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Função para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Tabela de planos
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de assinaturas
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de sites criados
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template_id TEXT,
  category TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  url_slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de apps (PWA)
CREATE TABLE public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon_url TEXT,
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de chatbots
CREATE TABLE public.chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  flows JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de automações
CREATE TABLE public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  schedule JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Policies para user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Policies para plans
CREATE POLICY "Anyone can view active plans" ON public.plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.plans FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Policies para subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Policies para sites
CREATE POLICY "Users can view own sites" ON public.sites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create sites" ON public.sites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sites" ON public.sites FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sites" ON public.sites FOR DELETE USING (auth.uid() = user_id);

-- Policies para apps
CREATE POLICY "Users can view own apps" ON public.apps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create apps" ON public.apps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own apps" ON public.apps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own apps" ON public.apps FOR DELETE USING (auth.uid() = user_id);

-- Policies para chatbots
CREATE POLICY "Users can view own chatbots" ON public.chatbots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create chatbots" ON public.chatbots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chatbots" ON public.chatbots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own chatbots" ON public.chatbots FOR DELETE USING (auth.uid() = user_id);

-- Policies para automations
CREATE POLICY "Users can view own automations" ON public.automations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create automations" ON public.automations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own automations" ON public.automations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own automations" ON public.automations FOR DELETE USING (auth.uid() = user_id);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Adicionar role de usuário comum
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON public.apps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chatbots_updated_at BEFORE UPDATE ON public.chatbots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON public.automations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir planos iniciais
INSERT INTO public.plans (name, description, price, features) VALUES
  ('Gerador de Sites', 'Crie sites profissionais com templates prontos', 39.90, '["Templates ilimitados", "Editor visual", "Domínio personalizado"]'::jsonb),
  ('Gerador de Apps', 'Transforme seu site em um app instalável (PWA)', 59.90, '["PWA instalável", "QR Code", "Ícone personalizado", "Funciona offline"]'::jsonb),
  ('Chatbots Inteligentes', 'Crie chatbots para seu site e WhatsApp', 29.90, '["Editor visual de fluxos", "Integração WhatsApp", "Respostas automáticas"]'::jsonb),
  ('Automação de Marketing', 'Automatize suas campanhas e posts', 49.90, '["Geração de conteúdo com IA", "Agendamento de posts", "Integração com redes sociais"]'::jsonb),
  ('Plano Completo', 'Todos os recursos da plataforma', 149.90, '["Todos os recursos", "Suporte prioritário", "Sem limites"]'::jsonb);