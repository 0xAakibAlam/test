export interface Question {
  questionId: string,
  questionTitle: string,
  question: string,
  owner: string,
  endTime: string,
  sentToHeaven: boolean,
}

export interface Answer {
  questionId: string;
  answerId: string;
  answer: string;
  owner: string;
}

export interface WalletState {
  address: string;
  isConnected: boolean;
}