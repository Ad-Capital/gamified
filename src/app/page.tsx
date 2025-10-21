'use client';

import { useState, useEffect } from 'react';

interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  value: number;
}

interface Question {
  id: string;
  text: string;
  category: string;
  options: Option[];
}

const questions: Question[] = [
  {
    id: "q1",
    text: "How do you manage sales processes and customer relationships?",
    category: "Operations",
    options: [
      { id: "A", text: "No formal system", value: 1 },
      { id: "B", text: "Spreadsheets & manual tracking", value: 2 },
      { id: "C", text: "Basic CRM system", value: 3 },
      { id: "D", text: "Advanced CRM with automation", value: 4 }
    ]
  },
  {
    id: "q2", 
    text: "How effectively does your organization handle customer support?",
    category: "Operations",
    options: [
      { id: "A", text: "No formal process", value: 1 },
      { id: "B", text: "Ad-hoc support", value: 2 },
      { id: "C", text: "Structured email/phone support", value: 3 },
      { id: "D", text: "Dedicated team with SLAs", value: 4 }
    ]
  },
  {
    id: "q3",
    text: "How do you manage financial planning and reporting?",
    category: "Operations", 
    options: [
      { id: "A", text: "No formal system", value: 1 },
      { id: "B", text: "Manual tracking", value: 2 },
      { id: "C", text: "Basic bookkeeping", value: 3 },
      { id: "D", text: "Professional accounting software", value: 4 }
    ]
  },
  {
    id: "q4",
    text: "How does your leadership approach strategic planning?",
    category: "Leadership",
    options: [
      { id: "A", text: "No planning process", value: 1 },
      { id: "B", text: "Informal planning", value: 2 },
      { id: "C", text: "Annual goal setting", value: 3 },
      { id: "D", text: "Formal strategic planning", value: 4 }
    ]
  },
  {
    id: "q5",
    text: "How do you approach customer acquisition and marketing?",
    category: "Operations",
    options: [
      { id: "A", text: "No marketing strategy", value: 1 },
      { id: "B", text: "Basic marketing activities", value: 2 },
      { id: "C", text: "Consistent marketing efforts", value: 3 },
      { id: "D", text: "Multi-channel marketing with ROI tracking", value: 4 }
    ]
  }
];

const healthTiers = [
  { min: 0, max: 40, label: "Needs Attention", color: "text-red-500", bgColor: "bg-red-50", ringColor: "stroke-red-500" },
  { min: 41, max: 65, label: "Developing", color: "text-orange-500", bgColor: "bg-orange-50", ringColor: "stroke-orange-500" },
  { min: 66, max: 85, label: "Performing", color: "text-blue-500", bgColor: "bg-blue-50", ringColor: "stroke-blue-500" },
  { min: 86, max: 100, label: "Excellent", color: "text-green-500", bgColor: "bg-green-50", ringColor: "stroke-green-500" }
];

const categories = [
  { name: "Operations", questions: [0, 1, 2, 4] },
  { name: "Leadership", questions: [3] }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [questionCentered, setQuestionCentered] = useState(true);
  const [answers, setAnswers] = useState<Array<{ questionId: string, optionId: string, value: number }>>([]);

  const maxScore = questions.length * 4; // Max 4 points per question
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const option = questions[currentIndex].options.find(opt => opt.id === selectedOption);
      if (option) {
        setScore(score + option.value);
        // Store the answer
        setAnswers([...answers, {
          questionId: questions[currentIndex].id,
          optionId: selectedOption,
          value: option.value
        }]);
      }
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        // Reset animation states for next question
        setAnimatedText('');
        setShowAnswers(false);
        setQuestionCentered(true);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleSubmit = async () => {
    // if (email) {
    //   try {
    //     setSubmitted(true);
        
    //     const response = await fetch('/api/send-report', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         email,
    //         score,
    //         percentage,
    //         maxScore,
    //         answers
    //       }),
    //     });

    //     if (!response.ok) {
    //       throw new Error('Failed to send report');
    //     }

    //     console.log('Report sent successfully');
    //   } catch (error) {
    //     console.error('Failed to send report:', error);
    //     setSubmitted(false);
    //     // error state handlingings
    //   }
    // }
  };

  const percentage = Math.round((score / maxScore) * 100);

  // Typewriter animation for question text
  useEffect(() => {
    const currentQuestion = questions[currentIndex];
    const fullText = currentQuestion.text;
    setAnimatedText('');
    setIsTyping(true);
    setShowAnswers(false);
    setQuestionCentered(true);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setAnimatedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
        
        // After typing completes, wait a moment then move question up and show answers
        setTimeout(() => {
          setQuestionCentered(false);
          setTimeout(() => {
            setShowAnswers(true);
          }, 300); // Delay answers until question has moved up
        }, 500); // Wait 500ms after typing completes
      }
    }, 30); // 30ms delay between each letter

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showResults) return;
      
      const key = event.key.toLowerCase();
      if (['1', 'a'].includes(key)) {
        handleOptionSelect('A');
      } else if (['2', 'b'].includes(key)) {
        handleOptionSelect('B');
      } else if (['3', 'c'].includes(key)) {
        handleOptionSelect('C');
      } else if (['4', 'd'].includes(key)) {
        handleOptionSelect('D');
      } else if (key === 'enter' && selectedOption !== null) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedOption, showResults, currentIndex]);

  if (showResults) {
    const currentTier = healthTiers.find(tier => percentage >= tier.min && percentage <= tier.max);
    const circumference = 2 * Math.PI * 100; // radius of 100
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Calculate category scores
    const categoryScores = categories.map(category => {
      const categoryQuestions = category.questions.map(index => questions[index]);
      const categoryScore = category.questions.reduce((sum, questionIndex) => {
        const question = questions[questionIndex];
        const answer = question.options.find(opt => opt.id === `q${questionIndex}_answer`); // This is simplified for demo
        return sum + (answer?.value || 0);
      }, 0);
      const maxCategoryScore = category.questions.length * 4;
      const categoryPercentage = Math.round((categoryScore / maxCategoryScore) * 100);
      return {
        name: category.name,
        percentage: Math.min(categoryPercentage, 100) // Cap at 100% for demo
      };
    });

    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl text-center">
          {/* Main Score Display */}
          <div className="mb-16">
            <div className="text-8xl font-thin text-gray-900 mb-4">{percentage}</div>
            <div className="text-gray-600 uppercase tracking-widest text-sm mb-8">
              Business Health Score
            </div>
            <div className={`text-xl font-light ${currentTier?.color || 'text-blue-500'}`}>
              {currentTier?.label || 'Performing'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-16 max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-2000 ease-out ${
                  currentTier?.ringColor?.replace('stroke-', 'bg-') || 'bg-blue-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Email Capture */}
          <div className="max-w-md mx-auto space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-transparent border-b border-gray-400 text-gray-900 py-4 px-2 text-center outline-none placeholder:text-gray-500 focus:border-gray-600 transition-colors duration-200"
            />
            <button
              onClick={handleSubmit}
              disabled={submitted || !email}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? 'Sent' : 'Get Detailed Report'}
            </button>
            {submitted && (
              <p className="text-gray-600 text-sm mt-4">
                Report sent to your email
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 relative overflow-hidden">
      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Container */}
      <div className="min-h-screen pt-24">
        <div className="w-full max-w-4xl mx-auto px-6">
          {/* Question */}
          <div className="relative h-[40vh] mb-4">
            <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out ${
              questionCentered ? 'translate-y-0' : 'translate-y-[-5vh]'
            }`}>
              <h1 className="font-light leading-tight text-gray-900 text-4xl md:text-5xl text-center">
                {animatedText}
                {isTyping && <span className="opacity-50 animate-pulse">|</span>}
              </h1>
            </div>
          </div>

          {/* Options Grid */}
          <div className={`transition-all duration-500 ${
            showAnswers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`p-4 text-left transition-all duration-200 border-2 rounded-lg transform ${
                    showAnswers 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-8 opacity-0'
                  } ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                  style={{
                    transitionDelay: showAnswers ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-400 text-gray-600'
                    }`}>
                      {option.id}
                    </div> */}
                    <span className="text-gray-900 font-normal text-sm">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Press {selectedOption ? 'Enter' : 'A-D'} to {selectedOption ? 'continue' : 'select'}
              </div>
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {currentIndex === questions.length - 1 ? 'Complete Assessment' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
