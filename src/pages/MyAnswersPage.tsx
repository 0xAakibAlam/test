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
import AnswerCard from "@/components/AnswerCard";

interface AnswerWithQuestion extends Answer {
  questionText?: string;
}

const MyAnswersPage = () => {
  const [answers, setAnswers] = useState<AnswerWithQuestion[]>([]);
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
        const answersWithQuestions = await Promise.all(
          answersData.map(async (answer) => {
            try {
              const question = await getQuestionById(answer.questionId);
              return {
                ...answer,
                questionText: question?.question || "Question not found"
              };
            } catch (error) {
              console.error("Error fetching question:", error);
              return {
                ...answer,
                questionText: "Question not found"
              };
            }
          })
        );
        
        setAnswers(answersWithQuestions);
      } catch (error) {
        console.error("Error fetching user answers:", error);
        toast.error("Failed to load my answers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAnswers();
  }, [address, isConnected]);

  const renderQuestionContent = (questionText) => {
    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split the text by URLs and map through the parts
    const parts = questionText.split(urlRegex);
    
    return (
      <div>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {parts.map((part, index) => {
            // Check if this part matches a URL
            if (part.match(urlRegex)) {
              return (
                <a
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">

      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">My Answers</h1>
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Please connect your wallet to view my answers</p>
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
              <Card key={answer.answerId} className="mb-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-secondary/20">
                <CardHeader className="pb-2">
                  <Link to={`/app/question/${answer.questionId}`} className="block">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                        {renderQuestionContent(answer.questionText)}
                      </h3>
                    </div>
                  </Link>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <AnswerCard answer={answer} />
                  {/* <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{answer.answer}</p>
                  </div> */}
                </CardContent>
              </Card>
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

export default MyAnswersPage;
