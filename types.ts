export enum AppStage {
  INPUT = 'INPUT',
  GENERATING = 'GENERATING',
  SELECTION = 'SELECTION',
  BLUEPRINT = 'BLUEPRINT',
}

export interface UserProfile {
  skills: string;
  interests: string;
  values: string;
  industryPreference: string;
  wildcard: string; // "I want to work with animals but in space"
}

export interface GeneratedRole {
  id: string;
  title: string;
  tagline: string;
  description: string;
  salaryRange: string;
  demandScore: number; // 1-10
  skillsMatch: string[];
  innovativeFactor: string;
}

export interface BlueprintSection {
  title: string;
  content: string;
}

export interface Blueprint {
  roleId: string;
  sections: BlueprintSection[];
}