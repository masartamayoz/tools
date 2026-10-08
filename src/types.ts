export type CategoryKey =
  | 'all'
  | 'organize'
  | 'optimize'
  | 'to-pdf'
  | 'from-pdf'
  | 'edit'
  | 'security'
  | 'images'
  | 'edu'
  | 'archive'
  | 'contact';

export interface CategoryInfo {
  id: CategoryKey;
  slug: string;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
}

export interface ToolItem {
  id: string;
  slug: string; // e.g. '/pdf/merge'
  title: string;
  shortTitle?: string;
  description: string;
  category: CategoryKey;
  icon: string;
  badge?: string;
  isUpcoming?: boolean;
  upcomingMessage?: string;
  keywords?: string[];
  maxFiles?: number;
}

export interface ArchivedResource {
  id: string;
  title: string;
  category: 'exams' | 'academy' | 'books' | 'tools' | 'videos';
  targetAudience: string;
  description: string;
  url: string;
  badge?: string;
  features: string[];
  isExternal: boolean;
  internalToolId?: string;
}

// Math Tools data definitions
export interface MultiplicationQuestion {
  num1: number;
  num2: number;
  answer: number;
  userAnswer?: string;
}

export interface UnitCategory {
  id: string;
  name: string;
  units: { name: string; symbol: string; factor: number; offset?: number }[];
}

export interface QuestionTemplate {
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}
