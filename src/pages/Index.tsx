import { useState, useEffect } from "react";
import { SetupScreen } from "@/components/SetupScreen";
import { TossScreen } from "@/components/TossScreen";
import { GameManager } from "@/components/GameManager";
import { AuthScreen, TournamentStage } from "@/components/AuthScreen";
import { Dashboard } from "@/components/Dashboard";

type Screen = "auth" | "setup" | "toss" | "game" | "dashboard";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("auth");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAPlayers, setTeamAPlayers] = useState<string[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<string[]>([]);
  const [battingFirst, setBattingFirst] = useState<"A" | "B">("A");
  const [tournamentStage, setTournamentStage] = useState<TournamentStage>("group");

  const handleSetupComplete = (
    tAName: string,
    tBName: string,
    tAPlayers: string[],
    tBPlayers: string[]
  ) => {
    setTeamAName(tAName);
    setTeamBName(tBName);
    setTeamAPlayers(tAPlayers);
    setTeamBPlayers(tBPlayers);
    setScreen("toss");
  };

  const handleTossComplete = (winner: "A" | "B", choice: "bat" | "bowl") => {
    setBattingFirst(choice === "bat" ? winner : winner === "A" ? "B" : "A");
    setScreen("game");
  };

  const handleNewGame = () => {
    // Clear teams and go back to setup
    setTeamAName("");
    setTeamBName("");
    setTeamAPlayers([]);
    setTeamBPlayers([]);
    setBattingFirst("A");
    setScreen("setup");
  };

  const handleAuthSuccess = (organizer: boolean, stage?: TournamentStage) => {
    setIsOrganizer(organizer);
    if (stage) {
      setTournamentStage(stage);
    }
    setScreen("dashboard");
  };

  const handleBackFromDashboard = () => {
    setScreen("setup");
  };

  const handleNavigateToGame = () => {
    setScreen("setup");
  };

  useEffect(() => {
    // Check if already authenticated
    const authData = sessionStorage.getItem("mpl_auth");
    if (authData) {
      const auth = JSON.parse(authData);
      setIsOrganizer(auth.role === "organizer");
      if (auth.stage) {
        setTournamentStage(auth.stage);
      }
      setScreen("dashboard");
    }
  }, []);

  return (
    <>
      {screen === "auth" && <AuthScreen onAuthSuccess={handleAuthSuccess} />}
      {screen === "dashboard" && (
        <Dashboard onBack={handleNavigateToGame} onStartGame={handleNewGame} />
      )}
      {screen === "setup" && <SetupScreen onComplete={handleSetupComplete} />}
      {screen === "toss" && (
        <TossScreen
          teamAName={teamAName}
          teamBName={teamBName}
          onComplete={handleTossComplete}
        />
      )}
      {screen === "game" && (
        <GameManager
          teamAName={teamAName}
          teamBName={teamBName}
          teamAPlayers={teamAPlayers}
          teamBPlayers={teamBPlayers}
          battingFirst={battingFirst}
          tournamentStage={tournamentStage}
          onNewGame={handleNewGame}
        />
      )}
    </>
  );
};

export default Index;
