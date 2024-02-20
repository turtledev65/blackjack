import { useContext } from "react";
import { PlayersContext, PlayersContextType } from "../providers/players";

const usePlayers = () => {
  return useContext(PlayersContext) as PlayersContextType;
};

export default usePlayers;
