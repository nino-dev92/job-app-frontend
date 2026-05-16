import { Link } from "react-router-dom";
const Error = () => {
  return (
    <main className="flex-col text-center bg-black min-h-screen">
      <h1 className="text-2xl text-red-500">Page Not Found</h1>
      <br />
      <Link to="/" className="text-white underline">
        Back Home
      </Link>
    </main>
  );
};

export default Error;
