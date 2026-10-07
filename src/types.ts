export type CategoryId = 'all' | 'pdf' | 'image' | 'math' | 'exam' | 'archive' | 'contact';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: Exclude<CategoryId, 'all' | 'contact' | 'archive'>;
  icon: string;
  badge?: string;
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
