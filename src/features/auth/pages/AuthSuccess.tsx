import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAuthSession } from "@/lib/storage";
import { useAuthContext } from "@/providers/AuthProvider";

export const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuthContext();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken) {
      // Save the token first so that refreshUser (which likely calls an API with this token) works
      setAuthSession({ accessToken });
      
      // Fetch user data from the backend using the new token
      refreshUser().then(() => {
        // Redirect to home or dashboard after user data is loaded
        navigate("/");
      }).catch((err) => {
        console.error("Failed to refresh user after Google login:", err);
        navigate("/login");
      });
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium animate-pulse">Authenticating with Google...</p>
      </div>
    </div>
  );
};
