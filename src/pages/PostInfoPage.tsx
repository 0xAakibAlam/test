import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { CommentForm } from "@/components/CommentForm";
import { getQuestionById, getAnswersForQuestion } from "@/services/AnonqaService";
import { Question, Answer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { Clock } from "lucide-react";
import { CommentCard } from "@/components/CommentCard";
import { RichTextRenderer } from "@/components/RichTextRenderer";

export const PostInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const [questionData, answersData] = await Promise.all([
        getQuestionById(id),
        getAnswersForQuestion(id)
      ]);
      
      if (questionData) {
        setQuestion(questionData);
      } else {
        toast.error("Question not found");
      }
      
      setAnswers(answersData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load question and answers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="mb-6">
        </div>

        {isLoading ? (
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
        ) : question ? (
          <div>
            <Card className="mb-6 border-l-4 border-l-primary/20">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-xl md:text-2xl font-semibold line-clamp-2">{question.questionTitle}</CardTitle>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(Number(question.endTime) * 1000) > new Date() ? 'Archive' : 'Archived'}{' '}
                      {formatDistanceToNow(new Date(Number(question.endTime) * 1000), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 pb-6">
                <RichTextRenderer content={question.question} />
              </CardContent>
            </Card>

            <CommentForm questionId={id as string} onAnswerAdded={fetchData} />

            <h2 className="text-xl font-bold mb-4 mt-8">
              Answers
            </h2>

            {answers.length > 0 ? (
              answers.map((answer) => (
                <CommentCard answer={answer} questionTitle={""}/>
              ))
            ) : (
              <div className="text-center py-10 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">No answers yet. Be the first to answer!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Question not found</p>
          </div>
        )}
      </main>
    </div>
  );
};