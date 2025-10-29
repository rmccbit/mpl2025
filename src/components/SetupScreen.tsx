import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trophy, Upload, Download, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SetupScreenProps {
  onComplete: (
    teamAName: string,
    teamBName: string,
    teamAPlayers: string[],
    teamBPlayers: string[]
  ) => void;
}

export const SetupScreen = ({ onComplete }: SetupScreenProps) => {
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [teamAPlayers, setTeamAPlayers] = useState<string[]>(Array(11).fill(""));
  const [teamBPlayers, setTeamBPlayers] = useState<string[]>(Array(11).fill(""));
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const validTeamA = teamAPlayers.filter((p) => p.trim() !== "");
    const validTeamB = teamBPlayers.filter((p) => p.trim() !== "");

    if (validTeamA.length >= 1 && validTeamB.length >= 1) {
      onComplete(teamAName, teamBName, validTeamA, validTeamB);
    }
  };

  const isValid =
    teamAPlayers.filter((p) => p.trim() !== "").length >= 1 &&
    teamBPlayers.filter((p) => p.trim() !== "").length >= 1;

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (extension === "json") {
        const data = JSON.parse(text);
        if (data.teamA && data.teamB) {
          setTeamAName(data.teamA.name || teamAName);
          setTeamBName(data.teamB.name || teamBName);
          setTeamAPlayers(data.teamA.players || teamAPlayers);
          setTeamBPlayers(data.teamB.players || teamBPlayers);
          toast({
            title: "Teams imported successfully!",
            description: "Team data loaded from JSON file.",
          });
        } else {
          throw new Error("Invalid JSON format");
        }
      } else if (extension === "csv") {
        const lines = text.split("\n").filter((line) => line.trim());
        const teamAData = lines[0].split(",").map((s) => s.trim());
        const teamBData = lines[1]?.split(",").map((s) => s.trim()) || [];

        if (teamAData.length >= 2 && teamBData.length >= 2) {
          setTeamAName(teamAData[0]);
          setTeamAPlayers(teamAData.slice(1));
          setTeamBName(teamBData[0]);
          setTeamBPlayers(teamBData.slice(1));
          toast({
            title: "Teams imported successfully!",
            description: "Team data loaded from CSV file.",
          });
        } else {
          throw new Error("Invalid CSV format");
        }
      } else {
        throw new Error("Unsupported file format. Please use CSV or JSON.");
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description:
          error instanceof Error ? error.message : "Failed to parse file.",
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = () => {
    const data = {
      teamA: {
        name: teamAName,
        players: teamAPlayers.filter((p) => p.trim() !== ""),
      },
      teamB: {
        name: teamBName,
        players: teamBPlayers.filter((p) => p.trim() !== ""),
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mpl-teams-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Teams exported!", description: "Team data saved to file." });
  };

  const handleAddPlayer = (team: "A" | "B") => {
    if (team === "A" && teamAPlayers.length < 11) {
      setTeamAPlayers([...teamAPlayers, ""]);
    } else if (team === "B" && teamBPlayers.length < 11) {
      setTeamBPlayers([...teamBPlayers, ""]);
    }
  };

  const handleRemovePlayer = (team: "A" | "B", index: number) => {
    if (team === "A") {
      const updated = teamAPlayers.filter((_, i) => i !== index);
      setTeamAPlayers(updated);
    } else {
      const updated = teamBPlayers.filter((_, i) => i !== index);
      setTeamBPlayers(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-stadium flex items-center justify-center p-6 animate-fade-in">
      <Card className="w-full max-w-6xl p-8 bg-card shadow-stadium">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="w-10 h-10 text-secondary" />
          <h1 className="text-4xl font-bold text-center bg-gradient-gold bg-clip-text text-transparent">
            Mathematics Premier League
          </h1>
          <Trophy className="w-10 h-10 text-secondary" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Team A */}
          <div className="space-y-4 animate-slide-in-left">
            <div className="p-4 rounded-lg bg-gradient-team-a">
              <Input
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="text-2xl font-bold text-center bg-card/50 border-team-a"
                placeholder="Team A Name"
              />
            </div>
            <div className="space-y-2">
              {teamAPlayers.map((player, idx) => (
                <div key={`team-a-${idx}`} className="flex items-center gap-2">
                  <Input
                    value={player}
                    onChange={(e) => {
                      const updated = [...teamAPlayers];
                      updated[idx] = e.target.value;
                      setTeamAPlayers(updated);
                    }}
                    placeholder={`Player ${idx + 1}`}
                    className="bg-muted border-team-a/30 focus:border-team-a flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemovePlayer("A", idx)}
                    className="rounded-full h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {teamAPlayers.length < 11 && (
                <Button
                  variant="secondary"
                  onClick={() => handleAddPlayer("A")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Player
                </Button>
              )}
            </div>
          </div>

          {/* Team B */}
          <div className="space-y-4 animate-slide-in-right">
            <div className="p-4 rounded-lg bg-gradient-team-b">
              <Input
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="text-2xl font-bold text-center bg-card/50 border-team-b"
                placeholder="Team B Name"
              />
            </div>
            <div className="space-y-2">
              {teamBPlayers.map((player, idx) => (
                <div key={`team-b-${idx}`} className="flex items-center gap-2">
                  <Input
                    value={player}
                    onChange={(e) => {
                      const updated = [...teamBPlayers];
                      updated[idx] = e.target.value;
                      setTeamBPlayers(updated);
                    }}
                    placeholder={`Player ${idx + 1}`}
                    className="bg-muted border-team-b/30 focus:border-team-b flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemovePlayer("B", idx)}
                    className="rounded-full h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {teamBPlayers.length < 11 && (
                <Button
                  variant="secondary"
                  onClick={() => handleAddPlayer("B")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Player
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Import/Export Section */}
        <div className="mt-6 flex gap-4 justify-center items-center mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileImport}
            className="hidden"
            id="team-import"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Teams
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export Teams
          </Button>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            size="lg"
            className="bg-gradient-pitch hover:scale-105 transition-transform text-lg px-12 py-6"
          >
            Start Match
          </Button>
        </div>
      </Card>
    </div>
  );
};
