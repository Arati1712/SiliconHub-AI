export type SubjectType = 'DEMP' | 'VLSI' | 'SS';

export interface SubjectModule {
  id: string;
  type: SubjectType;
  title: string;
  topic: string;
  content: string;
  icon: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  logic: string;
}

export interface IndustryUpdate {
  title: string;
  date: string;
  source: string;
  summary: string;
}
