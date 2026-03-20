import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Download,
  FlaskConical,
  GraduationCap,
  Highlighter,
  Layers,
  PenLine,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export default function LandingPage({ onSignIn, onGetStarted }: Props) {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 insta-gradient border-b border-border shadow-xs"
        data-ocid="nav.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <PenLine className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold text-sm text-foreground leading-tight">
                Smart Handwritten
              </div>
              <div className="font-bold text-sm text-primary leading-tight">
                Notes Maker
              </div>
            </div>
          </div>
          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.link"
            >
              Features
            </a>
            <a
              href="#modes"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.link"
            >
              Modes
            </a>
            <a
              href="#footer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.link"
            >
              Support
            </a>
          </nav>
          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-border"
              onClick={onSignIn}
              data-ocid="nav.sign_in_button"
            >
              Sign in
            </Button>
            <Button
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90 hidden sm:flex"
              onClick={onGetStarted}
              data-ocid="nav.get_started_button"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            Loved by 10,000+ students
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Smart Handwritten
            <br />
            <span className="text-primary">Notes Maker</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Transform any text into beautiful, realistic handwritten notes.
            Multiple styles, paper backgrounds, and smart formatting — perfect
            for students.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90 px-8 text-base font-semibold"
              onClick={onGetStarted}
              data-ocid="hero.get_started_button"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base"
              onClick={onSignIn}
              data-ocid="hero.sign_in_button"
            >
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 w-full max-w-5xl mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="bg-muted/40 px-4 py-2 flex items-center gap-2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                Smart Handwritten Notes Maker
              </span>
            </div>
            <div className="flex h-72 sm:h-96">
              {/* Sidebar preview */}
              <div className="w-44 sm:w-52 border-r border-border bg-sidebar p-3 flex flex-col gap-2">
                <div className="text-xs font-semibold text-sidebar-foreground mb-1">
                  My Notes
                </div>
                {[
                  "Biology Chapter 5",
                  "Math Formulas",
                  "History Notes",
                  "Chemistry Lab",
                ].map((note) => (
                  <div
                    key={note}
                    className={`text-xs px-2 py-1.5 rounded-md cursor-pointer truncate ${
                      note === "Biology Chapter 5"
                        ? "bg-primary/20 text-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    📝 {note}
                  </div>
                ))}
                <div className="mt-auto">
                  <div className="text-xs px-2 py-1.5 rounded-md bg-primary text-primary-foreground text-center font-medium cursor-pointer">
                    + New Note
                  </div>
                </div>
              </div>
              {/* Canvas preview */}
              <div className="flex-1 paper-ruled p-6 relative overflow-hidden">
                <div className="font-caveat text-blue-700 text-lg font-bold mb-2 underline decoration-wavy">
                  Biology Chapter 5 — Cell Division
                </div>
                <div className="font-caveat text-blue-700 text-base leading-8 space-y-1">
                  <div>• Mitosis: cell division for growth</div>
                  <div className="bg-yellow-200/60 px-1 rounded">
                    • <strong>4 phases:</strong> Prophase, Metaphase, Anaphase,
                    Telophase
                  </div>
                  <div>• Meiosis: produces gametes (sex cells)</div>
                  <div className="text-orange-600 font-bold">
                    ⭐ Important: Chromosomes = 46 in humans
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-white/80 rounded-lg border border-blue-100 px-3 py-2 text-xs">
                  <div className="font-semibold text-slate-700 mb-1">Mode</div>
                  <div className="text-blue-600 font-medium">🔬 Biology</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Everything you need to ace your studies
            </h2>
            <p className="text-muted-foreground">
              Smart tools designed for students, by students
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: PenLine,
                title: "4 Handwriting Styles",
                desc: "Caveat, Patrick Hand, Kalam & Dancing Script — all beautifully rendered on notebook paper.",
              },
              {
                icon: Layers,
                title: "5 Study Modes",
                desc: "School, College, Biology, Notebook & Exam Revision modes with tailored formatting.",
              },
              {
                icon: Highlighter,
                title: "Smart Formatting",
                desc: "Auto bullet points, short notes formatter, important line highlighter & exam markers.",
              },
              {
                icon: FlaskConical,
                title: "Diagram Placeholders",
                desc: "Insert labeled biology diagrams, flowcharts, and mind map layouts with one click.",
              },
              {
                icon: Download,
                title: "Export Anywhere",
                desc: "Download as image or PDF. Print-ready layouts that hide toolbars automatically.",
              },
              {
                icon: BookOpen,
                title: "Cloud Sync",
                desc: "Notes saved securely to the Internet Computer. Access from any device, anytime.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="bg-background rounded-xl border border-border p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Study modes for every situation
            </h2>
            <p className="text-muted-foreground">
              Switch between modes to match your study style
            </p>
          </motion.div>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              {
                emoji: "🏫",
                name: "School Notes",
                color: "border-blue-400/40 bg-blue-400/10",
                textColor: "text-blue-300",
              },
              {
                emoji: "🎓",
                name: "College Notes",
                color: "border-purple-400/40 bg-purple-400/10",
                textColor: "text-purple-300",
              },
              {
                emoji: "🔬",
                name: "Biology Notes",
                color: "border-green-400/40 bg-green-400/10",
                textColor: "text-green-300",
              },
              {
                emoji: "📓",
                name: "Notebook Mode",
                color: "border-amber-400/40 bg-amber-400/10",
                textColor: "text-amber-300",
              },
              {
                emoji: "⭐",
                name: "Exam Revision",
                color: "border-red-400/40 bg-red-400/10",
                textColor: "text-red-300",
              },
            ].map(({ emoji, name, color, textColor }) => (
              <div
                key={name}
                className={`flex items-center gap-3 px-5 py-3 rounded-full border ${color} cursor-pointer hover:scale-105 transition-transform`}
              >
                <span className="text-xl">{emoji}</span>
                <span className={`font-semibold ${textColor}`}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-card border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-foreground">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#modes" className="hover:text-foreground">
                    Modes
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-foreground">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-foreground">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-foreground">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-foreground">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Stay Updated
              </h4>
              <div className="flex gap-2">
                <Input placeholder="Your email" className="text-sm" />
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground shrink-0"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
