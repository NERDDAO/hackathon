"use client";

// Import necessary hooks and libraries
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { useAccount } from 'wagmi';
import { createHackathonEntry, hackathonEntry } from "~~/app/hackathon";
import ChatSection from "./components/chat-section";
import { HackathonEntry, HackathonProjectAttributes, AIEvaluation, TeamMember } from "~~/types/dbSchema";
// Define types for your state

const Home: NextPage = () => {
    const { address } = useAccount();

    // Initialize form state with structure expected by your backend
    const [db, setDb] = useState<HackathonEntry[]>([])
    const [hackathonProject, setHackathonProject] = useState<HackathonProjectAttributes>({
        projectName: "",
        problemStatement: "",
        solutionDescription: "",
        implementationDescription: "",
        technologyStack: [],
    } as HackathonProjectAttributes)
    const [formData, setFormData] = useState<HackathonEntry>({
        address: address || "",
        projectId: "",
        hack: hackathonProject,
        teamMembers: [] as TeamMember[],
        eval: [] as AIEvaluation[],
    });
    const [techInput, setTechInput] = useState("");
    const [teamInput, setTeamInput] = useState("");
    const [teamInputEmail, setTeamInputMail] = useState("");
    const [teamInputRole, setTeamInputRole] = useState("");
    const [entry, setEntry] = useState<HackathonEntry>();
    const [evals, setEvals] = useState<AIEvaluation[]>();
    const [evalIndex, setEvalIndex] = useState<number>(0);
    const [entryIndex, setEntryIndex] = useState<number>(0);


    const dbCall = async () => {
        const data = await fetch(`api/mongo?id=${address}`)
        const res: HackathonEntry[] = await data.json()
        setDb(res);
        setEntryIndex(res.length - 1);
        setEntry(res[res.length - 1]);
        setEvals(res[res.length - 1].eval);
        console.log(data, res, entryIndex, entry);
    };

    const indexHandler = () => {
        if (db == undefined) return;
        if (entryIndex - 1 >= 0) {
            setEntryIndex(entryIndex - 1);
        } else {
            setEntryIndex(db.length - 1)
        }
        setEntry(db[entryIndex])
        setEvals(db[entryIndex].eval)
        toast.success(`Entry Index: ${entryIndex}`)
    }


    const evalHandler = () => {
        if (evals == undefined) return;
        if (evalIndex - 1 >= 0) {
            setEvalIndex(evalIndex - 1);
        } else {
            setEvalIndex(evals.length - 1)
        }
        toast.success(`Eval Index: ${evalIndex}`)
    }
    useEffect(() => {
        if (address == null) return
        dbCall()
    }, [address])

    useEffect(() => {
        if (db == null) return
        setEntry(db[entryIndex])
    }, [entryIndex, db])
    // Handler for text input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    // Simplified handleSubmit function for demonstration
    const handleSubmit = async () => {
        if (!address) return; // Guard against missing address
        toast.success("Submitting your project");
        try {
            // Validate or prepare data as needed before submission
            const entry: hackathonEntry = await createHackathonEntry(address, hackathonProject, formData.teamMembers);
            const res = entry.getProjectInfo()
            setEntry(res);
            toast(`Project Information: ${JSON.stringify(res)}`);
            console.log(res);
            toast.success("Hackathon entry submitted successfully");
        } catch (error) {
            toast.error("Submission failed");
            console.error(error);
        }
    };

    const handleAddTeamMember = () => {
        if (!teamInput) return; // Similar guard
        const newMember = { name: teamInput, email: teamInputEmail, role: teamInputRole }; // Simplify for demonstration
        setFormData({
            ...formData,
            teamMembers: [...formData.teamMembers, newMember],
        });
        setTeamInput("");
        setTeamInputMail("");
        setTeamInputRole(""); // Reset input
    };

    // Handler for text input changes
    const handleHackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHackathonProject({ ...hackathonProject, [name]: value });
    };
    // Handlers for tech stack and team members
    const handleAddTech = () => {
        if (!techInput) return; // Prevent adding empty values
        setHackathonProject({
            ...hackathonProject,
            technologyStack: [...hackathonProject.technologyStack, techInput],
        });
        setTechInput(""); // Reset input
    };
    // ProjectDetails.js
    // ProjectDetails.js
    const ProjectDetails = ({ entry, evalIndex }: { entry: any, evalIndex: number }) => (
        <div>
            <span>ProjectName: {entry?.hack?.projectName}</span>
            <ul>
                <li>Project Description: {entry?.hack?.problemStatement}</li>
                <li>Solution: {entry?.hack?.solutionDescription}</li>
                <li>Implementation: {entry?.hack?.implementationDescription}</li>
                <ul>
                    Technology Stack: {entry?.hack?.technologyStack.map((tech: string, i: number) => (
                        <li key={i}>{tech}</li>
                    ))}
                </ul>
            </ul>
            <EvaluationDetails entry={entry} evalIndex={evalIndex} />
        </div>
    );

    // EvaluationDetails.js
    const EvaluationDetails = ({ entry, evalIndex }: { entry: any, evalIndex: number }) => (
        <ul>
            <li>Evaluation Comments: {entry?.eval[evalIndex]?.evaluationRemarks}</li>
            <li>Fun Score: {entry?.eval[evalIndex]?.funScore}</li>
            <li>Innovation Score: {entry?.eval[evalIndex]?.innovationScore}</li>
            <li>Feasibility: {entry?.eval[evalIndex]?.feasabilityScore}</li>
            <li>Coherence Score: {entry?.eval[evalIndex]?.coherenceScore}</li>
        </ul>
    );

    // Render form (simplified for demonstration)
    return (


        <div className={"relative top-20 left-1/4 h-[700px] w-[1200px] border-2 -backdrop-hue-rotate-0 flex flex-row"}>
            <div className={"flex-col"}>

                <ProjectDetails entry={entry} evalIndex={evalIndex} />
                <div>
                    SUBMIT YOUR PROJECT<br />
                    <input
                        name="projectName"
                        onChange={handleHackChange}
                        placeholder="Project Name"
                        className={"text-black"}
                        value={hackathonProject.projectName}
                    />
                    <input
                        name="problemStatement"
                        onChange={handleHackChange}
                        placeholder="Problem Statement"
                        className={"text-black"}
                        value={hackathonProject.problemStatement}
                    />
                    <input
                        name="solutionDescription"
                        onChange={handleHackChange}
                        placeholder="Solution"
                        className={"text-black"}
                        value={hackathonProject.solutionDescription}
                    />
                    <input
                        name="implementationDescription"
                        onChange={handleHackChange}
                        placeholder="implementationDescription"
                        className={"text-black"}
                        value={hackathonProject.implementationDescription}
                    />
                    {/* Include other inputs similarly */}

                    {/* Tech Input */}
                    <input
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        className={"text-black"}
                        placeholder="Add Technology"
                    />

                    <button onClick={handleAddTech}>Add Tech</button><br />

                    {/* Team Member Input */}
                    <input
                        value={teamInput}
                        onChange={e => setTeamInput(e.target.value)}
                        className={"text-black"}
                        placeholder="Add Team Member Name"
                    />
                    <input
                        value={teamInputEmail}
                        onChange={e => setTeamInputMail(e.target.value)}
                        className={"text-black"}
                        placeholder="Add Team Member Email"
                    />
                    <input
                        value={teamInputRole}
                        onChange={e => setTeamInputRole(e.target.value)}
                        className={"text-black"}
                        placeholder="Add Team Member Role"
                    />
                    <button onClick={handleAddTeamMember}>Add Member</button>
                    <br />
                    {/* Submit Button */}
                    <button className={"border-2 text-xl"} onClick={handleSubmit}>
                        Submit
                    </button>

                </div>

                <div className={"flex-col"}>
                    <ChatSection />
                </div>
            </div>
        </div>
    );
};

export default Home;
