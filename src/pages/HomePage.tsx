import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import QuestionForm from "@/components/QuestionForm";
import QuestionCard from "@/components/QuestionCard";
import { getActiveQuestions } from "@/services/AnonqaService";
import { Question } from "@/types";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      console.log("data fetching...");
      const data = await getActiveQuestions();
      console.log("data fetched successfully!! ", data)
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter questions based on search term
  const filteredQuestions = questions.filter(question => 
    question.questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    question.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort questions based on expiration time
  const sortedAndFilteredQuestions = filteredQuestions.sort((a, b) => {
    const timeA = parseInt(a.endTime);
    const timeB = parseInt(b.endTime);
    return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
  });

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container w-5/6 px-4 py-6 max-w-[85%]">
        <QuestionForm onQuestionAdded={fetchQuestions} />

        <h2 className="text-2xl font-bold mb-4">Active Questions</h2>

        <div className="relative mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-transparent"
            onClick={toggleSort}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-pulse text-muted-foreground">Loading questions...</div>
          </div>
        ) : sortedAndFilteredQuestions.length > 0 ? (
          <div>
            {sortedAndFilteredQuestions.map((question) => (
              <QuestionCard key={question.questionId} question={question} />
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No questions match your search</p>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No questions found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
