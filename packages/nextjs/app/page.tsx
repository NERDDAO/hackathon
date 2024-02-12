"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { createHackathonEntry } from "~~/app/hackathon";
import { TeamMember } from "~~/types/dbSchema";

interface InputField {
  name: string;
  placeholder: string;
  type: string;
}

const inputFields: InputField[] = [
  { name: "projectName", placeholder: "Project Name", type: "text" },
  { name: "problemStatement", placeholder: "Problem Statement", type: "text" },
  { name: "solutionDescription", placeholder: "Solution Description", type: "text" },
  { name: "implementationDescription", placeholder: "Implementation Description", type: "text" },
  // Add more input fields as necessary. For arrays, you might need a different approach as shown below.
];

const Home: NextPage = () => {
  const account = useAccount();
  const [formData, setFormData] = useState({
    projectName: "",
    problemStatement: "",
    solutionDescription: "",
    implementationDescription: "",
    technologyStack: [],
    teamMembers: [],
    coherenceScore: 0,
    evaluationRemarks: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (key !== "technologyStack" && key !== "teamMembers") {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    try {
      await createHackathonEntry(formData as any); // Assuming createHackathonEntry can handle this modified formData.
      toast.success("Hackathon entry created successfully!");
      // Optionally display the project info in a toast notification
      toast(`Project Information: Name - ${formData.projectName}, Problem Statement - ${formData.problemStatement}`);
    } catch (error) {
      toast.error("Failed to create hackathon entry.");
      console.error(error);
    }
  };

  return (
    <>
      <div>Account: {account.address}</div>
      {inputFields.map(field => (
        <div key={field.name}>
          <input
            name={field.name}
            placeholder={field.placeholder}
            type={field.type}
            onChange={e => handleChange(e as React.ChangeEvent<HTMLInputElement>, field.name)}
            className={"text-black"}
          />
        </div>
      ))}
      {/* Handle arrays like technologyStack and teamMembers differently */}
      {/* Example for technologyStack & teamMembers not included for brevity */}
      <button onClick={handleSubmit} className={"border-2 h-12 w-full mt-4"}>
        Submit
      </button>
    </>
  );
};

export default Home;
