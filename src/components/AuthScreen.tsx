import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Shield, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type TournamentStage = "group" | "playoffs" | "semifinals" | "finals";

interface AuthScreenProps {
  onAuthSuccess: (isOrganizer: boolean, stage?: TournamentStage) => void;
}

export const AuthScreen = ({ onAuthSuccess }: AuthScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Tournament stage credentials
  const STAGE_CREDENTIALS = {
    group: {
      username: "group",
      password: "group123",
      name: "Group Stage",
      icon: "🏁",
    },
    playoffs: {
      username: "playoffs",
      password: "playoffs123",
      name: "Playoffs",
      icon: "⚔️",
    },
    semifinals: {
      username: "semifinals",
      password: "semi123",
      name: "Semi-Finals",
      icon: "🔥",
    },
    finals: {
      username: "finals",
      password: "finals123",
      name: "Finals",
      icon: "🏆",
    },
  };

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
        setIsLoading(false);
        return;
      }

      // Check for tournament stage credentials
      let stageFound: TournamentStage | null = null;
      for (const [stage, creds] of Object.entries(STAGE_CREDENTIALS)) {
        if (username === creds.username && password === creds.password) {
          stageFound = stage as TournamentStage;
          sessionStorage.setItem("mpl_auth", JSON.stringify({
            username,
            role: "player",
            stage: stageFound
          }));
          toast({
            title: `${creds.icon} ${creds.name}`,
            description: `Access granted to ${creds.name} questions.`
          });
          onAuthSuccess(false, stageFound);
          setIsLoading(false);
          return;
        }
      }

      // If no valid credentials, show error
      toast({
        title: "Access Denied",
        description: "Invalid credentials. Please use valid stage credentials.",
        variant: "destructive"
      });

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


            {/* Stage credentials for testing purposes */}

            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2 font-semibold">Tournament Stage Credentials:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 bg-green-900/20 rounded border border-green-700">
                  <p className="font-mono text-xs">🏁 group / group123</p>
                  <p className="text-[10px] opacity-70">Group Stage</p>
                </div>
                <div className="p-2 bg-blue-900/20 rounded border border-blue-700">
                  <p className="font-mono text-xs">⚔️ playoffs / playoffs123</p>
                  <p className="text-[10px] opacity-70">Playoffs</p>
                </div>
                <div className="p-2 bg-orange-900/20 rounded border border-orange-700">
                  <p className="font-mono text-xs">🔥 semifinals / semi123</p>
                  <p className="text-[10px] opacity-70">Semi-Finals</p>
                </div>
                <div className="p-2 bg-yellow-900/20 rounded border border-yellow-700">
                  <p className="font-mono text-xs">🏆 finals / finals123</p>
                  <p className="text-[10px] opacity-70">Finals</p>
                </div>
              </div>
              <p className="font-mono text-xs mt-3 text-blue-400">Organizer: organizer / admin123</p>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

