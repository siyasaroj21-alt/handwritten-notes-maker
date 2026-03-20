import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Atom,
  Bold,
  Box,
  Brain,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  FlaskConical,
  GitBranch,
  GraduationCap,
  HeartPulse,
  Highlighter,
  ImagePlus,
  Italic,
  LayoutDashboard,
  LayoutGrid,
  List,
  ListOrdered,
  Loader2,
  LogOut,
  Menu,
  Moon,
  PenLine,
  PenTool,
  Plus,
  Printer,
  Save,
  Search,
  Share2,
  Sparkles,
  Sun,
  TestTube2,
  Trash2,
  Underline,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Note } from "../backend.d";
import {
  useCreateNote,
  useDeleteNote,
  useGetAllNotes,
  useUpdateNote,
} from "../hooks/useQueries";

type Mode = "school" | "college" | "biology" | "notebook" | "exam";
type FontStyle = "caveat" | "patrick" | "kalam" | "dancing";
type PenColor = "blue" | "black" | "pencil" | "chalk" | "yellow-chalk";
type PaperBg = "ruled" | "white" | "margin" | "chalkboard";

const MODES: { id: Mode; label: string; emoji: string; desc: string }[] = [
  {
    id: "school",
    label: "School Notes",
    emoji: "🏫",
    desc: "Blue pen, ruled paper",
  },
  {
    id: "college",
    label: "College Notes",
    emoji: "🎓",
    desc: "Black pen, ruled page",
  },
  {
    id: "biology",
    label: "Biology Notes",
    emoji: "🔬",
    desc: "With diagram placeholders",
  },
  {
    id: "notebook",
    label: "Notebook Mode",
    emoji: "📓",
    desc: "Caveat font, ruled",
  },
  {
    id: "exam",
    label: "Exam Revision",
    emoji: "⭐",
    desc: "Highlights & markers",
  },
];

const FONTS: { id: FontStyle; label: string; class: string }[] = [
  { id: "caveat", label: "Caveat", class: "font-caveat" },
  { id: "patrick", label: "Patrick Hand", class: "font-patrick" },
  { id: "kalam", label: "Kalam", class: "font-kalam" },
  { id: "dancing", label: "Dancing Script", class: "font-dancing" },
];

const PEN_COLORS: { id: PenColor; label: string; color: string }[] = [
  { id: "blue", label: "Blue Pen", color: "#1d4ed8" },
  { id: "black", label: "Black Pen", color: "#1a1a1a" },
  { id: "pencil", label: "Pencil", color: "#6b7280" },
  { id: "chalk", label: "White Chalk", color: "#f0ede8" },
  { id: "yellow-chalk", label: "Yellow Chalk", color: "#f5e642" },
];

const PAPER_BACKGROUNDS: { id: PaperBg; label: string; class: string }[] = [
  { id: "ruled", label: "Ruled", class: "paper-ruled" },
  { id: "white", label: "White", class: "paper-white" },
  { id: "margin", label: "Margin", class: "paper-margin" },
  { id: "chalkboard", label: "🖊 Chalk", class: "paper-chalkboard" },
];

const MODE_DEFAULTS: Record<
  Mode,
  { font: FontStyle; pen: PenColor; paper: PaperBg }
> = {
  school: { font: "patrick", pen: "blue", paper: "ruled" },
  college: { font: "kalam", pen: "black", paper: "ruled" },
  biology: { font: "patrick", pen: "black", paper: "ruled" },
  notebook: { font: "caveat", pen: "blue", paper: "ruled" },
  exam: { font: "kalam", pen: "black", paper: "ruled" },
};

const SHAPES: { name: string; preview: string; ascii: string }[] = [
  {
    name: "Rectangle",
    preview: "▭",
    ascii: "┌─────────────┐\n│             │\n│             │\n└─────────────┘",
  },
  {
    name: "Circle",
    preview: "○",
    ascii: "   ╭───────╮\n  │         │\n  │         │\n   ╰───────╯",
  },
  {
    name: "Triangle",
    preview: "△",
    ascii: "      △\n     /  \\\n    /    \\\n   /______\\",
  },
  { name: "Arrow →", preview: "→", ascii: "────────────►" },
  { name: "Arrow ↓", preview: "↓", ascii: "│\n│\n│\n▼" },
  { name: "Double Arrow", preview: "↔", ascii: "◄────────────►" },
  {
    name: "Star",
    preview: "★",
    ascii: "    ★\n   /|\\\n  / | \\\n /  |  \\\n*---+---*",
  },
  {
    name: "Table (2×3)",
    preview: "⊞",
    ascii:
      "┌──────────┬──────────┬──────────┐\n│  Cell 1  │  Cell 2  │  Cell 3  │\n├──────────┼──────────┼──────────┤\n│  Cell 4  │  Cell 5  │  Cell 6  │\n└──────────┴──────────┴──────────┘",
  },
  {
    name: "Table (3×3)",
    preview: "⊞",
    ascii:
      "┌──────────┬──────────┬──────────┐\n│ Header 1 │ Header 2 │ Header 3 │\n├──────────┼──────────┼──────────┤\n│  Data 1  │  Data 2  │  Data 3  │\n├──────────┼──────────┼──────────┤\n│  Data 4  │  Data 5  │  Data 6  │\n└──────────┴──────────┴──────────┘",
  },
  {
    name: "Hexagon",
    preview: "⬡",
    ascii:
      "    ╱‾‾‾‾╲\n   ╱        ╲\n  |          |\n   ╲        ╱\n    ╲____╱",
  },
  {
    name: "Diamond",
    preview: "◇",
    ascii: "    ◇\n   / \\\n  /   \\\n  \\   /\n   \\ /\n    ◇",
  },
  {
    name: "Speech Bubble",
    preview: "💬",
    ascii:
      "┌─────────────────┐\n│ Speech / thought │\n└───┬─────────────┘\n    │\n    ●",
  },
];

const CATEGORIES = [
  {
    label: "All Notes",
    icon: FileText,
    color: "text-slate-400",
    bg: "bg-slate-800",
    accent: "#94a3b8",
  },
  {
    label: "Biology",
    icon: FlaskConical,
    color: "text-emerald-400",
    bg: "bg-emerald-900/60",
    accent: "#34d399",
  },
  {
    label: "Chemistry",
    icon: TestTube2,
    color: "text-blue-400",
    bg: "bg-blue-900/60",
    accent: "#60a5fa",
  },
  {
    label: "Physics",
    icon: Atom,
    color: "text-purple-400",
    bg: "bg-purple-900/60",
    accent: "#c084fc",
  },
  {
    label: "Notes",
    icon: FileText,
    color: "text-yellow-400",
    bg: "bg-yellow-900/60",
    accent: "#fbbf24",
  },
  {
    label: "CSIR NET",
    icon: GraduationCap,
    color: "text-indigo-400",
    bg: "bg-indigo-900/60",
    accent: "#818cf8",
  },
  {
    label: "NEET",
    icon: HeartPulse,
    color: "text-rose-400",
    bg: "bg-rose-900/60",
    accent: "#fb7185",
  },
  {
    label: "Diagrams",
    icon: PenTool,
    color: "text-orange-400",
    bg: "bg-orange-900/60",
    accent: "#fb923c",
  },
];

function generateSummary(content: string): string {
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
  for (const para of paragraphs) {
    const firstSentence = para.split(/[.!?]/)[0]?.trim();
    if (firstSentence && firstSentence.length > 15) bullets.push(firstSentence);
  }
  const lines = content.split("\n");
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (keywords.some((k) => lower.includes(k)) && line.trim().length > 15) {
      const clean = line.replace(/^[•\-\*\d+\.\s]+/, "").trim();
      if (clean && !bullets.includes(clean)) bullets.push(clean);
    }
  }
  const unique = [...new Set(bullets)].slice(0, 10);
  return unique.map((b) => `• ${b}`).join("\n");
}

function generateMindMap(content: string, title: string): string {
  const lines = content.split("\n").filter((l) => l.trim());
  const mainTopic = title || lines[0] || "Main Topic";
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

interface EditorPageProps {
  onLogout: () => void;
  userName: string;
}

export default function EditorPage({ onLogout, userName }: EditorPageProps) {
  const { data: notesData, isLoading: _notesLoading } = useGetAllNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [modePanelOpen, setModePanelOpen] = useState(false);
  const [aiToolsOpen, setAiToolsOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<bigint | null>(null);
  const [noteTitle, setNoteTitle] = useState("Untitled Note");
  const [noteContent, setNoteContent] = useState("");
  const [mode, setMode] = useState<Mode>("school");
  const [fontStyle, setFontStyle] = useState<FontStyle>("patrick");
  const [penColor, setPenColor] = useState<PenColor>("blue");
  const [paperBg, setPaperBg] = useState<PaperBg>("ruled");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isImportingPDF, setIsImportingPDF] = useState(false);
  const [shapesOpen, setShapesOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowEditor, setMobileShowEditor] = useState(false);

  const imageUploadRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // AI Panel state
  const [summaryPreview, setSummaryPreview] = useState("");
  const [mindMapPreview, setMindMapPreview] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);

  const _notes = notesData ?? [];

  // Filtered notes
  const filteredNotes = _notes.filter((note) => {
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "All Notes" ||
      (note as any).category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const isChalkboard = paperBg === "chalkboard";
  const fontClass =
    FONTS.find((f) => f.id === fontStyle)?.class ?? "font-patrick";
  const penColorValue =
    PEN_COLORS.find((p) => p.id === penColor)?.color ?? "#1d4ed8";
  const paperClass =
    PAPER_BACKGROUNDS.find((p) => p.id === paperBg)?.class ?? "paper-ruled";

  const _loadNote = useCallback((note: Note) => {
    setSelectedNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setMode((note.mode as Mode) || "school");
    setFontStyle((note.fontStyle as FontStyle) || "patrick");
    setPenColor((note.penColor as PenColor) || "blue");
    setPaperBg((note.paperBackground as PaperBg) || "ruled");
    setIsDirty(false);
  }, []);

  const handleModeChange = (m: Mode) => {
    setMode(m);
    const defaults = MODE_DEFAULTS[m];
    setFontStyle(defaults.font);
    setPenColor(defaults.pen);
    setPaperBg(defaults.paper);
    setIsDirty(true);
  };

  const handleNewNote = async () => {
    setSelectedNoteId(null);
    setNoteTitle("New Note");
    setNoteContent("");
    setMode("school");
    setFontStyle("patrick");
    setPenColor("blue");
    setPaperBg("ruled");
    setIsDirty(false);
    setMobileShowEditor(true);
    contentRef.current?.focus();
  };

  const handleSelectNote = (note: Note) => {
    _loadNote(note);
    setMobileShowEditor(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (selectedNoteId !== null) {
        await updateNote.mutateAsync({
          noteId: selectedNoteId,
          title: noteTitle,
          content: noteContent,
          mode,
          fontStyle,
          penColor,
          paperBackground: paperBg,
        });
      } else {
        const id = await createNote.mutateAsync({
          title: noteTitle,
          content: noteContent,
          mode,
          fontStyle,
          penColor,
          paperBackground: paperBg,
        });
        setSelectedNoteId(id);
      }
      setIsDirty(false);
      toast.success("Note saved!");
    } catch {
      toast.error("Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (noteId: bigint) => {
    try {
      await deleteNote.mutateAsync(noteId);
      if (selectedNoteId === noteId) {
        handleNewNote();
      }
      toast.success("Note deleted.");
    } catch {
      toast.error("Failed to delete note.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const imgMarkdown = `\n![image](${dataUrl})\n`;
      const ta = contentRef.current;
      if (ta) {
        const start = ta.selectionStart ?? noteContent.length;
        const newContent =
          noteContent.slice(0, start) + imgMarkdown + noteContent.slice(start);
        setNoteContent(newContent);
        setIsDirty(true);
      } else {
        setNoteContent((prev) => prev + imgMarkdown);
        setIsDirty(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleExportPDF = () => window.print();

  const handleExportImage = () => {
    toast.info(
      "Tip: Use browser's Print → Save as PDF, then convert to image.",
    );
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.info(`Share link: ${window.location.href}`);
    }
  };

  const handlePDFImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImportingPDF(true);
    try {
      type PdfjsLib = {
        GlobalWorkerOptions: { workerSrc: string };
        getDocument: (p: { data: ArrayBuffer }) => {
          promise: Promise<{
            numPages: number;
            getPage: (n: number) => Promise<{
              getTextContent: () => Promise<{ items: Array<{ str?: string }> }>;
            }>;
          }>;
        };
      };
      const pdfjsLib: PdfjsLib = await new Promise((resolve, reject) => {
        if ((window as any).pdfjsLib) {
          resolve((window as any).pdfjsLib);
          return;
        }
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = () => resolve((window as any).pdfjsLib);
        script.onerror = reject;
        document.head.appendChild(script);
      });
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageTexts: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => item.str ?? "")
          .join(" ")
          .trim();
        if (pageText) pageTexts.push(pageText);
      }
      const fullText = pageTexts.join("\n\n");
      const title = file.name.replace(/\.pdf$/i, "");
      setNoteTitle(title);
      setNoteContent(fullText);
      setIsDirty(true);
      toast.success("PDF imported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to import PDF. Please try another file.");
    } finally {
      setIsImportingPDF(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  const autoBulletPoints = () => {
    const lines = noteContent.split("\n").filter((l) => l.trim());
    setNoteContent(
      lines.map((l) => `• ${l.replace(/^[•\-\*]\s*/, "")}`).join("\n"),
    );
    setIsDirty(true);
    toast.success("Converted to bullet points!");
  };

  const shortNotesFormatter = () => {
    const paragraphs = noteContent.split("\n\n");
    const shortened = paragraphs
      .map((p) => p.split(".")[0]?.trim())
      .filter(Boolean);
    setNoteContent(shortened.join("\n"));
    setIsDirty(true);
    toast.success("Formatted as short notes!");
  };

  const importantHighlighter = () => {
    const lines = noteContent.split("\n");
    const highlighted = lines.map((l, i) =>
      i % 2 === 0 ? `==HIGHLIGHT== ${l}` : l,
    );
    setNoteContent(highlighted.join("\n"));
    setIsDirty(true);
    toast.success("Important lines highlighted!");
  };

  const examRevisionFormat = () => {
    const lines = noteContent.split("\n");
    const formatted = lines.map((l, i) =>
      i % 3 === 2 && l.trim() ? `📌 ${l}` : l,
    );
    setNoteContent(formatted.join("\n"));
    setIsDirty(true);
    toast.success("Exam revision format applied!");
  };

  const insertMindMapPlaceholder = () => {
    const mindMap = `\n\n--- MIND MAP ---\n       [${noteTitle || "Main Topic"}]\n      /    |    \\    \\\n[Branch 1] [Branch 2] [Branch 3] [Branch 4]\n--- END MIND MAP ---\n`;
    setNoteContent((prev) => prev + mindMap);
    setIsDirty(true);
    toast.success("Mind map placeholder inserted!");
  };

  const insertFlowchart = () => {
    const flowchart =
      "\n\n--- FLOWCHART ---\n[START]\n  ↓\n[Step 1: Define problem]\n  ↓\n[Step 2: Analyze]\n  ↓\n[Step 3: Solution]\n  ↓\n[END]\n--- END FLOWCHART ---\n";
    setNoteContent((prev) => prev + flowchart);
    setIsDirty(true);
    toast.success("Flowchart placeholder inserted!");
  };

  const insertDiagram = (type: "biology" | "flowchart" | "mindmap") => {
    if (type === "biology") insertBiologyDiagram();
    else if (type === "flowchart") insertFlowchart();
    else insertMindMapPlaceholder();
  };

  const insertBiologyDiagram = () => {
    const diagram =
      "\n\n┌─────────────────────────────────┐\n│                                 │\n│      [ Biology Diagram ]        │\n│    (Label your diagram here)    │\n│                                 │\n└─────────────────────────────────┘\n";
    setNoteContent((prev) => prev + diagram);
    setIsDirty(true);
    toast.success("Biology diagram placeholder inserted!");
  };

  const wrapSelection = (prefix: string, suffix: string) => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = noteContent.slice(start, end);
    const newContent =
      noteContent.slice(0, start) +
      prefix +
      selected +
      suffix +
      noteContent.slice(end);
    setNoteContent(newContent);
    setIsDirty(true);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const insertShape = (ascii: string) => {
    const el = contentRef.current;
    const shapeText = `\n\n${ascii}\n\n`;
    if (el) {
      const pos = el.selectionStart ?? noteContent.length;
      const newContent =
        noteContent.slice(0, pos) + shapeText + noteContent.slice(pos);
      setNoteContent(newContent);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(pos + shapeText.length, pos + shapeText.length);
      }, 0);
    } else {
      setNoteContent((prev) => prev + shapeText);
    }
    setIsDirty(true);
    setShapesOpen(false);
    toast.success("Shape inserted!");
  };

  const insertList = (ordered: boolean) => {
    const lines = noteContent.split("\n").filter((l) => l.trim());
    const listed = ordered
      ? lines.map((l, i) => `${i + 1}. ${l}`).join("\n")
      : lines.map((l) => `• ${l}`).join("\n");
    setNoteContent(listed);
    setIsDirty(true);
  };

  const insertCallout = () => {
    const callout =
      "\n\n╔═══════════════════════════════════╗\n║  📌 Important Note                ║\n║  Write your callout text here     ║\n╚═══════════════════════════════════╝\n";
    setNoteContent((prev) => prev + callout);
    setIsDirty(true);
    toast.success("Callout box inserted!");
  };

  const _formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handlePaperChange = (p: PaperBg) => {
    setPaperBg(p);
    if (
      p === "chalkboard" &&
      penColor !== "chalk" &&
      penColor !== "yellow-chalk"
    ) {
      setPenColor("chalk");
    } else if (
      p !== "chalkboard" &&
      (penColor === "chalk" || penColor === "yellow-chalk")
    ) {
      setPenColor("blue");
    }
    setIsDirty(true);
  };

  const handleGenerateSummary = async () => {
    if (!noteContent.trim()) {
      toast.error("Note is empty. Add some content first.");
      return;
    }
    setIsGeneratingSummary(true);
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
    setNoteContent(summaryPreview);
    setIsDirty(true);
    setSummaryPreview("");
    toast.success("Summary applied to note!");
  };

  const handleInsertMindMap = () => {
    setNoteContent(`${noteContent}\n\n${mindMapPreview}`);
    setIsDirty(true);
    setMindMapPreview("");
    toast.success("Mind map inserted into note!");
  };

  // Sidebar content (shared between desktop and mobile sheet)
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / branding */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
            }}
          >
            <PenLine className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">
              Notes Maker
            </p>
            <p className="text-xs text-white/50 leading-none mt-0.5">
              Handwritten Style
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-white/8 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors"
            data-ocid="sidebar.search_input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* New Note */}
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={handleNewNote}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
          }}
          data-ocid="sidebar.new_note_button"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      <Separator className="bg-white/10" />

      {/* Categories */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-1">
          Subjects
        </p>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5 pb-3">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive =
              selectedCategory === cat.label ||
              (cat.label === "All Notes" && !selectedCategory);
            return (
              <motion.button
                key={cat.label}
                type="button"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
                onClick={() =>
                  setSelectedCategory(
                    cat.label === "All Notes" ? null : cat.label,
                  )
                }
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-white/12 text-white"
                    : "hover:bg-white/6 text-white/60 hover:text-white/90"
                }`}
                data-ocid={`sidebar.${cat.label.toLowerCase().replace(/ /g, "_")}.tab`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive ? cat.bg : "bg-white/6"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isActive ? cat.color : "text-white/40"}`}
                  />
                </div>
                <span className="text-sm font-medium flex-1">{cat.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="category-dot"
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: cat.accent }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>

      <Separator className="bg-white/10" />

      {/* User & Dark mode toggle */}
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-2 px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50">
            👤
          </div>
          <span className="text-xs text-white/40 truncate">
            {userName || "Student"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors text-white/60 hover:text-white/90"
          data-ocid="sidebar.dark_mode_toggle"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-yellow-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-400" />
          )}
          <span className="text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-[#0f0f17] overflow-hidden">
        {/* Hidden file inputs */}
        <input
          ref={pdfInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handlePDFImport}
          data-ocid="editor.upload_button"
        />
        <input
          ref={imageUploadRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Top Bar — glass morphism */}
        <header
          className="h-14 border-b border-white/8 flex items-center justify-between px-4 shrink-0 no-print z-20"
          style={{
            background:
              "linear-gradient(90deg, #833ab4cc, #fd1d1dcc, #fcb045cc)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Left: hamburger + logo + title */}
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:hidden text-white hover:bg-white/10"
                  data-ocid="sidebar.open_modal_button"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 p-0 border-white/10"
                style={{ background: "#14141f" }}
              >
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Desktop: sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden md:flex text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-ocid="sidebar.toggle"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>

            <div className="w-px h-5 bg-white/20 hidden md:block" />

            <input
              value={noteTitle}
              onChange={(e) => {
                setNoteTitle(e.target.value);
                setIsDirty(true);
              }}
              className="border-none shadow-none bg-transparent font-semibold text-sm text-white w-36 sm:w-56 px-0 h-7 focus:outline-none placeholder:text-white/40"
              placeholder="Note title..."
              data-ocid="editor.input"
            />
            {isDirty && (
              <span className="text-xs text-white/50 hidden sm:block">
                ● unsaved
              </span>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={isImportingPDF}
                  data-ocid="editor.import_pdf_button"
                >
                  {isImportingPDF ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import PDF</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={handleExportImage}
                  data-ocid="editor.export_image_button"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as Image</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={handleExportPDF}
                  data-ocid="editor.export_pdf_button"
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as PDF</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={handleShare}
                  data-ocid="editor.share_button"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
            <Button
              size="sm"
              className="bg-white/15 text-white hover:bg-white/25 rounded-full border border-white/20 text-xs font-semibold"
              onClick={handleSave}
              disabled={isSaving}
              data-ocid="editor.save_button"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1" />
              )}
              Save
            </Button>
            <div className="w-px h-5 bg-white/20 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={onLogout}
                  data-ocid="editor.logout_button"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Logout</TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Body — 3-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Column 1: Left Sidebar (desktop) ── */}
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.aside
                key="sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 256, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="hidden md:flex flex-col shrink-0 overflow-hidden border-r border-white/8 no-print"
                style={{ background: "#14141f" }}
              >
                <div className="w-64 h-full">
                  <SidebarContent />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── Column 2: Notes List ── */}
          <motion.div
            className={`w-72 flex-col border-r border-white/8 shrink-0 no-print ${
              mobileShowEditor ? "hidden" : "flex"
            } md:flex`}
            style={{ background: "#111119" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Notes list header */}
            <div className="px-4 pt-4 pb-3 border-b border-white/8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white/80">
                  {selectedCategory || "All Notes"}
                  <span className="ml-2 text-xs text-white/30 font-normal">
                    {filteredNotes.length}
                  </span>
                </h2>
                {/* Mobile back button (when showing list) */}
                <button
                  type="button"
                  onClick={() => setMobileShowEditor(true)}
                  className="md:hidden text-xs text-white/40 hover:text-white/70 flex items-center gap-1"
                >
                  Editor <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {/* Inline search in notes column */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg bg-white/6 border border-white/8 text-white placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors"
                  data-ocid="notes.search_input"
                />
              </div>
            </div>

            {/* Notes list */}
            <ScrollArea className="flex-1">
              {_notesLoading ? (
                <div
                  className="flex items-center justify-center h-24"
                  data-ocid="notes.loading_state"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-white/30" />
                </div>
              ) : filteredNotes.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-32 text-white/20"
                  data-ocid="notes.empty_state"
                >
                  <FileText className="w-8 h-8 mb-2" />
                  <p className="text-xs">
                    {searchQuery ? "No results" : "No notes yet"}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="p-2 space-y-1.5">
                    {filteredNotes.map((note, idx) => {
                      const isSelected = selectedNoteId === note.id;
                      return (
                        <motion.div
                          key={String(note.id)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: idx * 0.03, duration: 0.18 }}
                          data-ocid={`notes.item.${idx + 1}`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectNote(note)}
                            className={`w-full text-left rounded-xl p-3 transition-all group relative ${
                              isSelected
                                ? "bg-white/10 border border-white/15"
                                : "hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            {isSelected && (
                              <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-r-full"
                                style={{
                                  background:
                                    "linear-gradient(180deg, #833ab4, #fcb045)",
                                }}
                              />
                            )}
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-xs font-semibold leading-snug line-clamp-1 ${
                                  isSelected ? "text-white" : "text-white/70"
                                }`}
                              >
                                {note.title || "Untitled"}
                              </p>
                              <button
                                type="button"
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  if (window.confirm("Delete this note?"))
                                    handleDelete(note.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 shrink-0 text-white/30 hover:text-red-400 transition-all"
                                data-ocid={`notes.delete_button.${idx + 1}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs text-white/30 mt-1">
                              {_formatDate(note.updatedAt || note.createdAt)}
                            </p>
                            <p className="text-xs text-white/25 mt-1 line-clamp-2 leading-relaxed">
                              {note.content.replace(/\n/g, " ").slice(0, 80)}
                            </p>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              )}
            </ScrollArea>
          </motion.div>

          {/* ── Column 3: Editor ── */}
          <div
            className={`flex-1 flex flex-col overflow-hidden ${
              !mobileShowEditor ? "hidden" : "flex"
            } md:flex`}
            style={{ background: "#0f0f17" }}
          >
            {/* Mobile: back to notes list */}
            <div className="md:hidden flex items-center gap-2 px-3 py-2 border-b border-white/8 shrink-0">
              <button
                type="button"
                onClick={() => setMobileShowEditor(false)}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Notes list
              </button>
            </div>

            {/* Formatting Toolbar */}
            <div
              className="bg-[#16161f] border-b border-white/8 px-3 py-2 flex items-center gap-1 flex-wrap shrink-0 no-print overflow-x-auto"
              data-ocid="toolbar.section"
            >
              {/* Font style */}
              <select
                value={fontStyle}
                onChange={(e) => {
                  setFontStyle(e.target.value as FontStyle);
                  setIsDirty(true);
                }}
                className="text-xs border border-white/10 rounded px-2 py-1 bg-white/6 text-white/80 h-7 cursor-pointer focus:outline-none"
                data-ocid="toolbar.font_select"
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
              <div className="w-px h-5 bg-white/10 mx-0.5" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => wrapSelection("**", "**")}
                    data-ocid="toolbar.bold_button"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => wrapSelection("_", "_")}
                    data-ocid="toolbar.italic_button"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => wrapSelection("__", "__")}
                    data-ocid="toolbar.underline_button"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Underline</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => wrapSelection("==HIGHLIGHT== ", "")}
                    data-ocid="toolbar.highlight_button"
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Highlight</TooltipContent>
              </Tooltip>
              <div className="w-px h-5 bg-white/10 mx-0.5" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => insertList(false)}
                    data-ocid="toolbar.bullet_list_button"
                  >
                    <List className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => insertList(true)}
                    data-ocid="toolbar.numbered_list_button"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={insertCallout}
                    data-ocid="toolbar.callout_button"
                  >
                    <Box className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Callout Box</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => imageUploadRef.current?.click()}
                    data-ocid="toolbar.image_upload_button"
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Image</TooltipContent>
              </Tooltip>
              <div className="w-px h-5 bg-white/10 mx-0.5" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => insertDiagram("biology")}
                    data-ocid="toolbar.biology_diagram_button"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Biology Diagram</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => insertDiagram("flowchart")}
                    data-ocid="toolbar.flowchart_button"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Flowchart</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/8"
                    onClick={() => insertDiagram("mindmap")}
                    data-ocid="toolbar.mindmap_button"
                  >
                    <Brain className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mind Map</TooltipContent>
              </Tooltip>
              <div className="w-px h-5 bg-white/10 mx-0.5" />

              {/* Shapes Popover */}
              <Popover open={shapesOpen} onOpenChange={setShapesOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 gap-1 text-white/60 hover:text-white hover:bg-white/8"
                        data-ocid="toolbar.shapes_button"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Shapes
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Insert Shape</TooltipContent>
                </Tooltip>
                <PopoverContent
                  className="w-72 p-3"
                  side="bottom"
                  align="start"
                >
                  <p className="text-xs font-semibold mb-2 text-muted-foreground">
                    Insert Shape
                  </p>
                  <div className="grid grid-cols-4 gap-1">
                    {SHAPES.map((shape) => (
                      <button
                        key={shape.name}
                        type="button"
                        onClick={() => insertShape(shape.ascii)}
                        className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent transition-colors"
                        title={shape.name}
                      >
                        <span className="text-lg">{shape.preview}</span>
                        <span className="text-xs text-muted-foreground leading-none text-center">
                          {shape.name.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* AI Tools Popover */}
              <Popover open={aiToolsOpen} onOpenChange={setAiToolsOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 gap-1 text-purple-400 hover:text-purple-300 hover:bg-white/8"
                        data-ocid="toolbar.ai_tools_button"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Tools
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>AI Tools</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-80 p-0" side="bottom" align="end">
                  <Tabs defaultValue="summary">
                    <TabsList className="w-full rounded-none border-b">
                      <TabsTrigger value="summary" className="flex-1 text-xs">
                        Summary
                      </TabsTrigger>
                      <TabsTrigger value="mindmap" className="flex-1 text-xs">
                        Mind Map
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="p-3 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Generate a bullet-point summary of the current note.
                      </p>
                      <Button
                        size="sm"
                        className="w-full h-7 text-xs"
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary}
                        data-ocid="ai_tools.generate_summary_button"
                      >
                        {isGeneratingSummary ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 mr-1" />
                        )}
                        Generate Summary
                      </Button>
                      {summaryPreview && (
                        <div className="space-y-2">
                          <pre className="text-xs bg-muted rounded p-2 max-h-40 overflow-auto whitespace-pre-wrap">
                            {summaryPreview}
                          </pre>
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={handleApplySummary}
                              className="flex-1 h-7 text-xs"
                              data-ocid="ai_tools.apply_summary_button"
                            >
                              Apply to Note
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSummaryPreview("")}
                              className="h-7 text-xs"
                              data-ocid="ai_tools.clear_summary_button"
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="mindmap" className="p-3 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Generate a mind map structure from note content.
                      </p>
                      <Button
                        size="sm"
                        className="w-full h-7 text-xs"
                        onClick={handleGenerateMindMap}
                        disabled={isGeneratingMindMap}
                        data-ocid="ai_tools.generate_mindmap_button"
                      >
                        {isGeneratingMindMap ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        ) : (
                          <Brain className="w-3.5 h-3.5 mr-1" />
                        )}
                        Generate Mind Map
                      </Button>
                      {mindMapPreview && (
                        <div className="space-y-2">
                          <pre className="text-xs bg-muted rounded p-2 max-h-40 overflow-auto whitespace-pre-wrap font-mono">
                            {mindMapPreview}
                          </pre>
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={handleInsertMindMap}
                              className="flex-1 h-7 text-xs"
                              data-ocid="ai_tools.insert_mindmap_button"
                            >
                              Insert into Note
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMindMapPreview("")}
                              className="h-7 text-xs"
                              data-ocid="ai_tools.clear_mindmap_button"
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </PopoverContent>
              </Popover>

              <div className="w-px h-5 bg-white/10 mx-0.5" />
              {/* AI formatting shortcuts */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-purple-400 hover:text-purple-300 hover:bg-white/8"
                    onClick={autoBulletPoints}
                    data-ocid="toolbar.auto_bullet_button"
                  >
                    • Auto
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Auto Bullet Points</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-purple-400 hover:text-purple-300 hover:bg-white/8"
                    onClick={shortNotesFormatter}
                    data-ocid="toolbar.short_notes_button"
                  >
                    📋 Short
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Short Notes Formatter</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-yellow-400 hover:text-yellow-300 hover:bg-white/8"
                    onClick={importantHighlighter}
                    data-ocid="toolbar.highlight_important_button"
                  >
                    ⭐ Key
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Highlight Important Lines</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-orange-400 hover:text-orange-300 hover:bg-white/8"
                    onClick={examRevisionFormat}
                    data-ocid="toolbar.exam_format_button"
                  >
                    📌 Exam
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exam Revision Format</TooltipContent>
              </Tooltip>
            </div>

            {/* Action Bar */}
            <div
              className="bg-[#13131b] border-b border-white/8 px-4 py-2 flex items-center gap-2 flex-wrap shrink-0 no-print"
              data-ocid="editor.action_bar"
            >
              <Button
                size="sm"
                className="gap-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-orange-500 text-white border-none hover:opacity-90"
                onClick={handleSave}
                disabled={isSaving}
                data-ocid="editor.action_save_button"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs border-white/15 text-white/70 hover:bg-white/8 hover:text-white"
                onClick={() => setIsEditMode((prev) => !prev)}
                data-ocid="editor.action_toggle_button"
              >
                {isEditMode ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
                {isEditMode ? "View" : "Edit"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs border-red-900/40 text-red-400/80 hover:bg-red-950/50 hover:text-red-400"
                onClick={() => {
                  if (
                    selectedNoteId !== null &&
                    window.confirm("Are you sure you want to delete this note?")
                  ) {
                    handleDelete(selectedNoteId);
                  }
                }}
                disabled={selectedNoteId === null}
                data-ocid="editor.action_delete_button"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs border-white/15 text-white/70 hover:bg-white/8 hover:text-white"
                onClick={handleExportPDF}
                data-ocid="editor.action_download_pdf_button"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </Button>
            </div>

            {/* Canvas + Mode Panel */}
            <div className="flex flex-1 overflow-hidden">
              {/* Notebook Canvas */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={String(selectedNoteId)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-auto p-4 sm:p-8"
                  style={{ background: isChalkboard ? "#1a2e1a" : "#0f0f17" }}
                >
                  <div
                    ref={canvasRef}
                    className="relative max-w-3xl mx-auto"
                    data-ocid="editor.canvas_target"
                  >
                    {/* Spiral binding */}
                    {!isChalkboard && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-around z-10 no-print"
                        style={{ left: -24 }}
                      >
                        {[
                          "s1",
                          "s2",
                          "s3",
                          "s4",
                          "s5",
                          "s6",
                          "s7",
                          "s8",
                          "s9",
                          "s10",
                        ].map((k) => (
                          <div
                            key={k}
                            className="w-5 h-4 rounded-full border-2 border-slate-600/50 bg-[#1a1a27] mx-auto"
                          />
                        ))}
                      </div>
                    )}

                    {/* Chalkboard tray */}
                    {isChalkboard && (
                      <div className="flex items-center gap-3 mb-2 px-2 no-print">
                        <div className="h-2 w-16 rounded bg-amber-700 opacity-70" />
                        <div className="h-2 w-10 rounded bg-amber-700 opacity-50" />
                        <div className="text-xs text-green-300/60 font-caveat">
                          🖊 Chalk Board
                        </div>
                      </div>
                    )}

                    {/* Paper */}
                    <div
                      className={`relative rounded-xl overflow-hidden min-h-[600px] ${paperClass}`}
                      style={{
                        paddingLeft: paperBg === "margin" ? 72 : 24,
                        paddingRight: 24,
                        paddingTop: 24,
                        paddingBottom: 24,
                        boxShadow: isChalkboard
                          ? "inset 0 0 80px rgba(0,0,0,0.4), 0 6px 32px rgba(0,0,0,0.6)"
                          : "0 4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                      }}
                    >
                      {/* Mode badge */}
                      <div
                        className={`absolute top-3 right-3 flex items-center gap-1.5 backdrop-blur rounded-full px-3 py-1 text-xs font-medium border no-print ${
                          isChalkboard
                            ? "bg-black/30 border-green-700/40 text-green-200"
                            : "bg-white/80 border-blue-100 text-slate-700"
                        }`}
                      >
                        <span>{MODES.find((m) => m.id === mode)?.emoji}</span>
                        <span>{MODES.find((m) => m.id === mode)?.label}</span>
                      </div>

                      {/* Title */}
                      <div
                        className={`${fontClass} text-2xl font-bold mb-4 leading-8 ${
                          isChalkboard ? "" : "underline decoration-wavy"
                        }`}
                        style={{
                          color: penColorValue,
                          textShadow: isChalkboard
                            ? `0 0 8px ${penColorValue}88, 1px 1px 2px rgba(0,0,0,0.5)`
                            : undefined,
                          letterSpacing: isChalkboard ? "0.04em" : undefined,
                        }}
                      >
                        {noteTitle}
                      </div>

                      {/* Editable textarea / View mode */}
                      {isEditMode ? (
                        <textarea
                          ref={contentRef}
                          value={noteContent}
                          onChange={(e) => {
                            setNoteContent(e.target.value);
                            setIsDirty(true);
                          }}
                          className={`w-full bg-transparent border-none outline-none resize-none ${fontClass} text-lg leading-8 min-h-[500px]`}
                          style={{
                            color: penColorValue,
                            caretColor: penColorValue,
                            textShadow: isChalkboard
                              ? `0 0 6px ${penColorValue}66`
                              : undefined,
                            letterSpacing: isChalkboard ? "0.03em" : undefined,
                          }}
                          placeholder={`Start writing your ${MODES.find((m) => m.id === mode)?.label.toLowerCase()}...`}
                          data-ocid="editor.textarea"
                        />
                      ) : (
                        <div
                          className={`w-full min-h-[500px] ${fontClass} text-lg leading-8`}
                          style={{
                            color: penColorValue,
                            textShadow: isChalkboard
                              ? `0 0 6px ${penColorValue}66`
                              : undefined,
                            letterSpacing: isChalkboard ? "0.03em" : undefined,
                          }}
                          data-ocid="editor.view_mode"
                        >
                          <pre className="w-full whitespace-pre-wrap break-words font-inherit text-inherit">
                            {noteContent}
                          </pre>
                        </div>
                      )}

                      {/* Biology mode diagram placeholders */}
                      {mode === "biology" && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            "Cell Structure Diagram",
                            "Photosynthesis Process",
                          ].map((label) => (
                            <div
                              key={label}
                              className={`${fontClass} border-2 border-dashed rounded-lg p-4 h-36 flex items-center justify-center text-sm`}
                              style={{
                                borderColor: `${penColorValue}88`,
                                color: `${penColorValue}99`,
                              }}
                            >
                              [ {label} ]
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Mode Panel */}
              <AnimatePresence initial={false}>
                {modePanelOpen && (
                  <motion.div
                    key="mode-panel"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#13131b] border-l border-white/8 overflow-hidden shrink-0 no-print"
                  >
                    <div className="w-[200px] h-full flex flex-col">
                      <div className="p-3 border-b border-white/8 flex items-center justify-between">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                          Mode
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-white/40 hover:text-white"
                          onClick={() => setModePanelOpen(false)}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="p-2 space-y-1">
                        {MODES.map((m) => (
                          <button
                            type="button"
                            key={m.id}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                              mode === m.id
                                ? "bg-white/10 text-white font-semibold"
                                : "hover:bg-white/6 text-white/50 hover:text-white/80"
                            }`}
                            onClick={() => handleModeChange(m.id)}
                            data-ocid={`mode.${m.id}_button`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{m.emoji}</span>
                              <div>
                                <div className="font-medium">{m.label}</div>
                                <div className="text-white/30 text-xs">
                                  {m.desc}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mode panel toggle */}
              {!modePanelOpen && (
                <button
                  type="button"
                  className="flex items-center justify-center w-6 h-20 self-center bg-[#13131b] border border-white/8 rounded-l-md shadow-xs no-print text-white/30 hover:text-white/60"
                  onClick={() => setModePanelOpen(true)}
                  data-ocid="mode.panel_toggle"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Bottom toolbar */}
            <div
              className="bg-[#13131b] border-t border-white/8 px-3 py-2 flex items-center gap-4 flex-wrap shrink-0 no-print overflow-x-auto"
              data-ocid="bottom_toolbar.section"
            >
              {/* Pen color */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">Pen:</span>
                {PEN_COLORS.map((p) => (
                  <Tooltip key={p.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                          penColor === p.id
                            ? "border-white scale-110"
                            : "border-white/20"
                        }`}
                        style={{ backgroundColor: p.color }}
                        onClick={() => {
                          setPenColor(p.id);
                          setIsDirty(true);
                        }}
                        data-ocid={`pen.${p.id}_button`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>{p.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="w-px h-5 bg-white/10" />
              {/* Paper */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">Paper:</span>
                {PAPER_BACKGROUNDS.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${
                      paperBg === p.id
                        ? "bg-white/15 text-white border-white/25"
                        : "border-white/10 text-white/40 hover:bg-white/8 hover:text-white/70"
                    }`}
                    onClick={() => handlePaperChange(p.id)}
                    data-ocid={`paper.${p.id}_button`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="w-px h-5 bg-white/10" />
              {/* Font */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">Font:</span>
                {FONTS.map((f) => (
                  <button
                    type="button"
                    key={f.id}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${f.class} ${
                      fontStyle === f.id
                        ? "bg-white/15 text-white border-white/25"
                        : "border-white/10 text-white/40 hover:bg-white/8 hover:text-white/70"
                    }`}
                    onClick={() => {
                      setFontStyle(f.id);
                      setIsDirty(true);
                    }}
                    data-ocid={`font.${f.id}_button`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="shrink-0 border-t border-white/5 py-1.5 text-center no-print"
          style={{ background: "#0c0c14" }}
        >
          <p className="text-xs text-white/15">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
