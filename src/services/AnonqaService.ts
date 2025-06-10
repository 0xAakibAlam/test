import { Post, Comment } from "@/types";
import { masterdXAddress, masterdXABI, admin } from "@/contracts/MasterdX";
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

async function getContract(contractAddress: string, contractABI: any) {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask to use this feature");
  }

  const provider = new ethers.BrowserProvider(window.ethereum as any);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
  return contractInstance;
}

// Question service functions
export const getActivePosts = async (): Promise<Post[]> => {
  try {
    const masterdX = await getReadOnlyContract(masterdXAddress, masterdXABI);
    const numOfPost = await masterdX.totalPosts();

    let postInfos: any = [];
    for (let i=0; i<numOfPost; i++) {
      const postId = await masterdX.postIds(i);
      console.log("Raw postId:", postId);
      
      const postInfo = await masterdX.getPostInfo(postId);
      if (!postInfo.archived) {
        postInfos.push(postInfo);
      }
    }
    
    return postInfos.map(q => ({
      postId: q.postId,
      owner: q.owner,
      postTitle: q.postTitle,
      postBody: q.postBody,
      endTime: q.endTime,
      archived: q.archived
    }));
  } catch (error) {
    console.error("Error in getPosts:", error);
    // Fallback to return an empty array if there's an error
    return [];
  }
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
  try {
    const masterdX = await getReadOnlyContract(masterdXAddress, masterdXABI);
    const postInfo = await masterdX.getPostInfo(id);
    
    return {
      postId: postInfo.postId,
      postTitle: postInfo.postTitle,
      postBody: postInfo.postBody,
      owner: postInfo.owner,
      endTime: postInfo.endTime,
      archived: postInfo.sentToHeaven,
    };
  } catch (error) {
    console.error("Error in getPostById:", error);
    return undefined;
  }
};

export const getUserPosts = async (owner: string): Promise<Post[]> => {
  try {
    const masterdX = await getReadOnlyContract(masterdXAddress, masterdXABI);
    const numOfPost = await masterdX.totalPosts();
    console.log(numOfPost);

    let postInfos: any = [];
    for (let i=0; i<numOfPost; i++) {
      const postId = await masterdX.postIds(i);
      const postInfo = await masterdX.getPostInfo(postId);
      if (postInfo.owner.toLowerCase() == owner.toLowerCase()) {
        postInfos.push(postInfo);
      }
    }
    
    return postInfos.map(q => ({
      postId: q.postId,
      owner: q.owner,
      postTitle: q.postTitle,
      postBody: q.postBody,
      endTime: q.endTime,
      archived: q.archived,
    }));
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return [];
  }
};

export const getArchivedPosts = async (): Promise<Post[]> => {
  try {
    const masterdX = await getReadOnlyContract(masterdXAddress, masterdXABI);
    const numOfPost = await masterdX.totalPosts();
    console.log(numOfPost);

    let postInfos: any = [];
    for (let i=0; i<numOfPost; i++) {
      const postId = await masterdX.postIds(i);
      const postInfo = await masterdX.getPostInfo(postId);
      console.log(postInfo);
      if (postInfo.archived) {
        postInfos.push(postInfo);
      }
    }
    
    return postInfos.map(q => ({
      postId: q.postId,
      owner: q.owner,
      postTitle: q.postTitle,
      postBody: q.postBody,
      endTime: q.endTime,
      archived: q.archived,
    }));
  } catch (error) {
    console.error("Error in getArchivedQuestions:", error);
    return [];
  }
};

export const addPost = async (postData: { postTitle: string, postBody: string }) => {
  try {
    const masterdX = await getContract(masterdXAddress, masterdXABI);
    
    const gasLimit = await masterdX.addPost.estimateGas(
      postData.postTitle,
      postData.postBody
    );
    const estimatedGas = gasLimit * BigInt(15) / BigInt(10);

    const tx = await masterdX.addPost(
      postData.postTitle,
      postData.postBody,
      {
        gasLimit: estimatedGas,
        maxFeePerGas: undefined,
        maxPriorityFeePerGas: undefined
      }
    );
    await tx.wait();

  } catch (error) {
    console.error("Error in addPost:", error);
    throw error;
  }
};

// Answer service functions
export const getCommentsForPost = async (postId: string): Promise<Comment[]> => {
  try {
    const masterdX = await getReadOnlyContract(masterdXAddress, masterdXABI);
    const commentInfos = await masterdX.getAnswerInfo(postId);
    
    return commentInfos.map(a => ({
      postId: a.postId,
      comment: a.comment,
      owner: a.owner,
    }));
  } catch (error) {
    console.error("Error in getCommentsForPost:", error);
    return [];
  }
};

export const getUserComments = async (owner: string): Promise<Comment[]> => {
  try {
    const masterdX = await getReadOnlyContract(masterdXAddress, masterdXABI);
    const numOfPost = await masterdX.totalPosts();
    console.log(numOfPost);

    let userComments: any = [];
    for (let i=0; i<numOfPost; i++) {
      const postId = await masterdX.postIds(i);
      const commentInfos = await masterdX.getCommentsInfo(postId);

      for (let j=0; j<commentInfos.length; j++) {
        const commentInfo = await masterdX.commentData(postId, j);
        if (commentInfo.owner.toLowerCase() == owner.toLowerCase()) {
          userComments.push(commentInfo);
        }
      }
    }
    
    return userComments.map(a => ({
      postId: a.postId,
      comment: a.comment,
      owner: a.owner,
    }));
  } catch (error) {
    console.error("Error in getUserComments:", error);
    return [];
  }
};

export const getProposals = async (): Promise<Post[]> => {
  try {
    const masterdX = await getReadOnlyContract(masterdXAddress, masterdXABI);
    const numOfPost = await masterdX.totalPosts();
    console.log(numOfPost);

    let postInfos: any = [];
    for (let i=0; i<numOfPost; i++) {
      const postId = await masterdX.postIds(i);
      const postInfo = await masterdX.getPostInfo(postId);
      if (postInfo.owner.toLowerCase() == admin.toLowerCase()) {
        postInfos.push(postInfo);
      }
    }
    
    return postInfos.map(q => ({
      postId: q.postId,
      owner: q.owner,
      postTitle: q.postTitle,
      postBody: q.postBody,
      endTime: q.endTime,
      archived: q.archived,
    }));
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return [];
  }
}

export const addComment = async (commentData: { postId: string, comment: string }) => {
  try {
    const masterdX = await getContract(masterdXAddress, masterdXABI);
    
    const gasLimit = await masterdX.addComment.estimateGas(
      commentData.postId,
      commentData.comment
    );
    const estimatedGas = gasLimit * BigInt(15) / BigInt(10);
    const tx = await masterdX.addComment(
      commentData.postId,
      commentData.comment,
      {
        gasLimit: estimatedGas,
        maxFeePerGas: undefined,
        maxPriorityFeePerGas: undefined
      }
    );
    await tx.wait();
    
  } catch (error) {
    console.error("Error in addComment:", error);
    throw error;
  }
};