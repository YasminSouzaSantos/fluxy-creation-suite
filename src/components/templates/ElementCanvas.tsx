import React from "react";

export type ElementItem = {
  id: string;
  type: "text" | "image" | "button" | "section";
  content: string; // for image: src; for button/text: label/text
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
  link?: string; // for button links
};

interface ElementCanvasProps {
  elements: ElementItem[];
}

const ElementCanvas: React.FC<ElementCanvasProps> = ({ elements }) => {
  return (
    <div className="relative w-full min-h-[800px] bg-background">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute"
          style={{ left: el.position.x, top: el.position.y }}
        >
          {el.type === "text" && (
            <div style={el.styles as React.CSSProperties}>{el.content}</div>
          )}
          {el.type === "button" && (
            <a
              href={el.link || "#"}
              target={el.link ? "_blank" : undefined}
              rel={el.link ? "noopener noreferrer" : undefined}
              className="inline-block transition-transform hover:scale-105"
              style={el.styles as React.CSSProperties}
            >
              {el.content}
            </a>
          )}
          {el.type === "image" && (
            <img
              src={el.content}
              alt=""
              style={el.styles as React.CSSProperties}
              className="block"
            />
          )}
          {el.type === "section" && (
            <div style={el.styles as React.CSSProperties} className="rounded-lg" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ElementCanvas;
