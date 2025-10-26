import { GameState } from "@/components/GameScreen";

export interface GameData {
  id?: string;
  teamA: {
    name: string;
    players: string[];
    score?: { runs: number; wickets: number; overs: number };
  };
  teamB: {
    name: string;
    players: string[];
    score?: { runs: number; wickets: number; overs: number };
  };
  battingFirst: "A" | "B";
  winner?: string;
  gameOver: boolean;
  timestamp: string;
  ballDetails?: Array<{
    ballNumber: number;
    innings: number;
    batterName: string;
    bowlerName: string;
    batterTeam: string;
    bowlerTeam: string;
    result: string;
    runsScored: number;
    isExtra: boolean;
    extraType?: string;
    questionId?: number;
    timestamp: string;
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/games";

export const api = {
  async saveGame(gameData: GameData): Promise<GameData> {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error("Failed to save game data");
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error saving game:", error);
      // Fallback: save to localStorage
      const games = JSON.parse(localStorage.getItem("mpl_games") || "[]");
      games.push({ ...gameData, id: `local_${Date.now()}` });
      localStorage.setItem("mpl_games", JSON.stringify(games));
      return gameData;
    }
  },

  async getGameHistory(limit = 10): Promise<GameData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch game history");
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error fetching game history:", error);
      // Fallback: read from localStorage
      const games = JSON.parse(localStorage.getItem("mpl_games") || "[]");
      return games.slice(-limit);
    }
  },

  async getGameById(id: string): Promise<GameData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch game");
      }

      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error("Error fetching game:", error);
      return null;
    }
  },
};

