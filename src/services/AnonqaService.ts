import { Question, Answer } from "@/types";
import { masterAnonqaAddress, masterAnonqaABI, admin } from "@/contracts/MasterAnonqa";
import { ethers } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";

function createMultiCallProvider() {
  const provider = new ethers.JsonRpcProvider(
    `https://ethereum-sepolia-rpc.publicnode.com`
  );
  return MulticallWrapper.wrap(provider as any);
}

async function getReadOnlyContract(contractAddress, contractABI) {
  const contractInstance = new ethers.Contract(
    contractAddress,
    contractABI,
    createMultiCallProvider()
  );
  return contractInstance;
}

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
    const masterAnonqa = await getReadOnlyContract(masterAnonqaAddress, masterAnonqaABI);
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
    const masterAnonqa = await getReadOnlyContract(masterAnonqaAddress, masterAnonqaABI);
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
    const masterAnonqa = await getReadOnlyContract(masterAnonqaAddress, masterAnonqaABI);
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
    const masterAnonqa = await getReadOnlyContract(masterAnonqaAddress, masterAnonqaABI);
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
    
    const gasLimit = await masterAnonqa.postQuestion.estimateGas(
      questionData.questionTitle,
      questionData.question,
      questionData.endTime
    );
    const estimatedGas = gasLimit * BigInt(15) / BigInt(10);

    console.log("question: ", questionData);
    console.log("estimatedGas: ", estimatedGas);
    const tx = await masterAnonqa.postQuestion(
      questionData.questionTitle,
      questionData.question,
      questionData.endTime,
      {gasLimit: estimatedGas}
    );
    await tx.wait();

  } catch (error) {
    console.error("Error in addQuestion:", error);
    throw error;
  }
};

// Answer service functions
export const getAnswersForQuestion = async (questionId: string): Promise<Answer[]> => {
  try {
    const masterAnonqa = await getReadOnlyContract(masterAnonqaAddress, masterAnonqaABI);
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
    const masterAnonqa = await getReadOnlyContract(masterAnonqaAddress, masterAnonqaABI);
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

export const getProposals = async (): Promise<Question[]> => {
  try {
    const masterAnonqa = await getReadOnlyContract(masterAnonqaAddress, masterAnonqaABI);
    const numOfQuestion = await masterAnonqa.totalQuestions();
    console.log(numOfQuestion);

    let questionInfos: any = [];
    for (let i=0; i<numOfQuestion; i++) {
      const questionId = await masterAnonqa.questionIds(i);
      const questionInfo = await masterAnonqa.getQuestionInfo(questionId);
      if (questionInfo.owner.toLowerCase() == admin.toLowerCase()) {
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
}

export const addAnswer = async (answerData: { questionId: string, answer: string }) => {
  try {
    const masterAnonqa = await getContract(masterAnonqaAddress, masterAnonqaABI);
    
    const gasLimit = await masterAnonqa.postAnswer.estimateGas(
      answerData.questionId,
      answerData.answer
    );
    const estimatedGas = gasLimit * BigInt(15) / BigInt(10);
    const tx = await masterAnonqa.postAnswer(
      answerData.questionId,
      answerData.answer,
      {gasLimit: estimatedGas}
    );
    await tx.wait();
    
  } catch (error) {
    console.error("Error in addAnswer:", error);
    throw error;
  }
};