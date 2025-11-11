// API Schema Types (matching Swagger)
export interface Language {
  id: number;
  name: string;
}

export interface LanguageLevel {
  id: number;
  level: string;
}

export interface LanguagePriority {
  id: number;
  priority: string;
  default?: boolean;
}

export interface LanguageRequest {
  userLanguageId?: number;
  language?: Language;
  languageLevel?: LanguageLevel;
  priority?: LanguagePriority;
  status?: boolean;
}

export interface UserLanguageRequest {
  userId: number;
  languages: LanguageRequest[];
}

export interface OwnLanguageRequest {
  id?: number;
  userLanguageId?: number;
  language?: Language;
  languageLevel?: LanguageLevel;
  priority?: LanguagePriority;
  status?: boolean;
  deleted?: boolean;
}

export interface OwnLanguagesRequest {
  languages: OwnLanguageRequest[];
}

export interface UserLanguageDTO {
  userId: number;
  languageId: number;
  languageName: string;
  levelId: number;
  levelName: string;
  priorityId: number;
  priorityName: string;
  status: boolean;
}

// Frontend Display Types
export interface UserLanguage {
  id: number;
  language: {
    id: number;
    name: string;
  };
  level: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
  };
  status: boolean;
}

// Form Types
export interface LanguageFormValues {
  languageId: number;
  levelId: number;
  priorityId: number;
  status: boolean;
}
