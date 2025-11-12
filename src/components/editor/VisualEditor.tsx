import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, Undo, Redo, Type, Image as ImageIcon, Square, Palette } from "lucide-react";
import { toast } from "sonner";

interface Element {
  id: string;
  type: "text" | "image" | "button" | "section";
  content: string;
  styles: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
  };
  position: {
    x: number;
    y: number;
  };
}

interface VisualEditorProps {
  templateContent: any;
  onSave: (content: any) => void;
  onPreview: () => void;
}

const VisualEditor = ({ templateContent, onSave, onPreview }: VisualEditorProps) => {
  const [elements, setElements] = useState<Element[]>(templateContent?.elements || []);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<Element[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = (newElements: Element[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    const newElements = elements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  const handleSave = () => {
    onSave({ elements });
    toast.success("Site salvo com sucesso!");
  };

  const selectedEl = elements.find((el) => el.id === selectedElement);

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex === 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRedo} disabled={historyIndex === history.length - 1}>
            <Redo className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Tools */}
        <div className="w-64 border-r bg-card p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Elementos</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const newEl: Element = {
                  id: `text-${Date.now()}`,
                  type: "text",
                  content: "Texto aqui",
                  styles: { fontSize: "16px", color: "hsl(var(--foreground))" },
                  position: { x: 50, y: 50 },
                };
                const newElements = [...elements, newEl];
                setElements(newElements);
                addToHistory(newElements);
              }}
            >
              <Type className="w-4 h-4 mr-2" />
              Adicionar Texto
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ImageIcon className="w-4 h-4 mr-2" />
              Adicionar Imagem
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Square className="w-4 h-4 mr-2" />
              Adicionar Seção
            </Button>
          </div>

          {selectedEl && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">Propriedades</h3>
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="style">Estilo</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4">
                  {selectedEl.type === "text" && (
                    <div className="space-y-2">
                      <Label>Texto</Label>
                      <Textarea
                        value={selectedEl.content}
                        onChange={(e) =>
                          updateElement(selectedEl.id, { content: e.target.value })
                        }
                      />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="style" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cor do Texto</Label>
                    <Input
                      type="color"
                      value={selectedEl.styles.color || "#000000"}
                      onChange={(e) =>
                        updateElement(selectedEl.id, {
                          styles: { ...selectedEl.styles, color: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor de Fundo</Label>
                    <Input
                      type="color"
                      value={selectedEl.styles.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        updateElement(selectedEl.id, {
                          styles: { ...selectedEl.styles, backgroundColor: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tamanho da Fonte</Label>
                    <Input
                      type="number"
                      value={parseInt(selectedEl.styles.fontSize || "16")}
                      onChange={(e) =>
                        updateElement(selectedEl.id, {
                          styles: { ...selectedEl.styles, fontSize: `${e.target.value}px` },
                        })
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Canvas - Editor Area */}
        <div className="flex-1 bg-muted/30 overflow-auto p-8">
          <div className="max-w-6xl mx-auto bg-background rounded-lg shadow-lg min-h-[800px] relative">
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move transition-all ${
                  selectedElement === element.id ? "ring-2 ring-primary" : ""
                }`}
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  ...element.styles,
                }}
                onClick={() => setSelectedElement(element.id)}
              >
                {element.type === "text" && (
                  <div contentEditable suppressContentEditableWarning>
                    {element.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;
