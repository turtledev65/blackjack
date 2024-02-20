import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState
} from "react";
import Player from "../backend/game/player";

export const PlayersProvider = ({ children }: PropsWithChildren) => {
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <PlayersContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};

export type PlayersContextType = {
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
};

export const PlayersContext = createContext<PlayersContextType | null>(null);
