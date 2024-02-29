export type HackathonEntry = {
    address: string;
    _id: string;
    hack: HackathonProjectAttributes;
    teamMembers: TeamMember[];
    eval: AIEvaluation[];
    progressUpdates: ProgressUpdate[];
};

// Team Member
export type TeamMember = {
    name: string;
    email: string;
    role: string;
};

export type CodeEntry = {
    code: string;
    comment: string;
    language: string;
};

export type ProgressUpdate = {
    progress: string;
    wins: string;
    losses: string;
    gamePlan: string;
    actionItems: string[];
    codeSnippets: CodeEntry[];
};

export type HackathonProjectAttributes = {
    projectName: string;
    problemStatement: string;
    solutionDescription: string;
    implementationDescription: string;
    technologyStack: string[];
};

export type AIEvaluation = {
    coherenceScore: number;
    feasibilityScore: number;
    innovationScore: number;
    funScore: number;
    evaluationRemarks: string;
    codeSnippets: CodeEntry[];
}
