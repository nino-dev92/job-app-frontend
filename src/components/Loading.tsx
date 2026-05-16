import "../styles/loader.css";

const Loading = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <p className="text-2xl">Loading...</p>
      <div className="loader">
        <div className="loader-inner"></div>
      </div>
    </div>
  );
};

export default Loading;
