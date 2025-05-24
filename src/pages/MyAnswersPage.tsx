import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { getUserAnswers, getQuestionById } from "@/services/dataService";
import { Answer, Question } from "@/types";
import { useWallet } from "@/context/WalletContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AnswerWithQuestion extends Answer {
  questionText?: string;
}

const MyAnswersPage = () => {
  const [answers, setAnswers] = useState<AnswerWithQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { wallet } = useWallet();

  useEffect(() => {
    const fetchUserAnswers = async () => {
      if (!wallet.isConnected) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const answersData = await getUserAnswers(wallet.address);
        
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
  }, [wallet]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container w-5/6 px-4 py-6">

        <h1 className="text-3xl font-bold mb-6">My Answers</h1>

        {!wallet.isConnected ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">Please connect your wallet to view my answers</p>
            <Button onClick={() => window.scrollTo(0, 0)}>Connect Wallet</Button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-pulse text-muted-foreground">Loading your answers...</div>
          </div>
        ) : answers.length > 0 ? (
          <div>
            {answers.map((answer) => (
              <Card key={answer.answerId} className="mb-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-secondary/20">
                <CardHeader className="pb-2">
                  <Link to={`/app/question/${answer.questionId}`} className="block">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2">
                        {answer.questionText}
                      </h3>
                    </div>
                  </Link>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{answer.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">You haven't answered any questions yet</p>
            <Link to="/app">
              <Button>Browse Questions</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAnswersPage;
