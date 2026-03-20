import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Loader2, Pen } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
  const { login, loginStatus } = useInternetIdentity();
  const [error, setError] = useState("");
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    setError("");
    try {
      await login();
      onClose();
    } catch (e: any) {
      setError(e?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="auth.dialog">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Pen className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Welcome Back
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-muted-foreground text-sm">
            Sign in to save your notes to the cloud, access them from anywhere,
            and unlock all features.
          </p>
          <div className="bg-accent rounded-lg p-4 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Secure & Private</p>
              <p className="text-muted-foreground">
                Your notes are stored securely on the Internet Computer
                blockchain. Only you can access them.
              </p>
            </div>
          </div>
          {error && (
            <p
              className="text-destructive text-sm"
              data-ocid="auth.error_state"
            >
              {error}
            </p>
          )}
          <Button
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-orange-600 font-semibold py-6"
            onClick={handleLogin}
            disabled={isLoggingIn}
            data-ocid="auth.submit_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In to Continue"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            New here? Signing in creates your account automatically.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
