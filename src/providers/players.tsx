import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState
} from "react";
import { IPlayer } from "../types";

export const PlayersProvider = ({ children }: PropsWithChildren) => {
  const [players, setPlayers] = useState<IPlayer[]>([]);

  return (
    <PlayersContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};

export type PlayersContextType = {
  players: IPlayer[];
  setPlayers: Dispatch<SetStateAction<IPlayer[]>>;
};

export const PlayersContext = createContext<PlayersContextType | null>(null);
