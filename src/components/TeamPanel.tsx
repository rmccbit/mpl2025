import { Card } from "@/components/ui/card";
import { User, Star } from "lucide-react";

interface TeamPanelProps {
  teamName: string;
  players: string[];
  color: "team-a" | "team-b";
  currentPlayer: number;
  role: "batting" | "bowling";
  selectable?: boolean;
  selectedIndex?: number | null;
  onSelect?: (index: number) => void;
  lockedIndices?: number[];
}

export const TeamPanel = ({ teamName, players, color, currentPlayer, role, selectable = false, selectedIndex = null, onSelect, lockedIndices = [] }: TeamPanelProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm p-4 shadow-stadium animate-fade-in-scale">
      <div className={`p-3 rounded-t-lg mb-4 bg-gradient-${color}`}>
        <h2 className="text-xl font-bold text-center text-foreground">{teamName}</h2>
        <p className="text-center text-sm text-muted-foreground capitalize">{role}</p>
      </div>

      <div className="space-y-2">
        {players.map((player, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (!selectable || !onSelect) return;
              if (lockedIndices.includes(idx)) return;
              onSelect(idx);
            }}
            className={`p-3 rounded-lg border transition-all ${
              idx === currentPlayer
                ? `border-${color} bg-${color}/10 shadow-glow`
                : "border-border bg-muted/30"
            } ${selectable ? "cursor-pointer" : ""} ${lockedIndices.includes(idx) ? "opacity-50 cursor-not-allowed" : ""} ${selectedIndex === idx ? `ring-2 ring-offset-2 ring-${color}` : ""}`}
          >
            <div className="flex items-center gap-2">
              {idx === currentPlayer ? (
                <Star className={`w-4 h-4 text-${color} animate-pulse-glow`} />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={`text-sm font-medium ${idx === currentPlayer ? "text-foreground" : "text-muted-foreground"}`}>
                {idx + 1}. {player}
              </span>
              {selectable && selectedIndex === idx && (
                <span className={`ml-auto text-xs font-semibold text-${color}`}>Selected</span>
              )}
              {lockedIndices.includes(idx) && (
                <span className="ml-auto text-xs font-semibold text-destructive">Locked</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
