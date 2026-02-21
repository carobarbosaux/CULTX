import { TextSelectionTrigger } from "@/components/article/TextSelectionTrigger";

interface ArticleBodyProps {
  body: string;
  onExplore?: (text: string) => void;
  onSendToChat?: (text: string) => void;
}

export function ArticleBody({ body, onExplore, onSendToChat }: ArticleBodyProps) {
  const paragraphs = body.split("\n\n").filter(Boolean);

  const content = (
    <div className="mx-auto w-full" style={{ maxWidth: "720px" }}>
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-lg leading-[1.85]"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );

  if (onExplore) {
    return (
      <TextSelectionTrigger
        onExplore={onExplore}
        onSendToChat={onSendToChat ?? (() => {})}
      >
        {content}
      </TextSelectionTrigger>
    );
  }

  return content;
}
