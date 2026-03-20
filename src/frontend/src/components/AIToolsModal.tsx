import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AIToolsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteContent: string;
  noteTitle: string;
  onApplyToNote: (content: string) => void;
}

function generateSummary(content: string): string {
  if (!content.trim()) return "";

  const keywords = [
    "important",
    "key",
    "note",
    "remember",
    "define",
    "means",
    "therefore",
    "because",
    "result",
    "conclusion",
    "summary",
    "main",
    "primary",
  ];

  const paragraphs = content.split(/\n\n+/);
  const bullets: string[] = [];

  // First sentence from each paragraph
  for (const para of paragraphs) {
    const firstSentence = para.split(/[.!?]/)[0]?.trim();
    if (firstSentence && firstSentence.length > 15) {
      bullets.push(firstSentence);
    }
  }

  // Lines with keywords
  const lines = content.split("\n");
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (keywords.some((k) => lower.includes(k)) && line.trim().length > 15) {
      const clean = line.replace(/^[•\-\*\d+\.\s]+/, "").trim();
      if (clean && !bullets.includes(clean)) {
        bullets.push(clean);
      }
    }
  }

  // Deduplicate and limit
  const unique = [...new Set(bullets)].slice(0, 10);
  return unique.map((b) => `• ${b}`).join("\n");
}

function generateMindMap(content: string, title: string): string {
  const lines = content.split("\n").filter((l) => l.trim());
  const mainTopic = title || lines[0] || "Main Topic";

  // Find subtopics: uppercase start, bullet points, or numbered items
  const subtopics: { topic: string; details: string[] }[] = [];
  let currentTopic: { topic: string; details: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isBullet = /^[•\-\*]/.test(trimmed);
    const isNumbered = /^\d+[.)\s]/.test(trimmed);
    const isHeading =
      /^[A-Z][A-Z\s]{4,}/.test(trimmed) || /^#{1,3}\s/.test(trimmed);

    if (isHeading || (trimmed.length < 60 && isBullet)) {
      const cleanTopic = trimmed
        .replace(/^[•\-\*#]+\s*/, "")
        .replace(/^\d+[.)\s]+/, "")
        .trim();
      if (cleanTopic.length > 3) {
        currentTopic = { topic: cleanTopic, details: [] };
        subtopics.push(currentTopic);
      }
    } else if (isNumbered && currentTopic) {
      const detail = trimmed.replace(/^\d+[.)\s]+/, "").trim();
      if (detail.length > 3) currentTopic.details.push(detail);
    } else if (isBullet && currentTopic && subtopics.length > 0) {
      const detail = trimmed.replace(/^[•\-\*]+\s*/, "").trim();
      if (detail.length > 3) currentTopic.details.push(detail);
    }
  }

  // Limit to 6 subtopics
  const tops = subtopics.slice(0, 6);

  let map = `=== MIND MAP ===\n📌 ${mainTopic}\n`;
  for (let i = 0; i < tops.length; i++) {
    const isLast = i === tops.length - 1;
    const connector = isLast ? "└──" : "├──";
    map += `  ${connector} 📝 ${tops[i].topic}\n`;
    const details = tops[i].details.slice(0, 3);
    for (let j = 0; j < details.length; j++) {
      const dLast = j === details.length - 1;
      const dConn = dLast ? "└──" : "├──";
      const prefix = isLast ? "     " : "  │  ";
      map += `${prefix}   ${dConn} ${details[j]}\n`;
    }
  }
  map += "=== END MIND MAP ===";
  return map;
}

export default function AIToolsModal({
  open,
  onOpenChange,
  noteContent,
  noteTitle,
  onApplyToNote,
}: AIToolsModalProps) {
  const [summaryPreview, setSummaryPreview] = useState("");
  const [mindMapPreview, setMindMapPreview] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);

  const handleGenerateSummary = async () => {
    if (!noteContent.trim()) {
      toast.error("Note is empty. Add some content first.");
      return;
    }
    setIsGeneratingSummary(true);
    // Simulate slight processing delay for UX
    await new Promise((r) => setTimeout(r, 600));
    const summary = generateSummary(noteContent);
    if (!summary) {
      toast.error("Could not extract summary. Try adding more content.");
    } else {
      setSummaryPreview(summary);
    }
    setIsGeneratingSummary(false);
  };

  const handleGenerateMindMap = async () => {
    if (!noteContent.trim()) {
      toast.error("Note is empty. Add some content first.");
      return;
    }
    setIsGeneratingMindMap(true);
    await new Promise((r) => setTimeout(r, 700));
    const mindMap = generateMindMap(noteContent, noteTitle);
    setMindMapPreview(mindMap);
    setIsGeneratingMindMap(false);
  };

  const handleApplySummary = () => {
    onApplyToNote(summaryPreview);
    setSummaryPreview("");
    onOpenChange(false);
    toast.success("Summary applied to note!");
  };

  const handleInsertMindMap = () => {
    onApplyToNote(`${noteContent}\n\n${mindMapPreview}`);
    setMindMapPreview("");
    onOpenChange(false);
    toast.success("Mind map inserted into note!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-ocid="ai_tools.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Tools
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="summary">
          <TabsList className="w-full" data-ocid="ai_tools.tab">
            <TabsTrigger
              value="summary"
              className="flex-1"
              data-ocid="ai_tools.summary_tab"
            >
              📋 AI Summary
            </TabsTrigger>
            <TabsTrigger
              value="mindmap"
              className="flex-1"
              data-ocid="ai_tools.mindmap_tab"
            >
              🧠 Mind Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Extracts key points from your note and formats them as concise
              bullet points.
            </p>
            <Button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="w-full"
              data-ocid="ai_tools.generate_summary_button"
            >
              {isGeneratingSummary ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>

            {summaryPreview && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Preview
                </div>
                <ScrollArea className="h-48 rounded-lg border bg-muted/30 p-3">
                  <pre className="text-sm font-patrick whitespace-pre-wrap leading-7">
                    {summaryPreview}
                  </pre>
                </ScrollArea>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleApplySummary}
                    className="flex-1"
                    data-ocid="ai_tools.apply_summary_button"
                  >
                    Apply to Note
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSummaryPreview("")}
                    data-ocid="ai_tools.clear_summary_button"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mindmap" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Builds a structured mind map from your note's topics and
              subtopics.
            </p>
            <Button
              onClick={handleGenerateMindMap}
              disabled={isGeneratingMindMap}
              className="w-full"
              data-ocid="ai_tools.generate_mindmap_button"
            >
              {isGeneratingMindMap ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Building Mind Map...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Mind Map
                </>
              )}
            </Button>

            {mindMapPreview && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Preview
                </div>
                <ScrollArea className="h-48 rounded-lg border bg-muted/30 p-3">
                  <pre className="text-sm font-mono whitespace-pre leading-6">
                    {mindMapPreview}
                  </pre>
                </ScrollArea>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleInsertMindMap}
                    className="flex-1"
                    data-ocid="ai_tools.insert_mindmap_button"
                  >
                    Insert into Note
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMindMapPreview("")}
                    data-ocid="ai_tools.clear_mindmap_button"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
