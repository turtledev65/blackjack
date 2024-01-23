import { useParams } from "react-router-dom";

const GamePage = () => {
  const { name } = useParams();

  return <div>Game: {name}</div>;
};

export default GamePage;
