"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { createHackathonEntry } from "~~/app/hackathon";
import { HackathonEntry } from "~~/types/dbSchema";

const Home: NextPage = () => {
  const account = useAccount();
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [hackathonEntries, setHackathonEntries] = useState<HackathonEntry[]>([]);
  const dummy = {} as HackathonEntry;

  const hack = async () => {
    const hck = await createHackathonEntry(dummy);
    console.log(hck);
  };

  hack();

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
