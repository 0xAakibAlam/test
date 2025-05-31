import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/QuestionCard";
import { getUserQuestions } from "@/services/AnonqaService";
import { Question } from "@/types";
import { useAccount } from "wagmi";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";

const MyQuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchUserQuestions = async () => {
      if (!isConnected) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await getUserQuestions(address);
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching user questions:", error);
        toast.error("Failed to load my questions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserQuestions();
  }, [address, isConnected]);

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
      <main className="container w-5/6 px-4 py-6">

        <h1 className="text-3xl font-bold mb-6">My Questions</h1>

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

        {!isConnected ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">Please connect your wallet to view my questions</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-pulse text-muted-foreground">Loading your questions...</div>
          </div>
        ) : sortedAndFilteredQuestions.length > 0 ? (
          <div>
            {sortedAndFilteredQuestions.map((question) => (
              <QuestionCard key={question.questionId} question={question} />
            ))}
          </div>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
};

export default MyQuestionsPage;
