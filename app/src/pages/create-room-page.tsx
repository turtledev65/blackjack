const CreateRoomPage = () => {
  return (
    <form className="flex min-h-screen flex-col items-center justify-center gap-6 text-xl text-white">
      <div className="space-x-2">
        <label className="text-2xl" htmlFor="name">
          Name:
        </label>
        <input
          className="border-b-2 bg-transparent outline-none"
          id="name"
          type="text"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-500 px-2 py-3 font-bold hover:bg-blue-600"
      >
        Create Room
      </button>
    </form>
  );
};

export default CreateRoomPage;
