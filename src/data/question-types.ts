import data from './question-types.json';

export interface QuestionType {
  number: number;
  id: string;
  title: string;
  method: string;
  formula: string;
  question: string;
  steps: string[];
  answer: string;
  diagram?: string;
  source: {file: string; pages: string; label: string; kind: string};
}

export const questionTypes = data as Record<string, QuestionType[]>;
export const totalTypes = Object.values(questionTypes).reduce((sum, types) => sum + types.length, 0);
