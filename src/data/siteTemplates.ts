export interface SiteTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  content: {
    hero: {
      title: string;
      subtitle: string;
      buttonText: string;
      backgroundImage?: string;
    };
    about?: {
      title: string;
      description: string;
    };
    services?: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    contact?: {
      phone: string;
      email: string;
      address: string;
    };
    colors: {
      primary: string;
      secondary: string;
      text: string;
      background: string;
    };
  };
}

export const siteTemplates: SiteTemplate[] = [
  {
    id: "loja-moderna",
    name: "Loja Moderna",
    category: "loja virtual",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    content: {
      hero: {
        title: "Sua Loja Online",
        subtitle: "Produtos de qualidade com entrega rápida",
        buttonText: "Ver Produtos",
      },
      about: {
        title: "Sobre Nós",
        description: "Somos uma loja comprometida com a qualidade e satisfação dos nossos clientes.",
      },
      services: [
        { title: "Entrega Rápida", description: "Entrega em 24h", icon: "🚚" },
        { title: "Qualidade", description: "Produtos selecionados", icon: "⭐" },
        { title: "Suporte", description: "Atendimento 24/7", icon: "💬" },
      ],
      contact: {
        phone: "(11) 99999-9999",
        email: "contato@loja.com",
        address: "Rua Example, 123",
      },
      colors: {
        primary: "#3B82F6",
        secondary: "#8B5CF6",
        text: "#1F2937",
        background: "#FFFFFF",
      },
    },
  },
  {
    id: "cardapio-digital",
    name: "Cardápio Elegante",
    category: "cardápio digital",
    thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    content: {
      hero: {
        title: "Restaurante Gourmet",
        subtitle: "Sabores únicos para momentos especiais",
        buttonText: "Ver Cardápio",
      },
      services: [
        { title: "Entrada", description: "Pratos leves e saborosos", icon: "🥗" },
        { title: "Prato Principal", description: "Carnes e massas premium", icon: "🍝" },
        { title: "Sobremesas", description: "Doces artesanais", icon: "🍰" },
      ],
      contact: {
        phone: "(11) 98888-8888",
        email: "contato@restaurante.com",
        address: "Av. Gourmet, 456",
      },
      colors: {
        primary: "#DC2626",
        secondary: "#F59E0B",
        text: "#1F2937",
        background: "#FFF7ED",
      },
    },
  },
  {
    id: "portfolio-criativo",
    name: "Portfólio Criativo",
    category: "portfólio",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
    content: {
      hero: {
        title: "Designer Criativo",
        subtitle: "Transformando ideias em realidade visual",
        buttonText: "Ver Portfólio",
      },
      about: {
        title: "Sobre Mim",
        description: "Designer com 10 anos de experiência em branding e identidade visual.",
      },
      services: [
        { title: "Branding", description: "Criação de identidade visual", icon: "🎨" },
        { title: "Web Design", description: "Sites modernos e responsivos", icon: "💻" },
        { title: "Ilustração", description: "Ilustrações personalizadas", icon: "✏️" },
      ],
      contact: {
        phone: "(11) 97777-7777",
        email: "contato@designer.com",
        address: "Estúdio Criativo",
      },
      colors: {
        primary: "#8B5CF6",
        secondary: "#EC4899",
        text: "#1F2937",
        background: "#F9FAFB",
      },
    },
  },
  {
    id: "salao-beleza",
    name: "Salão Premium",
    category: "salão de beleza",
    thumbnail: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
    content: {
      hero: {
        title: "Salão de Beleza Premium",
        subtitle: "Beleza e bem-estar em primeiro lugar",
        buttonText: "Agendar Horário",
      },
      services: [
        { title: "Corte", description: "Cortes modernos e clássicos", icon: "✂️" },
        { title: "Coloração", description: "Coloração profissional", icon: "🎨" },
        { title: "Tratamentos", description: "Hidratação e reconstrução", icon: "💆" },
      ],
      contact: {
        phone: "(11) 96666-6666",
        email: "contato@salao.com",
        address: "Rua da Beleza, 789",
      },
      colors: {
        primary: "#EC4899",
        secondary: "#F59E0B",
        text: "#1F2937",
        background: "#FFF1F2",
      },
    },
  },
  {
    id: "academia-fitness",
    name: "Fitness Pro",
    category: "academia",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    content: {
      hero: {
        title: "Academia Fitness Pro",
        subtitle: "Seu corpo merece o melhor",
        buttonText: "Faça uma Aula Experimental",
      },
      services: [
        { title: "Musculação", description: "Equipamentos de última geração", icon: "💪" },
        { title: "Funcional", description: "Treinos funcionais em grupo", icon: "🏃" },
        { title: "Personal", description: "Treino personalizado", icon: "🎯" },
      ],
      contact: {
        phone: "(11) 95555-5555",
        email: "contato@academia.com",
        address: "Av. Fitness, 321",
      },
      colors: {
        primary: "#EF4444",
        secondary: "#F59E0B",
        text: "#1F2937",
        background: "#FEF2F2",
      },
    },
  },
  {
    id: "petshop-care",
    name: "Pet Care",
    category: "pet shop",
    thumbnail: "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
    content: {
      hero: {
        title: "Pet Shop Care",
        subtitle: "Amor e cuidado para seu pet",
        buttonText: "Ver Serviços",
      },
      services: [
        { title: "Banho e Tosa", description: "Higiene completa", icon: "🐕" },
        { title: "Veterinário", description: "Consultas e vacinas", icon: "🏥" },
        { title: "Pet Shop", description: "Produtos de qualidade", icon: "🦴" },
      ],
      contact: {
        phone: "(11) 94444-4444",
        email: "contato@petshop.com",
        address: "Rua Pet Friendly, 654",
      },
      colors: {
        primary: "#10B981",
        secondary: "#F59E0B",
        text: "#1F2937",
        background: "#F0FDF4",
      },
    },
  },
];
