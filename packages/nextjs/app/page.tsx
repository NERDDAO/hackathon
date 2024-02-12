import type { NextPage } from "next";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <div>
        <form>
          <input></input>
          <button>
            <MagnifyingGlassIcon />
          </button>
        </form>
      </div>
    </>
  );
};

export default Home;
