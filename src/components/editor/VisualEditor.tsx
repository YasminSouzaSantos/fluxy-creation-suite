import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Eye, Undo, Redo, Plus, Image as ImageIcon, Type, Square, Layers, MousePointer, Trash2, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type Element = {
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
    width?: string;
    height?: string;
    fontWeight?: string;
    textAlign?: string;
  };
  position: {
    x: number;
    y: number;
  };
  link?: string;
};

interface VisualEditorProps {
  templateContent: any;
  onSave: (content: any) => void;
  onPreview: () => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ templateContent, onSave, onPreview }) => {
  const [elements, setElements] = useState<Element[]>(templateContent?.elements || []);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<Element[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const updateElements = (newElements: Element[]) => {
    setElements(newElements);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleAddElement = (type: Element["type"]) => {
    const newElement: Element = {
      id: `el-${Date.now()}`,
      type,
      content: type === "text" ? "Novo Texto" : type === "button" ? "Clique Aqui" : type === "image" ? "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" : "",
      styles: {
        color: type === "button" ? "#ffffff" : "#000000",
        backgroundColor: type === "button" ? "#3B82F6" : type === "section" ? "#f3f4f6" : "transparent",
        fontSize: type === "text" ? "16px" : "14px",
        padding: type === "button" ? "12px 24px" : type === "section" ? "40px" : "0px",
        borderRadius: type === "button" ? "8px" : type === "section" ? "12px" : "0px",
        width: type === "image" ? "200px" : type === "section" ? "400px" : "auto",
        height: type === "image" ? "200px" : type === "section" ? "300px" : "auto",
        fontWeight: "400",
        textAlign: "left",
      },
      position: { x: 100, y: 100 + elements.length * 20 },
      link: type === "button" ? "#" : undefined,
    };
    updateElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    toast.success(`Elemento ${type} adicionado`);
  };

  const handleDeleteElement = (id: string) => {
    updateElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
    toast.success("Elemento removido");
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

  const handleSelectElement = (id: string) => {
    setSelectedElement(id);
  };

  const handleUpdateElement = (id: string, field: keyof Element, value: any) => {
    const updated = elements.map((el) =>
      el.id === id ? { ...el, [field]: value } : el
    );
    updateElements(updated);
  };

  const handleUpdateStyle = (id: string, styleKey: string, value: string) => {
    const updated = elements.map((el) =>
      el.id === id ? { ...el, styles: { ...el.styles, [styleKey]: value } } : el
    );
    updateElements(updated);
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;
    
    const offsetX = e.clientX - element.position.x;
    const offsetY = e.clientY - element.position.y;
    setDragging({ id, offsetX, offsetY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;

      const updated = elements.map((el) =>
        el.id === dragging.id
          ? { ...el, position: { x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY } }
          : el
      );
      setElements(updated);
    };

    const handleMouseUp = () => {
      if (dragging) {
        updateElements(elements);
      }
      setDragging(null);
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, elements]);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ elements });
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Left Sidebar - Tools */}
      <div className="w-20 bg-card border-r flex flex-col items-center py-4 gap-4">
        <Button
          variant={selectedElement ? "ghost" : "default"}
          size="icon"
          onClick={() => setSelectedElement(null)}
          className="w-12 h-12"
        >
          <MousePointer className="w-5 h-5" />
        </Button>
        
        <Separator />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAddElement("text")}
          className="w-12 h-12"
          title="Adicionar Texto"
        >
          <Type className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAddElement("image")}
          className="w-12 h-12"
          title="Adicionar Imagem"
        >
          <ImageIcon className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAddElement("button")}
          className="w-12 h-12"
          title="Adicionar Botão"
        >
          <Square className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAddElement("section")}
          className="w-12 h-12"
          title="Adicionar Seção"
        >
          <Layers className="w-5 h-5" />
        </Button>

        <div className="flex-1" />

        <Separator />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPreview()}
          className="w-12 h-12"
        >
          <Home className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-card border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <span className="text-sm text-muted-foreground">
              {elements.length} elemento(s)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPreview()}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Publicando..." : "Publicar Site"}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Card className="min-h-[1000px] relative bg-background shadow-xl overflow-hidden">
              {elements.map((el) => (
                <div
                  key={el.id}
                  className={`absolute cursor-move group ${
                    selectedElement === el.id ? "ring-2 ring-primary z-50" : ""
                  }`}
                  style={{ left: el.position.x, top: el.position.y }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectElement(el.id);
                  }}
                  onMouseDown={(e) => handleMouseDown(e, el.id)}
                >
                  {el.type === "text" && (
                    <div style={el.styles as React.CSSProperties} className="select-none">
                      {el.content}
                    </div>
                  )}
                  {el.type === "button" && (
                    <button
                      style={el.styles as React.CSSProperties}
                      className="transition-all hover:scale-105 select-none"
                    >
                      {el.content}
                    </button>
                  )}
                  {el.type === "image" && (
                    <img
                      src={el.content}
                      alt=""
                      style={el.styles as React.CSSProperties}
                      className="block select-none"
                      draggable={false}
                    />
                  )}
                  {el.type === "section" && (
                    <div style={el.styles as React.CSSProperties} className="rounded-lg select-none" />
                  )}
                  
                  {selectedElement === el.id && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-3 -right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteElement(el.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Properties */}
      <ScrollArea className="w-80 bg-card border-l">
        <div className="p-4 space-y-4">
          {selectedElement && (() => {
            const element = elements.find((el) => el.id === selectedElement);
            if (!element) return null;

            return (
              <>
                <div>
                  <h3 className="font-semibold mb-1">Propriedades</h3>
                  <p className="text-sm text-muted-foreground capitalize">{element.type}</p>
                </div>
                
                <Separator />
                
                {element.type === "text" && (
                  <div>
                    <Label>Conteúdo</Label>
                    <Input
                      value={element.content}
                      onChange={(e) => handleUpdateElement(selectedElement, "content", e.target.value)}
                    />
                  </div>
                )}

                {element.type === "image" && (
                  <div>
                    <Label>URL da Imagem</Label>
                    <Input
                      value={element.content}
                      onChange={(e) => handleUpdateElement(selectedElement, "content", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {element.type === "button" && (
                  <>
                    <div>
                      <Label>Texto</Label>
                      <Input
                        value={element.content}
                        onChange={(e) => handleUpdateElement(selectedElement, "content", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Link</Label>
                      <Input
                        value={element.link || ""}
                        onChange={(e) => handleUpdateElement(selectedElement, "link", e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Estilo</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Largura</Label>
                      <Input
                        value={element.styles.width || "auto"}
                        onChange={(e) => handleUpdateStyle(selectedElement, "width", e.target.value)}
                        placeholder="auto"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Altura</Label>
                      <Input
                        value={element.styles.height || "auto"}
                        onChange={(e) => handleUpdateStyle(selectedElement, "height", e.target.value)}
                        placeholder="auto"
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Tamanho da Fonte</Label>
                    <Input
                      value={element.styles.fontSize || "16px"}
                      onChange={(e) => handleUpdateStyle(selectedElement, "fontSize", e.target.value)}
                      placeholder="16px"
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Peso da Fonte</Label>
                    <select
                      value={element.styles.fontWeight || "400"}
                      onChange={(e) => handleUpdateStyle(selectedElement, "fontWeight", e.target.value)}
                      className="w-full h-8 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="300">Light</option>
                      <option value="400">Normal</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extra Bold</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs">Alinhamento</Label>
                    <select
                      value={element.styles.textAlign || "left"}
                      onChange={(e) => handleUpdateStyle(selectedElement, "textAlign", e.target.value)}
                      className="w-full h-8 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="left">Esquerda</option>
                      <option value="center">Centro</option>
                      <option value="right">Direita</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs">Cor do Texto</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={element.styles.color || "#000000"}
                        onChange={(e) => handleUpdateStyle(selectedElement, "color", e.target.value)}
                        className="h-8 w-16"
                      />
                      <Input
                        value={element.styles.color || "#000000"}
                        onChange={(e) => handleUpdateStyle(selectedElement, "color", e.target.value)}
                        className="h-8 flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Cor de Fundo</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={element.styles.backgroundColor || "#ffffff"}
                        onChange={(e) => handleUpdateStyle(selectedElement, "backgroundColor", e.target.value)}
                        className="h-8 w-16"
                      />
                      <Input
                        value={element.styles.backgroundColor || "#ffffff"}
                        onChange={(e) => handleUpdateStyle(selectedElement, "backgroundColor", e.target.value)}
                        className="h-8 flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Padding</Label>
                    <Input
                      value={element.styles.padding || "0px"}
                      onChange={(e) => handleUpdateStyle(selectedElement, "padding", e.target.value)}
                      placeholder="10px"
                      className="h-8"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Border Radius</Label>
                    <Input
                      value={element.styles.borderRadius || "0px"}
                      onChange={(e) => handleUpdateStyle(selectedElement, "borderRadius", e.target.value)}
                      placeholder="8px"
                      className="h-8"
                    />
                  </div>
                </div>

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDeleteElement(selectedElement)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar Elemento
                </Button>
              </>
            );
          })()}

          {!selectedElement && (
            <div className="text-center py-12 text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Selecione um elemento para editar</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VisualEditor;
