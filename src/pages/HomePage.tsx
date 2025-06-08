import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { PostForm } from "@/components/PostForm";
import { PostCard } from "@/components/PostCard";
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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <PostForm onQuestionAdded={fetchQuestions} />

        <h2 className="text-xl sm:text-2xl font-bold mb-4">Posts</h2>

        <div className="relative mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 sm:w-10 p-0 hover:bg-transparent flex-shrink-0"
            onClick={toggleSort}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-5">
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
        ) : sortedAndFilteredQuestions.length > 0 ? (
          sortedAndFilteredQuestions.map((question) => (
            <PostCard key={question.questionId} question={question} />
          ))
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
