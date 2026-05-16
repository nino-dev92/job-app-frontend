import "../styles/spinner.css";

const Spinner = () => {
  return (
    <div className="flex-col justify-items-center content-center min-h-screen m-auto items-center">
      <h1 className="text-2xl">Loading...</h1>
      <div className="circle flex "></div>
    </div>
  );
};

export default Spinner;
