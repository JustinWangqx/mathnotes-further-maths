import data from './question-types.json';
import translations from './question-types.zh.json';

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

const originalTypes: Record<string, QuestionType[]> = data;
const localizedTypes: Record<string, Pick<QuestionType, 'title' | 'method' | 'question' | 'steps' | 'answer'>[]> = translations;
export const questionTypes = Object.fromEntries(
  Object.entries(originalTypes).map(([topic, types]) => [topic, types.map((type, index) => {
    const translation = localizedTypes[topic]?.[index];
    if (!translation) throw new Error('Missing Chinese translation for ' + topic + '/' + type.id);
    return { ...type, ...translation };
  })]),
);
export const totalTypes = Object.values(questionTypes).reduce((sum, types) => sum + types.length, 0);
