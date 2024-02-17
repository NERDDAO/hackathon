"use client";

// Import necessary hooks and libraries
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { useAccount } from 'wagmi';
import { createHackathonEntry, hackathonEntry } from "~~/app/hackathon"; import { ChartContainer, BarChart } from "@mui/x-charts";
import ChatSection from "./components/chat-section";
import { HackathonEntry, HackathonProjectAttributes, AIEvaluation, TeamMember, ProgressUpdate, CodeEntry } from "~~/types/dbSchema";
import { useSigner } from "~~/utils/wagmi-utils";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
// Define types for your state

const Home: NextPage = () => {
    const { address } = useAccount();

    // Initialize form state with structure expected by your backend
    const [activeTab, setActiveTab] = useState('submit'); // Default to submit tab
    const [db, setDb] = useState<HackathonEntry[]>([])
    const [hackathonProject, setHackathonProject] = useState<HackathonProjectAttributes>({
        projectName: "",
        problemStatement: "",
        solutionDescription: "",
        implementationDescription: "",
        technologyStack: [],
    } as HackathonProjectAttributes)
    const [entry, setEntry] = useState<HackathonEntry>({
        address: address || "",
        _id: "",
        hack: {} as HackathonProjectAttributes,
        teamMembers: [] as TeamMember[],
        eval: [] as AIEvaluation[],
        progressUpdates: [] as ProgressUpdate[],
    });
    const [updateData, setUpdateData] = useState<ProgressUpdate>({
        progress: "",
        wins: "",
        losses: "",
        gamePlan: "",
        actionItems: [],
        code: [] as CodeEntry[],
    });
    const [myProject, setMyProject] = useState<HackathonEntry>({} as HackathonEntry);
    const [techInput, setTechInput] = useState("");
    const [actionInput, setActionInput] = useState("");
    const [teamInput, setTeamInput] = useState("");
    const [teamInputEmail, setTeamInputMail] = useState("");
    const [teamInputRole, setTeamInputRole] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [codeComment, setCodeComment] = useState("");
    const [codeLanguage, setCodeLanguage] = useState("");
    const [evals, setEvals] = useState<AIEvaluation[]>();
    const [evalIndex, setEvalIndex] = useState<number>(0);
    const [entryIndex, setEntryIndex] = useState<number>(0);


    const dbCall = async () => {
        const data = await fetch(`api/mongo?id=${address}`)
        const res: HackathonEntry[] = await data.json()
        setDb(res);
        setEntryIndex(res.length - 1);
        setMyProject(res[res.length - 1]);
        setEvals(res[res.length - 1].eval);
        console.log(res);
    };

    const indexHandler = () => {
        if (db == undefined) return;
        if (entryIndex - 1 >= 0) {
            setEntryIndex(entryIndex - 1);
        } else {
            setEntryIndex(db.length - 1)
        }
        setEntry(db[entryIndex])
        setEvals(db[entryIndex]?.eval)
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
        setMyProject(db[entryIndex])
    }, [entryIndex, db])
    // Handler for text input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEntry({ ...entry, [name]: value });
    };
    const signer = useSigner();
    const account = useAccount();
    const usrAddress = account?.address;

    const Attest = async (hackName: string) => {

        const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
        const schemaUID = "0x3b1be860b499c1c49462c79befd38034914a97ff2e9e1648529106d9b271f65e";
        "0x8d915de0951fc02b7f25f1744f77737e017ffb132057b5debd0c9ec7df2cc343";
        const eas = new EAS(easContractAddress);
        // Signer must be an ethers-like signer.

        if (!signer) return;
        eas.connect(signer);
        // Initialize SchemaEncoder with the schema string
        const offchain = await eas.getOffchain();
        const schemaEncoder = new SchemaEncoder("string hackName");
        const encodedData = schemaEncoder.encodeData([
            { name: "hackName", value: hackName, type: "string" }
        ]);
        const offchainAttestation = await offchain.signOffchainAttestation({
            recipient: usrAddress || "0x",
            // Unix timestamp of when attestation expires. (0 for no expiration)
            expirationTime: BigInt(0),
            // Unix timestamp of current time
            time: BigInt(1671219636),
            revocable: true, // Be aware that if your schema is not revocable, this MUST be false
            nonce: BigInt(0),
            schema: schemaUID,
            refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
            data: encodedData,
        }, signer);

        toast.success("Attesting Hack!");
        const uid = offchainAttestation.uid;

        console.log(uid);
        return uid;
    }

    // Simplified handleSubmit function for demonstration
    const handleSubmit = async () => {
        if (!address) return; // Guard against missing address
        toast.success("Submitting your project");
        try {
            const uid = await Attest(hackathonProject.projectName)
            console.log(uid);

            if (uid == undefined) return;
            entry.address = address;
            entry._id = uid;
            entry.eval = [];
            entry.progressUpdates = [];
            entry.hack = hackathonProject;
            console.log(entry);
            // Validate or prepare data as needed before submission
            const hackEntry: hackathonEntry = await createHackathonEntry(entry);
            const res = hackEntry.getProjectInfo()
            setEntry(res);
            toast(`Project Information: ${JSON.stringify(res)}`);
            console.log(res); address
            toast.success("Hackathon entry submitted successfully");
        } catch (error) {
            toast.error("Submission failed");
            console.error(error);
        }
    };

    const handleSubmitUpdate = async () => {
        if (!address) return; // Guard against missing address
        toast.success("Submitting your update");
        try {
            // Validate or prepare data as needed before submission
            entry.progressUpdates?.push(updateData);
            const hackEntry: hackathonEntry = await createHackathonEntry(entry);
            const res = hackEntry.getProjectInfo()
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
        setEntry({
            ...entry,
            teamMembers: [...entry.teamMembers, newMember],
        });
        setTeamInput("");
        setTeamInputMail("");
        setTeamInputRole(""); // Reset input
    };

    // Handler for text input changes
    const handleProgressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateData({ ...updateData, [name]: value });
    };
    // Handlers for tech stack and team members
    const handleAddActionItems = () => {
        if (!actionInput) return; // Prevent adding empty values
        setUpdateData({
            ...updateData,
            actionItems: [...updateData.actionItems, actionInput],
        });
        setActionInput(""); // Reset input
    };
    // ProjectDetails.js
    const handleAddCode = () => {
        if (!codeInput) return; // Similar guard
        const newCode = { code: codeInput, comment: codeComment, language: codeLanguage }; // Simplify for demonstration
        setUpdateData({
            ...updateData,
            code: [...updateData.code, newCode],
        });
        setCodeInput("");
        setCodeComment("");
        setCodeLanguage(""); // Reset input
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
    //
    const renderTabContent = () => {
        switch (activeTab) {
            case 'submit':
                return renderSubmitTab();
            case 'update':
                return renderUpdateTab();
            case 'browse':
                return renderBrowseTab();
            default:
                return <div>Invalid tab</div>;
        }
    };
    const renderSubmitTab = () => {
        return (
            <div
                className={"flex flex-row w-1/2 p-6"}
            >
                <div className={"flex flex-col"}>
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
                    <input
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        className={"text-black"}
                        placeholder="Add Technology"
                    />

                    <button onClick={handleAddTech}>Add Tech</button><br />

                </div>
                {/* Tech Input */}

                <div className={"flex flex-col"}>
                    ADD TEAM MEMBERS<br />
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
            </div>
        );
    };

    const renderUpdateTab = () => {
        return (
            <div
                className={"flex flex-row w-1/2 p-6"}
            >
                <div className={"flex flex-col"}>
                    PROGRESS UPDATE<br />
                    <input
                        name="progress"
                        onChange={handleProgressUpdate}
                        placeholder="Progress Update"
                        className={"text-black"}
                        value={updateData.progress}
                    />
                    <input
                        name="wins"
                        onChange={handleProgressUpdate}
                        placeholder="Ws"
                        className={"text-black"}
                        value={updateData.wins}
                    />
                    <input
                        name="losses"
                        onChange={handleProgressUpdate}
                        placeholder="Ls"
                        className={"text-black"}
                        value={updateData.losses}
                    />
                    <input
                        name="gamePlan"
                        onChange={handleProgressUpdate}
                        placeholder="Game Plan"
                        className={"text-black"}
                        value={updateData.gamePlan}
                    />

                    {/* Include other inputs similarly */}
                    <input
                        value={actionInput}
                        onChange={e => setActionInput(e.target.value)}
                        className={"text-black"}
                        placeholder="Add Action Items"
                    />

                    <button onClick={handleAddActionItems}>New Item</button><br />

                </div>
                {/* Tech Input */}

                <div className={"flex flex-col"}>
                    ADD TECH UPDATE<br />
                    <input
                        value={codeInput}
                        onChange={e => setCodeInput(e.target.value)}
                        className={"text-black"}
                        placeholder="Add Code"
                    />
                    <input
                        value={codeComment}
                        onChange={e => setCodeComment(e.target.value)}
                        className={"text-black"}
                        placeholder="Comments"
                    />
                    <input
                        value={codeLanguage}
                        onChange={e => setCodeLanguage(e.target.value)}
                        className={"text-black"}
                        placeholder="Language"
                    />
                    <button onClick={handleAddCode}>Add Code</button>
                    <br />
                    {/* Submit Button */}
                    <button className={"border-2 text-xl"} onClick={handleSubmitUpdate}>
                        Submit
                    </button>
                </div>
            </div>
        );
    };

    const renderBrowseTab = () => {
        return (
            <div>
                {/* Contents for browsing the database */}
            </div>
        );
    };
    // Then use this in your return statement to dynamically show the content

    const ProjectDetails = ({ entry, evalIndex }: { entry: any, evalIndex: number }) =>

    (
        <div
            className={"text-justify items-left p-6 flex flex-row h-800 w-full"}
        >
            <div
                className={"flex flex-col w-full"}
            >
                <span className={"text-2xl font-bold"}><strong>
                    Project Details:<br /><button onClick={() => indexHandler()}>Next Entry</button><br />
                    {entry?.hack?.projectName}</strong></span>
                <ul>
                    <li>Description: <strong>{entry?.hack?.problemStatement}</strong></li>
                    <li>Solution: <strong> {entry?.hack?.solutionDescription}</strong></li>
                    <li>Implementation: <strong> {entry?.hack?.implementationDescription}</strong></li>
                    <ul>
                        Technology Stack: {entry?.hack?.technologyStack?.map((tech: string, i: number) => (
                            <li key={i}><strong>{tech}</strong></li>
                        ))}
                    </ul>
                </ul>

                <EvaluationDetails entry={entry} evalIndex={evalIndex} />


            </div>


        </div>
    )


    // EvaluationDetails.js
    const EvaluationDetails = ({ entry, evalIndex }: { entry: any, evalIndex: number }) => {
        const xLabels = [
            'Coherence',
            'Feasibility',
            'Innovation',
            'Fun',
        ];
        const uData = [
            entry?.eval[evalIndex]?.coherenceScore,
            entry?.eval[evalIndex]?.feasabilityScore,
            entry?.eval[evalIndex]?.innovationScore,
            entry?.eval[evalIndex]?.funScore
        ];
        return (
            <ul
                className={"relative border-4 -backdrop-hue-rotate-180 p-20 overflow-auto"}
            >
                <div
                    className={"ml-20"}>
                    <BarChart
                        className={"ml-12"}
                        width={500}
                        height={300}
                        series={[{ data: uData, label: 'AIscore', type: 'bar' }]}
                        yAxis={[{ scaleType: 'band', data: xLabels }]}
                        xAxis={[{ min: 0, max: 10 }]}
                        layout="horizontal"
                    >
                    </BarChart>
                </div >
                <li>Evaluation Comments: {entry?.eval[evalIndex]?.evaluationRemarks}</li>
                <li>Fun Score: {entry?.eval[evalIndex]?.funScore}</li>
                <li>Innovation Score: {entry?.eval[evalIndex]?.innovationScore}</li>
                <li>Feasibility: {entry?.eval[evalIndex]?.feasabilityScore}</li>
                <li>Coherence Score: {entry?.eval[evalIndex]?.coherenceScore}</li>

            </ul>
        )
    };

    // Render form (simplified for demonstration)
    return (


        <div className={"relative top-0 h-[700px] w-full border-2 -backdrop-hue-rotate-0 flex flex-row"}>

            <ProjectDetails entry={entry} evalIndex={evalIndex} />
            <div className={"flex flex-col"}>


                <div className={"p-6 space-x-2 bg-black text-white"}>
                    <button className={"border-2 cursor-pointer"} onClick={() => setActiveTab('submit')}>Submit Project</button>
                    <button onClick={() => setActiveTab('update')}>Update Project</button>
                    <button onClick={() => setActiveTab('browse')}>Browse Database</button>
                </div>


                {renderTabContent()}

                <div className={"flex flex-col w-full"}>

                    <ChatSection />


                </div>


            </div>
        </div>
    );
};

export default Home;
