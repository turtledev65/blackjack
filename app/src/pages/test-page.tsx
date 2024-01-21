import CardContainer from "../components/card-container";

const TestPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <CardContainer
        cards={[
          { value: 10, type: "hearts" },
          { value: 10, type: "hearts" },
          { value: 10, type: "hearts" },
          { value: 10, type: "hearts" }
        ]}
      />
    </div>
  );
};

export default TestPage;
