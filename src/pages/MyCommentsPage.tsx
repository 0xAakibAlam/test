import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getUserAnswers, getQuestionById } from "@/services/AnonqaService";
import { Answer } from "@/types";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CommentCard } from "@/components/CommentCard";
import { RichTextRenderer } from "@/components/RichTextRenderer";

interface AnswerWithQuestionTitle extends Answer {
  questionTitle?: string;
}

export const MyCommentsPage = () => {
  const [answers, setAnswers] = useState<AnswerWithQuestionTitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    const fetchUserAnswers = async () => {
      if (!isConnected) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const answersData = await getUserAnswers(address);
        
        // Fetch the question text for each answer
        const answersWithQuestionTitle = await Promise.all(
          answersData.map(async (answer) => {
            try {
              const question = await getQuestionById(answer.questionId);
              return {
                ...answer,
                questionTitle: question?.questionTitle || "Question not found"
              };
            } catch (error) {
              console.error("Error fetching question:", error);
              return {
                ...answer,
                questionTitle: "Question not found"
              };
            }
          })
        );
        
        setAnswers(answersWithQuestionTitle);
      } catch (error) {
        console.error("Error fetching user comments:", error);
        toast.error("Failed to load my comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAnswers();
  }, [address, isConnected]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">

      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">My Comments</h1>
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Please connect your wallet to view my comments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </div>

        {!isConnected ? (
          <></>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-full space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-muted/50 rounded-lg border border-border">
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="flex justify-between items-center">
                        <div className="h-3 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : answers.length > 0 ? (
          <div>
            {answers.map((answer) => (
              <CommentCard answer={answer} questionTitle={answer.questionTitle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">You haven't answered any questions yet</p>
          </div>
        )}
      </main>
    </div>
  );
};