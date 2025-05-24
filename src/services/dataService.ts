import { Question, Answer } from "@/types";
import { masterAnonqaAddress, masterAnonqaABI } from "@/contracts/MasterAnonqa";
import { ethers } from "ethers";

async function getContract(contractAddress, contractABI) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
  return contractInstance;
}

// Question service functions
export const getActiveQuestions = async (): Promise<Question[]> => {
  try {
    console.log("getting contract...");
    const masterAnonqa = await getContract(masterAnonqaAddress, masterAnonqaABI);
    console.log("contract fetched...");
    const numOfQuestion = await masterAnonqa.totalQuestions();
    console.log("total questions: ", numOfQuestion);

    let questionInfos: any = [];
    for (let i=0; i<numOfQuestion; i++) {
      const questionId = await masterAnonqa.questionIds(i);
      console.log("Raw questionId:", questionId);
      
      const questionInfo = await masterAnonqa.getQuestionInfo(questionId);
      if (!questionInfo.sentToHeaven) {
        questionInfos.push(questionInfo);
      }
    }
    
    return questionInfos.map(q => ({
      questionId: q.questionId,
      owner: q.owner,
      questionTitle: q.questionTitle,
      question: q.question,
      endTime: q.endTime,
      sentToHeaven: q.sentToHeaven
    }));
  } catch (error) {
    console.error("Error in getQuestions:", error);
    // Fallback to return an empty array if there's an error
    return [];
  }
};

export const getQuestionById = async (id: string): Promise<Question | undefined> => {
  try {
    const masterAnonqa = await getContract(masterAnonqaAddress, masterAnonqaABI);
    const questionInfo = await masterAnonqa.getQuestionInfo(id);
    
    return {
      questionId: questionInfo.questionId,
      questionTitle: questionInfo.questionTitle,
      question: questionInfo.question,
      owner: questionInfo.owner,
      endTime: questionInfo.endTime,
      sentToHeaven: questionInfo.sentToHeaven,
    };
  } catch (error) {
    console.error("Error in getQuestionById:", error);
    return undefined;
  }
};

export const getUserQuestions = async (owner: string): Promise<Question[]> => {
  try {
    const masterAnonqa = await getContract(masterAnonqaAddress, masterAnonqaABI);
    const numOfQuestion = await masterAnonqa.totalQuestions();
    console.log(numOfQuestion);

    let questionInfos: any = [];
    for (let i=0; i<numOfQuestion; i++) {
      const questionId = await masterAnonqa.questionIds(i);
      const questionInfo = await masterAnonqa.getQuestionInfo(questionId);
      if (questionInfo.owner.toLowerCase() == owner.toLowerCase()) {
        questionInfos.push(questionInfo);
      }
    }
    
    return questionInfos.map(q => ({
      questionId: q.questionId,
      owner: q.owner,
      questionTitle: q.questionTitle,
      question: q.question,
      endTime: q.endTime,
      sentToHeaven: q.sentToHeaven,
    }));
  } catch (error) {
    console.error("Error in getUserQuestions:", error);
    return [];
  }
};

export const getArchivedQuestions = async (): Promise<Question[]> => {
  try {
    const masterAnonqa = await getContract(masterAnonqaAddress, masterAnonqaABI);
    const numOfQuestion = await masterAnonqa.totalQuestions();
    console.log(numOfQuestion);

    let questionInfos: any = [];
    for (let i=0; i<numOfQuestion; i++) {
      const questionId = await masterAnonqa.questionIds(i);
      const questionInfo = await masterAnonqa.getQuestionInfo(questionId);
      console.log(questionInfo);
      if (questionInfo.sentToHeaven) {
        questionInfos.push(questionInfo);
      }
    }
    
    return questionInfos.map(q => ({
      questionId: q.questionId,
      owner: q.owner,
      questionTitle: q.questionTitle,
      question: q.question,
      endTime: q.endTime,
      sentToHeaven: q.sentToHeaven,
    }));
  } catch (error) {
    console.error("Error in getArchivedQuestions:", error);
    return [];
  }
};

export const addQuestion = async (questionData: { questionTitle: string, question: string, endTime: string }) => {
  try {
    const masterAnonqa = await getContract(masterAnonqaAddress, masterAnonqaABI);

    const tx = await masterAnonqa.postQuestion(questionData.questionTitle, questionData.question, questionData.endTime);
    await tx.wait();
  } catch (error) {
    console.error("Error in addQuestion:", error);
    throw error;
  }
};

// Answer service functions
export const getAnswersForQuestion = async (questionId: string): Promise<Answer[]> => {
  try {
    const masterAnonqa = await getContract(masterAnonqaAddress, masterAnonqaABI);
    const answerInfos = await masterAnonqa.getAnswerInfo(questionId);
    
    return answerInfos.map(a => ({
      questionId: a.questionId,
      answerId: a.answerId,
      answer: a.answer,
      owner: a.owner,
    }));
  } catch (error) {
    console.error("Error in getAnswersForQuestion:", error);
    return [];
  }
};

export const getUserAnswers = async (owner: string): Promise<Answer[]> => {
  try {
    const masterAnonqa = await getContract(masterAnonqaAddress, masterAnonqaABI);
    const numOfQuestion = await masterAnonqa.totalQuestions();
    console.log(numOfQuestion);

    let userAnswers: any = [];
    for (let i=0; i<numOfQuestion; i++) {
      const questionId = await masterAnonqa.questionIds(i);
      const answerInfos = await masterAnonqa.getAnswerInfo(questionId);

      for (let j=0; j<answerInfos.length; j++) {
        const answerInfo = await masterAnonqa.answerData(questionId, j);
        if (answerInfo.owner.toLowerCase() == owner.toLowerCase()) {
          userAnswers.push(answerInfo);
        }
      }
    }
    
    return userAnswers.map(a => ({
      questionId: a.questionId,
      answerId: a.answerId,
      answer: a.answer,
      owner: a.owner,
    }));
  } catch (error) {
    console.error("Error in getUserAnswers:", error);
    return [];
  }
};

export const addAnswer = async (answerData: { questionId: string, answer: string }, owner: string) => {
  try {
    const masterAnonqa = await getContract(masterAnonqaAddress, masterAnonqaABI);

    const tx = await masterAnonqa.postAnswer(answerData.questionId, answerData.answer);
    await tx.wait();
    
  } catch (error) {
    console.error("Error in addAnswer:", error);
    throw error;
  }
};