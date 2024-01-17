import Card from "./components/card";

function App() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center gap-2">
        <Card value={5} type="clubs" />
        <Card value={11} type="spades" />
        <Card value={12} type="clubs" />
        <Card value={13} type="diamonds" />
        <Card value={14} type="hearts" />
      </div>
    </>
  );
}

export default App;
