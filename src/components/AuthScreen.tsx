import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthScreenProps {
  onAuthSuccess: (isOrganizer: boolean) => void;
}

export const AuthScreen = ({ onAuthSuccess }: AuthScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Default organizer credentials
  const ORGANIZER_CREDENTIALS = {
    username: "organizer",
    password: "admin123",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication (replace with real auth in production)
    setTimeout(() => {
      // Check for organizer login
      const isOrganizer = username === ORGANIZER_CREDENTIALS.username && password === ORGANIZER_CREDENTIALS.password;
      
      if (isOrganizer) {
        // Save organizer session
        sessionStorage.setItem("mpl_auth", JSON.stringify({ username, role: "organizer" }));
        toast({ title: "Welcome!", description: "Logged in as organizer." });
        onAuthSuccess(true);
      } else {
        // Check for player login or allow guest access
        const isGuest = username.toLowerCase() === "guest" || username === "";
        
        if (isGuest) {
          sessionStorage.setItem("mpl_auth", JSON.stringify({ username: "Guest", role: "player" }));
          toast({ title: "Welcome!", description: "Logged in as guest player." });
          onAuthSuccess(false);
        } else {
          // Regular player login
          sessionStorage.setItem("mpl_auth", JSON.stringify({ username, role: "player" }));
          toast({ title: "Welcome!", description: `Logged in as ${username}.` });
          onAuthSuccess(false);
        }
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-stadium flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-card shadow-stadium">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-pitch mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">MPL Access</h1>
          <p className="text-muted-foreground">Login to access the game or dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (or 'guest')"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-pitch hover:scale-105 transition-transform"
              size="lg"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">Demo Credentials:</p>
              <p className="font-mono text-xs">Organizer: organizer / admin123</p>
              <p className="font-mono text-xs">Player: guest / (any password)</p>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

