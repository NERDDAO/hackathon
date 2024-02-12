export type HackathonEntry = {
  projectId: string;
  projectName: string;
  problemStatement: string;
  solutionDescription: string;
  technologyStack: string[];
  teamMembers: TeamMember[];
  coherenceScore: number;
  evaluationRemarks: string;
};

// Team Member
type TeamMember = {
  name: string;
  email: string;
  role: string;
};
