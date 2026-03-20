import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AuthModal from "./components/AuthModal";
import ProfileSetup from "./components/ProfileSetup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import EditorPage from "./pages/EditorPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [showAuth, setShowAuth] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleLogout = async () => {
    queryClient.clear();
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {!isAuthenticated ? (
        <>
          <LandingPage
            onSignIn={() => setShowAuth(true)}
            onGetStarted={() => setShowAuth(true)}
          />
          <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </>
      ) : (
        <>
          {showProfileSetup && <ProfileSetup />}
          <EditorPage
            onLogout={handleLogout}
            userName={userProfile?.name ?? ""}
          />
        </>
      )}
    </div>
  );
}
