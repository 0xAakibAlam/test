import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnswerForm from "@/components/AnswerForm";
import { getQuestionById, getAnswersForQuestion } from "@/services/AnonqaService";
import { Question, Answer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { Clock } from "lucide-react";

const AnswersPage = () => {
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
      <main className="container w-5/6 px-4 py-6">
        <div className="mb-6">
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-pulse text-muted-foreground">Loading answers...</div>
          </div>
        ) : question ? (
          <div>
            <Card className="mb-6 border-l-4 border-l-primary/20">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg font-semibold line-clamp-2">{question.questionTitle}</CardTitle>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Expires {formatDistanceToNow(new Date(parseInt(question.endTime) * 1000), { addSuffix: true })}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 pb-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{question.question}</p>
                </div>
              </CardContent>
            </Card>

            <AnswerForm questionId={id as string} onAnswerAdded={fetchData} />

            <h2 className="text-xl font-bold mb-4 mt-8">
              Answers
            </h2>

            {answers.length > 0 ? (
              answers.map((answer) => (
                <Card key={answer.answerId} className="mb-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-secondary/20">
                  <CardContent className="p-6">
                    <div className="bg-muted/20 rounded-lg p-4">
                      <p className="leading-relaxed whitespace-pre-wrap text-foreground">{answer.answer}</p>
                    </div>
                  </CardContent>
                </Card>
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

export default AnswersPage;
