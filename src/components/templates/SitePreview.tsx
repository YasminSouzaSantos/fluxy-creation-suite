import { SiteTemplate } from "@/data/siteTemplates";
import ElementCanvas from "@/components/templates/ElementCanvas";

interface SitePreviewProps {
  template: SiteTemplate;
  content?: any;
}

const SitePreview = ({ template, content }: SitePreviewProps) => {
  const data = content || template.content;

  return (
    <div className="w-full h-full overflow-y-auto bg-background">
      {data.elements ? (
        <ElementCanvas elements={data.elements} />
      ) : (
        <>
          {/* Hero Section */}
          <section
            className="min-h-[500px] flex items-center justify-center text-center px-6"
            style={{
              background: `linear-gradient(135deg, ${data.colors.primary}20, ${data.colors.secondary}20)`,
            }}
          >
            <div className="max-w-4xl">
              <h1
                className="text-5xl md:text-7xl font-bold mb-6"
                style={{ color: data.colors.text }}
              >
                {data.hero.title}
              </h1>
              <p
                className="text-xl md:text-2xl mb-8 opacity-80"
                style={{ color: data.colors.text }}
              >
                {data.hero.subtitle}
              </p>
              <button
                className="px-8 py-4 rounded-lg text-white font-semibold text-lg transition-transform hover:scale-105"
                style={{ backgroundColor: data.colors.primary }}
              >
                {data.hero.buttonText}
              </button>
            </div>
          </section>

          {/* About Section */}
          {data.about && (
            <section className="py-20 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2
                  className="text-4xl font-bold mb-6"
                  style={{ color: data.colors.primary }}
                >
                  {data.about.title}
                </h2>
                <p className="text-lg" style={{ color: data.colors.text }}>
                  {data.about.description}
                </p>
              </div>
            </section>
          )}

          {/* Services Section */}
          {data.services && (
            <section
              className="py-20 px-6"
              style={{ backgroundColor: `${data.colors.primary}10` }}
            >
              <div className="max-w-6xl mx-auto">
                <h2
                  className="text-4xl font-bold mb-12 text-center"
                  style={{ color: data.colors.primary }}
                >
                  Nossos Serviços
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {data.services.map((service: any, index: number) => (
                    <div
                      key={index}
                      className="p-8 rounded-xl text-center transition-transform hover:scale-105"
                      style={{ backgroundColor: data.colors.background }}
                    >
                      <div className="text-5xl mb-4">{service.icon}</div>
                      <h3
                        className="text-2xl font-semibold mb-3"
                        style={{ color: data.colors.text }}
                      >
                        {service.title}
                      </h3>
                      <p style={{ color: data.colors.text, opacity: 0.7 }}>
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          {data.contact && (
            <section className="py-20 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2
                  className="text-4xl font-bold mb-12"
                  style={{ color: data.colors.primary }}
                >
                  Entre em Contato
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-3xl mb-3">📱</div>
                    <p className="font-semibold mb-2" style={{ color: data.colors.text }}>
                      Telefone
                    </p>
                    <p style={{ color: data.colors.text, opacity: 0.7 }}>
                      {data.contact.phone}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-3">📧</div>
                    <p className="font-semibold mb-2" style={{ color: data.colors.text }}>
                      Email
                    </p>
                    <p style={{ color: data.colors.text, opacity: 0.7 }}>
                      {data.contact.email}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-3">📍</div>
                    <p className="font-semibold mb-2" style={{ color: data.colors.text }}>
                      Endereço
                    </p>
                    <p style={{ color: data.colors.text, opacity: 0.7 }}>
                      {data.contact.address}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer
            className="py-8 px-6 text-center"
            style={{ backgroundColor: data.colors.primary, color: "white" }}
          >
            <p>© 2024 {data.hero.title}. Todos os direitos reservados.</p>
            <p className="text-sm mt-2 opacity-80">Criado com Fluxy Platform</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default SitePreview;
