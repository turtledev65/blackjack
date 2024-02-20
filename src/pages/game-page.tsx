import { useContext } from "react";
import { PlayersContext, PlayersContextType } from "../providers/players";

const GamePage = () => {
  const { players } = useContext(PlayersContext) as PlayersContextType;
  console.log(players);

  return (
    <>
      <p>hello </p>
    </>
  );
};

export default GamePage;
