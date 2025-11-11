// API Schema Types (matching Swagger)
export interface Skill {
  id: number;
  name: string;
  status?: boolean;
  default?: boolean;
}

export interface SkillLevel {
  id: number;
  name: string;
  default?: boolean;
}

export interface SkillRequest {
  userSkillId?: number;
  skill?: Skill;
  skillLevel?: SkillLevel;
  status?: boolean;
}

export interface UserSkillRequest {
  userId: number;
  skills: SkillRequest[];
}

export interface OwnSkillRequest {
  id?: number;
  userSkillId?: number;
  skill?: Skill;
  skillLevel?: SkillLevel;
  status?: boolean;
  deleted?: boolean;
}

export interface OwnSkillsRequest {
  skills: OwnSkillRequest[];
}

export interface UserSkillDTO {
  userId: number;
  skillId: number;
  skillName: string;
  levelId: number;
  levelName: string;
  status: boolean;
}

// Frontend Display Types
export interface UserSkill {
  id: number;
  skill: {
    id: number;
    name: string;
  };
  level: {
    id: number;
    name: string;
  };
  status: boolean;
}

// Form Types
export interface SkillFormValues {
  skillId: number;
  levelId: number;
  status: boolean;
}
