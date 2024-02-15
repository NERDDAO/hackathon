export type HackathonEntry = {
    address: string;
    projectId: string;
    hack: HackathonProjectAttributes;
    teamMembers: TeamMember[];
    eval: AIEvaluation[];
};

// Team Member
export type TeamMember = {
    name: string;
    email: string;
    role: string;
};

export type HackathonProjectAttributes = {
    projectName: string;
    problemStatement: string;
    solutionDescription: string;
    implementationDescription: string;
    technologyStack: string[];
}

export type AIEvaluation = {
    coherenceScore: number;
    feasabilityScore: number;
    innovationScore: number;
    funScore: number;
    evaluationRemarks: string;
}
