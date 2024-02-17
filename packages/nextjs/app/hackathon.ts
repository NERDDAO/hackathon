"use client";

import { toast } from "react-hot-toast";
import { AIEvaluation, HackathonEntry, TeamMember, HackathonProjectAttributes, ProgressUpdate } from "~~/types/dbSchema";

export class hackathonEntry {
    address: string;
    _id: string;
    hack: HackathonProjectAttributes;
    progressUpdates: ProgressUpdate[];
    eval: AIEvaluation[];
    teamMembers: TeamMember[];

    constructor(
        address: string,
        projectId: string,
        attributes: Partial<HackathonProjectAttributes>,
        teamMembers?: TeamMember[],
        evals?: AIEvaluation[],
        progressUpdates?: ProgressUpdate[],
    ) {
        this.address = address;
        this._id = projectId;
        this.hack = {
            projectName: attributes.projectName ?? "",
            problemStatement: attributes.problemStatement ?? "",
            solutionDescription: attributes.solutionDescription ?? "",
            technologyStack: attributes.technologyStack ?? [],
            implementationDescription: attributes.implementationDescription ?? "",
        };
        this.teamMembers = teamMembers ?? [],
            this.eval = evals ?? [];
        this.progressUpdates = progressUpdates ?? [];
    }

    // Function to add a member to the project
    addTeamMember(member: TeamMember): void {
        this.teamMembers.push(member);
    }
    // Function to update the coherence score and evaluation remarks
    evaluateProject(aiEval: AIEvaluation): void {
        this.eval.push(aiEval);
    }
    // Function to update the progress score and evaluation remarks
    updateProject(update: ProgressUpdate): void {
        this.progressUpdates.push(update);
    }

    // Get project information
    getProjectInfo(): HackathonEntry {
        return {
            address: this.address,
            _id: this._id,
            hack: this.hack,
            teamMembers: this.teamMembers,
            progressUpdates: this.progressUpdates,
            eval: this.eval
        };
    }
}


export async function createHackathonEntry(hackathonProject: HackathonEntry): Promise<hackathonEntry> {
    // Mimic an asynchronous operation, for example, saving to a database
    const newProject = new hackathonEntry(
        hackathonProject.address,
        hackathonProject._id,
        hackathonProject.hack,
        hackathonProject.teamMembers,
        hackathonProject.eval,
        hackathonProject.progressUpdates);
    const response = await fetch("/api/newHack", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject.getProjectInfo()),
    });
    const parsed: HackathonEntry = await response.json();


    console.log("rawResponse", parsed);

    newProject.evaluateProject(parsed.eval[parsed.eval.length - 1])
    toast.success(`"${parsed} has been created"`); // Include database save operation here if needed
    return newProject;
}

export async function updateHackathonEntry(hackathonProject: HackathonEntry): Promise<hackathonEntry> {
    // Mimic an asynchronous operation, for example, saving to a database
    const newProject = new hackathonEntry(
        hackathonProject.address,
        hackathonProject._id,
        hackathonProject.hack,
        hackathonProject.teamMembers,
        hackathonProject.eval,
        hackathonProject.progressUpdates);
    const response = await fetch("/api/newUpdate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject.getProjectInfo()),
    });
    const parsed: HackathonEntry = await response.json();


    console.log("rawResponse", parsed);

    newProject.evaluateProject(parsed.eval[parsed.eval.length - 1])
    toast.success(`"${parsed} has been created"`); // Include database save operation here if needed
    return newProject;
}


export async function evaluateAndScoreEntry(
    projectId: string,
    coherenceScore: number,
    evaluationRemarks: string,
): Promise<void> {
    // This function would be implemented to find a project by its ID and update its score and evaluations
    // Include database update operation here if needed
}
