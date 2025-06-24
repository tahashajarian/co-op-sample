'use client'

import React, { useState, useEffect, useRef } from "react";
import socket from "@/lib/sockets"; // Assuming this is correctly typed
import GameArea, { PlayedCard } from "@/components/GameArea";
import SessionManager from "@/components/SessionManager";
import WaitingMessage from "@/components/WaitingMessage";



export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [status, setStatus] = useState<string>("Disconnected");
  const [playerId, setPlayerId] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<string>("");
  const [playedCards, setPlayedCards] = useState<PlayedCard[]>([]);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [playerHealth, setPlayerHealth] = useState<{ [key: string]: number }>(
    {}
  );
  const [monsterHealth, setMonsterHealth] = useState<number>(100);
  const [turnTimeLeft, setTurnTimeLeft] = useState<number>(90);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTurnTimeLeft(90);
    timerRef.current = setInterval(() => {
      setTurnTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getPlayerName = (id: string): string => {
    if (id === playerId) return "You";
    if (id === "monster") return "Monster";
    if (players.length === 2)
      return players.find((p) => p !== playerId) ? "Ally" : "Player";
    return "Player";
  };

  useEffect(() => {
    socket.on("connect", () => {
      setPlayerId(socket.id ?? "");
      setStatus("Connected");
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected");
    });

    socket.on("sessionCreated", (id: string) => {
      setSessionId(id);
      setStatus(`Session created: ${id}`);
    });

    socket.on("sessionJoined", (id: string) => {
      setSessionId(id);
      setStatus(`Joined session: ${id}`);
    });

    socket.on("joinError", (msg: string) => setStatus(`Join failed: ${msg}`));

    socket.on(
      "sessionReady",
      (data: {
        players: string[];
        currentTurnPlayerId: string;
        playedCards: PlayedCard[];
        playerHealth: { [key: string]: number };
        monsterHealth: number;
      }) => {
        setPlayers(data.players);
        setCurrentTurn(data.currentTurnPlayerId);
        setPlayedCards(data.playedCards);
        setPlayerHealth(data.playerHealth);
        setMonsterHealth(data.monsterHealth);
        setStatus("Session ready!");
        setIsGameStarted(true);
        resetTimer();
      }
    );

    socket.on(
      "updateBattlefield",
      (data: {
        playedCards: PlayedCard[];
        currentTurnPlayerId: string;
        playerHealth: { [key: string]: number };
        monsterHealth: number;
      }) => {
        setPlayedCards(data.playedCards);
        setCurrentTurn(data.currentTurnPlayerId);
        setPlayerHealth(data.playerHealth);
        setMonsterHealth(data.monsterHealth);
        resetTimer();
      }
    );

    socket.on(
      "turnTimeout",
      (data: {
        currentTurnPlayerId: string;
        playerHealth: { [key: string]: number };
        monsterHealth: number;
      }) => {
        setCurrentTurn(data.currentTurnPlayerId);
        setPlayerHealth(data.playerHealth);
        setMonsterHealth(data.monsterHealth);
        resetTimer();
      }
    );

    socket.on("playError", (msg: string) => alert(msg));

    socket.on("gameOver", (data: { winner: string }) => {
      if (data.winner === "players") {
        alert("Players win!");
      } else {
        alert("Monster wins!");
      }
      setSessionId("");
      setIsGameStarted(false);
      setPlayers([]);
      setPlayedCards([]);
      setPlayerHealth({});
      setMonsterHealth(100);
      setCurrentTurn("");
    });

    return () => {
      socket.removeAllListeners();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const createSession = () => socket.emit("createSession");
  const joinSession = () => {
    if (input) socket.emit("joinSession", input);
  };
  const playCard = (type: string, value: number) => {
    if (!sessionId) return;
    socket.emit("playCard", { sessionId, card: { type, value } });
  };

  return (
    <main className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6 flex items-center justify-center">
      {!sessionId && (
        <SessionManager
          input={input}
          setInput={setInput}
          status={status}
          createSession={createSession}
          joinSession={joinSession}
        />
      )}
      {sessionId && !isGameStarted && <WaitingMessage sessionId={sessionId} />}
      {sessionId && isGameStarted && (
        <GameArea
          players={players}
          currentTurn={currentTurn}
          playedCards={playedCards}
          playerHealth={playerHealth}
          monsterHealth={monsterHealth}
          turnTimeLeft={turnTimeLeft}
          playCard={playCard}
          playerId={playerId}
          getPlayerName={getPlayerName}
        />
      )}
    </main>
  );
}