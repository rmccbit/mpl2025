import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Shield, Trophy, Zap, Flame, Swords } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-stadium flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          style={{
            boxShadow: '0 0 100px 50px rgba(59, 130, 246, 0.3)'
          }}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          style={{
            boxShadow: '0 0 100px 50px rgba(147, 51, 234, 0.3)'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="p-8 bg-card/95 backdrop-blur-xl shadow-2xl border-2 border-primary/20">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="text-center mb-8"
          >
            <motion.div 
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 mb-4 shadow-[0_0_40px_rgba(37,99,235,0.6)]"
            >
              <Shield className="w-10 h-10 text-white drop-shadow-glow" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black text-blue-500 mb-2"
              style={{
                textShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
              }}
            >
              MPL ACCESS
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm"
            >
              Login to access the tournament
            </motion.p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-10 h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 0 30px rgba(37, 99, 235, 0.4), 0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 50px rgba(37, 99, 235, 0.6), 0 8px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(37, 99, 235, 0.4), 0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                ) : (
                  "Login to Tournament"
                )}
              </Button>
            </motion.div>

            {/* Stage credentials
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-3 pt-4 border-t border-border/50"
            >
              <div className="text-center">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Tournament Stages
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-3 bg-green-900/30 rounded-lg border border-green-600/40 hover:border-green-500/60 transition-all backdrop-blur-sm group cursor-default"
                  style={{
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.2)';
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-green-400" />
                    <p className="font-mono text-xs text-green-300 font-semibold">🏁 Group</p>
                  </div>
                  <p className="font-mono text-[11px] text-green-200/80">group / group123</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-3 bg-blue-900/30 rounded-lg border border-blue-600/40 hover:border-blue-500/60 transition-all backdrop-blur-sm group cursor-default"
                  style={{
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.2)';
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Swords className="w-4 h-4 text-blue-400" />
                    <p className="font-mono text-xs text-blue-300 font-semibold">⚔️ Playoffs</p>
                  </div>
                  <p className="font-mono text-[11px] text-blue-200/80">playoffs / playoffs123</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-3 bg-orange-900/30 rounded-lg border border-orange-600/40 hover:border-orange-500/60 transition-all backdrop-blur-sm group cursor-default"
                  style={{
                    boxShadow: '0 0 20px rgba(249, 115, 22, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(249, 115, 22, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.2)';
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <p className="font-mono text-xs text-orange-300 font-semibold">🔥 Semi-Finals</p>
                  </div>
                  <p className="font-mono text-[11px] text-orange-200/80">semifinals / semi123</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-600/40 hover:border-yellow-500/60 transition-all backdrop-blur-sm group cursor-default"
                  style={{
                    boxShadow: '0 0 20px rgba(234, 179, 8, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(234, 179, 8, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(234, 179, 8, 0.2)';
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <p className="font-mono text-xs text-yellow-300 font-semibold">🏆 Finals</p>
                  </div>
                  <p className="font-mono text-[11px] text-yellow-200/80">finals / finals123</p>
                </motion.div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all backdrop-blur-sm mt-3"
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <p className="font-mono text-xs text-purple-300">
                    <span className="font-semibold">Organizer:</span> organizer / admin123
                  </p>
                </div>
              </motion.div>
            </motion.div> */}
          </form>
        </Card>

        {/* Floating elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50"
        />
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl opacity-50"
        />
      </motion.div>
    </div>
  );
};

