"use client";

import { toast } from "react-hot-toast";
import { HackathonEntry, TeamMember } from "~~/types/dbSchema";
import { useGlobalState } from "~~/services/store/store"

interface HackathonProjectAttributes {
    projectName: string;
    problemStatement: string;
    solutionDescription: string;
    implementationDescription: string;
    technologyStack: string[];
    teamMembers: TeamMember[];
}

export class hackathonEntry {
    projectId: string;
    attributes: HackathonProjectAttributes;
    coherenceScore: number;
    evaluationRemarks: string;

    constructor(
        projectId: string,
        attributes: Partial<HackathonProjectAttributes>,
        coherenceScore = 0,
        evaluationRemarks = "",
    ) {
        this.projectId = projectId;
        this.attributes = {
            projectName: attributes.projectName ?? "",
            problemStatement: attributes.problemStatement ?? "",
            solutionDescription: attributes.solutionDescription ?? "",
            technologyStack: attributes.technologyStack ?? [],
            teamMembers: attributes.teamMembers ?? [],
            implementationDescription: attributes.implementationDescription ?? "",
        };
        this.coherenceScore = coherenceScore;
        this.evaluationRemarks = evaluationRemarks;
    }

    // Function to add a member to the project
    addTeamMember(member: TeamMember): void {
        this.attributes.teamMembers.push(member);
    }

    // Function to update the coherence score and evaluation remarks
    evaluateProject(coherenceScore: number, evaluationRemarks: string): void {
        this.coherenceScore = coherenceScore;
        this.evaluationRemarks = evaluationRemarks;
    }

    // Get project information
    getProjectInfo(): HackathonEntry {
        return {
            projectId: this.projectId,
            projectName: this.attributes.projectName,
            problemStatement: this.attributes.problemStatement,
            solutionDescription: this.attributes.solutionDescription,
            technologyStack: this.attributes.technologyStack,
            teamMembers: this.attributes.teamMembers,
            coherenceScore: this.coherenceScore,
            evaluationRemarks: this.evaluationRemarks,
            implementationDescription: this.attributes.implementationDescription,
        };
    }
}


export async function createHackathonEntry(projectData: Partial<HackathonProjectAttributes>): Promise<hackathonEntry> {
    // Mimic an asynchronous operation, for example, saving to a database
    const projectId = Math.random().toString(36).substring(2); // Generate a simple unique identifier
    const newProject = new hackathonEntry(projectId, projectData);
    const response = await fetch("/api/newHack", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject.getProjectInfo()),
    });
    const r = await response.json();


    console.log("rawResponse", r);
    const parsed: HackathonEntry = JSON.parse(r);
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
