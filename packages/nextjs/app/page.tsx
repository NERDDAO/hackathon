"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const account = useAccount();
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");

  return (
    <>
      <div>
        account:{account.address}
        <input onChange={e => setProblem(e.target.value)} className={"text-black"}></input>
        <input onChange={e => setSolution(e.target.value)} className={"text-black"}></input>
        <button onClick={() => toast.success(solution + problem)} className={"border-2 h-12 w-12"}>
          <MagnifyingGlassIcon />
        </button>
      </div>
    </>
  );
};

export default Home;
