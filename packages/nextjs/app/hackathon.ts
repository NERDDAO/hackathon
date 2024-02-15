"use client";

import { toast } from "react-hot-toast";
import { AIEvaluation, HackathonEntry, TeamMember, HackathonProjectAttributes } from "~~/types/dbSchema";

export class hackathonEntry {
    address: string;
    projectId: string;
    hack: HackathonProjectAttributes;
    evals: AIEvaluation[];
    teamMembers: TeamMember[];

    constructor(
        address: string,
        projectId: string,
        attributes: Partial<HackathonProjectAttributes>,
        teamMembers?: TeamMember[],
    ) {
        this.address = address;
        this.projectId = projectId;
        this.hack = {
            projectName: attributes.projectName ?? "",
            problemStatement: attributes.problemStatement ?? "",
            solutionDescription: attributes.solutionDescription ?? "",
            technologyStack: attributes.technologyStack ?? [],
            implementationDescription: attributes.implementationDescription ?? "",
        };
        this.teamMembers = teamMembers ?? [],
            this.evals = [];
    }

    // Function to add a member to the project
    addTeamMember(member: TeamMember): void {
        this.teamMembers.push(member);
    }

    // Function to update the coherence score and evaluation remarks
    evaluateProject(aiEval: AIEvaluation): void {
        this.evals.push(aiEval);
    }

    // Get project information
    getProjectInfo(): HackathonEntry {
        return {
            address: this.address,
            projectId: this.projectId,
            hack: this.hack,
            teamMembers: this.teamMembers,
            evals: this.evals
        };
    }
}


export async function createHackathonEntry(address: string, projectData: Partial<HackathonProjectAttributes>, teamMembers?: TeamMember[]): Promise<hackathonEntry> {
    // Mimic an asynchronous operation, for example, saving to a database
    const projectId = Math.random().toString(36).substring(2); // Generate a simple unique identifier
    const newProject = new hackathonEntry(address, projectId, projectData, teamMembers);
    const response = await fetch("/api/newHack", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject.getProjectInfo()),
    });
    const r = await response.json();


    console.log("rawResponse", r);
    const parsed: AIEvaluation = JSON.parse(r);
    newProject.evaluateProject(parsed)
    toast.success(`"${parsed} has been created"`); // Include database save operation here if needed
    return newProject;
}

export async function addTeamMemberToEntry(projectId: string, member: TeamMember): Promise<void> {
    // This function would be implemented to find a project by its ID and then add a team member
    // Include database update operation here if needed
}

export async function evaluateAndScoreEntry(
    projectId: string,
    coherenceScore: number,
    evaluationRemarks: string,
): Promise<void> {
    // This function would be implemented to find a project by its ID and update its score and evaluations
    // Include database update operation here if needed
}
