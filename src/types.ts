export type CategoryId = 'all' | 'pdf' | 'image' | 'math' | 'exam' | 'contact';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: Exclude<CategoryId, 'all' | 'contact'>;
  icon: string;
  badge?: string;
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
