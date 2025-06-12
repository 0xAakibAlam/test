import { Post, Comment } from "@/types";
import { maxterdXConfig, admin } from "@/contracts/MasterdX";
import { useEstimateGas, useSendTransaction, useWriteContract } from "wagmi";

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

// Hook versions of addPost and addComment
export const useAddPost = () => {
  const { data: gasEstimate } = useEstimateGas({
    address: maxterdXConfig.address as `0x${string}`,
    abi: maxterdXConfig.abi,
    functionName: 'addPost',
  });

  const { sendTransaction, isPending, isSuccess, isError } = useSendTransaction();

  const addPost = async (postData: { postTitle: string, postBody: string }) => {
    try {
      if (!gasEstimate) return;

      const estimatedGas = gasEstimate * BigInt(15) / BigInt(10);

      await sendTransaction({
        to: maxterdXConfig.address as `0x${string}`,
        data: ethers.AbiCoder.defaultAbiCoder().encode(
          ['string', 'string'],
          [postData.postTitle, postData.postBody]
        ),
        gas: estimatedGas,
      });
    } catch (error) {
      console.error("Error in addPost:", error);
      throw error;
    }
  };

  return {
    addPost,
    isPending,
    isSuccess,
    isError
  };
};

export const useAddComment = () => {
  const { data: gasEstimate } = useEstimateGas({
    address: maxterdXConfig.address as `0x${string}`,
    abi: maxterdXConfig.abi,
    functionName: 'addComment',
  });

  const { sendTransaction, isPending, isSuccess, isError } = useSendTransaction();

  const addComment = async (commentData: { postId: string, comment: string }) => {
    try {
      if (!gasEstimate) return;

      const estimatedGas = gasEstimate * BigInt(15) / BigInt(10);

      await sendTransaction({
        to: maxterdXConfig.address as `0x${string}`,
        data: ethers.AbiCoder.defaultAbiCoder().encode(
          ['string', 'string'],
          [commentData.postId, commentData.comment]
        ),
        gas: estimatedGas,
      });
    } catch (error) {
      console.error("Error in addComment:", error);
      throw error;
    }
  };

  return {
    addComment,
    isPending,
    isSuccess,
    isError
  };
};

export const getUserComments = async (owner: string): Promise<Comment[]> => {
  try {
    const masterdX = await getReadOnlyContract(maxterdXConfig.address, maxterdXConfig.abi);
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