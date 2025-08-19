// // // 'use client';

// // // import { useState, useCallback } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import ToeicTest from './toeic-lr-test';
// // // import FullPageLoader from '@/components/common/full-page-loader';

// // // // Custom hooks
// // // import { useNavigationWarning } from '@/hooks/use-navigation-warning';
// // // import { useExamTimer } from '@/hooks/use-exam-timer';
// // // import { useExamData } from '@/hooks/use-exam-data';
// // // import { useAudioStatus } from '@/hooks/use-audio-status';

// // // import ExamPartBar from '@/components/practice-tests/exam-part-bar';
// // // import ExamFinished from '@/components/practice-tests/exam-finished';
// // // import ExamError from '@/components/practice-tests/exam-error';

// // // // Dictionary
// // // import DictionarySidebar from '@/components/practice-tests/dictionary-sidebar';
// // // import { Button } from '@/components/ui/button';
// // // import { BookOpen, X } from 'lucide-react';

// // // export default function TestPage() {
// // //   const router = useRouter();

// // //   const [isPaused, setIsPaused] = useState<boolean>(false);
// // //   const [testFinished, setTestFinished] = useState<boolean>(false);
// // //   const [examStartTime] = useState(() => new Date());
// // //   const [showingResult, setShowingResult] = useState<boolean>(false);
// // //   const [showDictionary, setShowDictionary] = useState<boolean>(false);

// // //   // Custom hooks
// // //   const {
// // //     examData,
// // //     partIds,
// // //     partNumbers,
// // //     currentPartIndex,
// // //     currentPartData,
// // //     loading,
// // //     loadingPart,
// // //     error,
// // //     allAnswersRef,
// // //     allMarkedForReviewRef,
// // //     partDataCacheRef,
// // //     setCurrentPartIndex,
// // //     setError,
// // //     updateAnswers,
// // //     updateMarkedForReview,
// // //     handleNextPart
// // //   } = useExamData();

// // //   const { audioStatus, updateAudioStatus } = useAudioStatus();

// // //   const isTestActive = !loading && !error && !testFinished && !showingResult && partIds.length > 0;

// // //   const { initialTime, remainingTime, isFullExam, setRemainingTime } = useExamTimer({
// // //     isPaused,
// // //     testFinished,
// // //     onTimeUp: () => setTestFinished(true)
// // //   });

// // //   const { safeNavigate, disableTestWarning } = useNavigationWarning({
// // //     isTestActive,
// // //     warningMessage:
// // //       'Bạn có chắc muốn rời khỏi bài test? Tất cả tiến trình làm bài sẽ bị mất và không thể khôi phục.'
// // //   });

// // //   // Handlers
// // //   const handleBackToSetup = useCallback(() => {
// // //     safeNavigate(`/practice-tests/${examData?.examId || ''}`);
// // //   }, [safeNavigate, examData?.examId]);

// // //   const handleSubmitTest = useCallback(() => {
// // //     disableTestWarning();
// // //     setTestFinished(true);
// // //   }, [disableTestWarning]);

// // //   const handleExitTest = useCallback(() => {
// // //     const confirmExit = window.confirm(
// // //       'Bạn có chắc muốn thoát khỏi bài test?\n\nTất cả tiến trình làm bài sẽ bị mất và không thể khôi phục. Bạn sẽ cần bắt đầu lại từ đầu nếu muốn làm bài test này.'
// // //     );

// // //     if (confirmExit) {
// // //       disableTestWarning();
// // //       router.push('/practice-tests');
// // //     }
// // //   }, [disableTestWarning, router]);

// // //   const handlePartChange = useCallback(
// // //     (index: number) => {
// // //       setCurrentPartIndex(index);
// // //     },
// // //     [setCurrentPartIndex]
// // //   );

// // //   const handleRetry = useCallback(() => {
// // //     setError(null);
// // //     setCurrentPartIndex(currentPartIndex); // Trigger refetch
// // //   }, [setError, setCurrentPartIndex, currentPartIndex]);

// // //   // Render states
// // //   if (testFinished) {
// // //     return (
// // //       <div className="flex relative">
// // //         <div className="flex-1">
// // //           <ExamFinished
// // //             remainingTime={remainingTime}
// // //             initialTime={initialTime}
// // //             allAnswers={allAnswersRef.current}
// // //             partDataCache={partDataCacheRef.current}
// // //           />
// // //         </div>

// // //         {showDictionary && <DictionarySidebar />}

// // //         {/* Toggle Button */}
// // //         <Button
// // //           onClick={() => setShowDictionary(!showDictionary)}
// // //           className="fixed bottom-6 right-6 rounded-full shadow-lg"
// // //           size="icon"
// // //         >
// // //           {showDictionary ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
// // //         </Button>
// // //       </div>
// // //     );
// // //   }

// // //   if (loading) {
// // //     return <FullPageLoader />;
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="flex relative">
// // //         <div className="flex-1">
// // //           <ExamError error={error} onBackToSetup={handleBackToSetup} onRetry={handleRetry} />
// // //         </div>

// // //         {showDictionary && <DictionarySidebar />}

// // //         {/* Toggle Button */}
// // //         <Button
// // //           onClick={() => setShowDictionary(!showDictionary)}
// // //           className="fixed bottom-6 right-6 rounded-full shadow-lg"
// // //           size="icon"
// // //         >
// // //           {showDictionary ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
// // //         </Button>
// // //       </div>
// // //     );
// // //   }

// // //   const currentPartId = partIds[currentPartIndex];

// // //   return (
// // //     <div className="flex relative">
// // //       <div className="flex-1">
// // //         {/* Navigation Bar */}
// // //         {!testFinished && !showingResult && (
// // //           <ExamPartBar
// // //             examData={examData}
// // //             partIds={partIds}
// // //             partNumbers={partNumbers}
// // //             currentPartIndex={currentPartIndex}
// // //             loadingPart={loadingPart}
// // //             isFullExam={isFullExam}
// // //             audioStatus={audioStatus}
// // //             onPartChange={handlePartChange}
// // //             onExitTest={handleExitTest}
// // //           />
// // //         )}

// // //         {/* Main Content */}
// // //         {loadingPart ? (
// // //           <div className="text-center py-8">Đang tải Part {currentPartIndex + 1}...</div>
// // //         ) : currentPartData ? (
// // //           <ToeicTest
// // //             key={currentPartId}
// // //             partData={currentPartData}
// // //             onPartComplete={handleNextPart}
// // //             isLastPart={currentPartIndex === partIds.length - 1}
// // //             currentPartIndex={currentPartIndex + 1}
// // //             totalParts={partIds.length}
// // //             isPaused={isPaused}
// // //             remainingTime={remainingTime}
// // //             onTimeChange={setRemainingTime}
// // //             onSubmitTest={handleSubmitTest}
// // //             initialAnswers={allAnswersRef.current[currentPartId] || {}}
// // //             initialMarkedForReview={allMarkedForReviewRef.current[currentPartId] || {}}
// // //             onAnswersChange={(answers) => updateAnswers(currentPartId, answers)}
// // //             onMarkedForReviewChange={(marked) => updateMarkedForReview(currentPartId, marked)}
// // //             allPartIds={partIds.map((id) => parseInt(id))}
// // //             allAnswers={allAnswersRef.current}
// // //             examStartTime={examStartTime}
// // //             isFullExam={isFullExam}
// // //             onShowResult={setShowingResult}
// // //             onAudioStatusChange={updateAudioStatus}
// // //           />
// // //         ) : null}
// // //       </div>

// // //       {/* Sidebar từ điển (ẩn/hiện) */}
// // //       {showDictionary && <DictionarySidebar />}

// // //       {/* Nút toggle từ điển */}
// // //       <Button
// // //         onClick={() => setShowDictionary(!showDictionary)}
// // //         className="fixed bottom-6 right-6 rounded-full shadow-lg"
// // //         size="icon"
// // //       >
// // //         {showDictionary ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
// // //       </Button>
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useState, useCallback } from 'react';
// // import { useRouter } from 'next/navigation';
// // import ToeicTest from './toeic-lr-test';
// // import FullPageLoader from '@/components/common/full-page-loader';

// // // Custom hooks
// // import { useNavigationWarning } from '@/hooks/use-navigation-warning';
// // import { useExamTimer } from '@/hooks/use-exam-timer';
// // import { useExamData } from '@/hooks/use-exam-data';
// // import { useAudioStatus } from '@/hooks/use-audio-status';

// // import ExamPartBar from '@/components/practice-tests/exam-part-bar';
// // import ExamFinished from '@/components/practice-tests/exam-finished';
// // import ExamError from '@/components/practice-tests/exam-error';

// // // Dictionary
// // import DictionarySidebar from '@/components/practice-tests/dictionary-sidebar';
// // import { Button } from '@/components/ui/button';
// // import { X } from 'lucide-react';

// // export default function TestPage() {
// //   const router = useRouter();

// //   const [isPaused, setIsPaused] = useState<boolean>(false);
// //   const [testFinished, setTestFinished] = useState<boolean>(false);
// //   const [examStartTime] = useState(() => new Date());
// //   const [showingResult, setShowingResult] = useState<boolean>(false);
// //   const [showDictionary, setShowDictionary] = useState<boolean>(true); // luôn hiển thị từ điển

// //   // Custom hooks
// //   const {
// //     examData,
// //     partIds,
// //     partNumbers,
// //     currentPartIndex,
// //     currentPartData,
// //     loading,
// //     loadingPart,
// //     error,
// //     allAnswersRef,
// //     allMarkedForReviewRef,
// //     partDataCacheRef,
// //     setCurrentPartIndex,
// //     setError,
// //     updateAnswers,
// //     updateMarkedForReview,
// //     handleNextPart
// //   } = useExamData();

// //   const { audioStatus, updateAudioStatus } = useAudioStatus();

// //   const isTestActive = !loading && !error && !testFinished && !showingResult && partIds.length > 0;

// //   const { initialTime, remainingTime, isFullExam, setRemainingTime } = useExamTimer({
// //     isPaused,
// //     testFinished,
// //     onTimeUp: () => setTestFinished(true)
// //   });

// //   const { safeNavigate, disableTestWarning } = useNavigationWarning({
// //     isTestActive,
// //     warningMessage:
// //       'Bạn có chắc muốn rời khỏi bài test? Tất cả tiến trình làm bài sẽ bị mất và không thể khôi phục.'
// //   });

// //   // Handlers
// //   const handleBackToSetup = useCallback(() => {
// //     safeNavigate(`/practice-tests/${examData?.examId || ''}`);
// //   }, [safeNavigate, examData?.examId]);

// //   const handleSubmitTest = useCallback(() => {
// //     disableTestWarning();
// //     setTestFinished(true);
// //   }, [disableTestWarning]);

// //   const handleExitTest = useCallback(() => {
// //     const confirmExit = window.confirm(
// //       'Bạn có chắc muốn thoát khỏi bài test?\n\nTất cả tiến trình làm bài sẽ bị mất và không thể khôi phục. Bạn sẽ cần bắt đầu lại từ đầu nếu muốn làm bài test này.'
// //     );

// //     if (confirmExit) {
// //       disableTestWarning();
// //       router.push('/practice-tests');
// //     }
// //   }, [disableTestWarning, router]);

// //   const handlePartChange = useCallback(
// //     (index: number) => {
// //       setCurrentPartIndex(index);
// //     },
// //     [setCurrentPartIndex]
// //   );

// //   const handleRetry = useCallback(() => {
// //     setError(null);
// //     setCurrentPartIndex(currentPartIndex); // Trigger refetch
// //   }, [setError, setCurrentPartIndex, currentPartIndex]);

// //   // Render states
// //   if (testFinished) {
// //     return (
// //       <div className="flex relative">
// //         <div className="flex-1">
// //           <ExamFinished
// //             remainingTime={remainingTime}
// //             initialTime={initialTime}
// //             allAnswers={allAnswersRef.current}
// //             partDataCache={partDataCacheRef.current}
// //           />
// //         </div>

// //         {showDictionary && <DictionarySidebar hideButton={true} onClose={() => setShowDictionary(false)} />}
// //       </div>
// //     );
// //   }

// //   if (loading) return <FullPageLoader />;

// //   if (error) {
// //     return (
// //       <div className="flex relative">
// //         <div className="flex-1">
// //           <ExamError error={error} onBackToSetup={handleBackToSetup} onRetry={handleRetry} />
// //         </div>

// //         {showDictionary && <DictionarySidebar hideButton={true} onClose={() => setShowDictionary(false)} />}
// //       </div>
// //     );
// //   }

// //   const currentPartId = partIds[currentPartIndex];

// //   return (
// //     <div className="flex relative">
// //       <div className="flex-1">
// //         {/* Navigation Bar */}
// //         {!testFinished && !showingResult && (
// //           <ExamPartBar
// //             examData={examData}
// //             partIds={partIds}
// //             partNumbers={partNumbers}
// //             currentPartIndex={currentPartIndex}
// //             loadingPart={loadingPart}
// //             isFullExam={isFullExam}
// //             audioStatus={audioStatus}
// //             onPartChange={handlePartChange}
// //             onExitTest={handleExitTest}
// //           />
// //         )}

// //         {/* Main Content */}
// //         {loadingPart ? (
// //           <div className="text-center py-8">Đang tải Part {currentPartIndex + 1}...</div>
// //         ) : currentPartData ? (
// //           <ToeicTest
// //             key={currentPartId}
// //             partData={currentPartData}
// //             onPartComplete={handleNextPart}
// //             isLastPart={currentPartIndex === partIds.length - 1}
// //             currentPartIndex={currentPartIndex + 1}
// //             totalParts={partIds.length}
// //             isPaused={isPaused}
// //             remainingTime={remainingTime}
// //             onTimeChange={setRemainingTime}
// //             onSubmitTest={handleSubmitTest}
// //             initialAnswers={allAnswersRef.current[currentPartId] || {}}
// //             initialMarkedForReview={allMarkedForReviewRef.current[currentPartId] || {}}
// //             onAnswersChange={(answers) => updateAnswers(currentPartId, answers)}
// //             onMarkedForReviewChange={(marked) => updateMarkedForReview(currentPartId, marked)}
// //             allPartIds={partIds.map((id) => parseInt(id))}
// //             allAnswers={allAnswersRef.current}
// //             examStartTime={examStartTime}
// //             isFullExam={isFullExam}
// //             onShowResult={setShowingResult}
// //             onAudioStatusChange={updateAudioStatus}
// //           />
// //         ) : null}
// //       </div>

// //       {/* Sidebar từ điển luôn hiển thị */}
// //       {showDictionary && <DictionarySidebar hideButton={true} onClose={() => setShowDictionary(false)} />}
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Loader2, X } from 'lucide-react';

// interface DictionarySidebarProps {
//   onClose?: () => void;
// }

// // Lingva Translate
// export const translateText = async (text: string): Promise<string> => {
//   if (!text) return '';
//   try {
//     const source = 'en';
//     const target = 'vi';
//     const res = await fetch(
//       `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`,
//       { method: 'GET' }
//     );
//     if (!res.ok) throw new Error('Dịch thất bại');
//     const data = await res.json();
//     return data.translation || 'Không thể dịch';
//   } catch (error) {
//     console.error('Lỗi khi gọi Lingva Translate:', error);
//     return 'Không thể dịch';
//   }
// };

// export default function DictionarySidebar({ onClose }: DictionarySidebarProps) {
//   const [word, setWord] = useState('');
//   const [result, setResult] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
//   const [translations, setTranslations] = useState<Map<string, string>>(new Map());
  
  

//   const fetchMeaning = async (searchWord: string) => {
//     if (!searchWord) return null;
//     try {
//       const res = await fetch(
//         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
//       );
//       const data = await res.json();
//       if (Array.isArray(data)) return data[0];
//       return null;
//     } catch {
//       return null;
//     }
//   };

//   const fetchResults = async (w: string) => {
//     if (w.length < 2) {
//       setResult([]);
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
//       const data = await res.json();
//       const words = data.map((item: any) => item.word);

//       const results: any[] = [];
//       for (const w of words) {
//         const meaning = await fetchMeaning(w);
//         if (meaning) results.push({ word: w, meaning });
//       }

//       setResult(results.slice(0, 6));
//       setLoading(false);
//     } catch {
//       setResult([]);
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value;
//     setWord(val);

//     if (typingTimeout) clearTimeout(typingTimeout);
//     const timeout = setTimeout(() => fetchResults(val), 1000);
//     setTypingTimeout(timeout);
//   };

//   useEffect(() => {
//     const fetchAllTranslations = async () => {
//       const newTranslations = new Map<string, string>();
//       if (result.length === 0) {
//         setTranslations(newTranslations);
//         return;
//       }

//       for (const item of result) {
//         const definitions = item.meaning.meanings?.flatMap((m: any) =>
//           m.definitions.slice(0, 2).map((d: any) => d.definition)
//         ) || [];

//         for (const def of definitions) {
//           newTranslations.set(def, 'Đang dịch...');
//           setTranslations(new Map(newTranslations));
//           const translation = await translateText(def);
//           newTranslations.set(def, translation);
//           setTranslations(new Map(newTranslations));
//         }
//       }
//     };

//     fetchAllTranslations();
//   }, [result]);

//   return (
//     <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l shadow-lg flex flex-col z-40">
//       <Card className="h-full flex flex-col">
//         <CardHeader className="flex justify-between items-center">
//           <CardTitle className="flex items-center gap-2">Từ điển</CardTitle>
//           {onClose && (
//             <Button variant="outline" size="sm" onClick={onClose}>
//               <X className="h-4 w-4 mr-1" /> Ẩn
//             </Button>
//           )}
//         </CardHeader>

//         <CardContent className="flex flex-col gap-3 flex-1 overflow-hidden">
//           <Input
//             placeholder="Nhập từ tiếng Anh..."
//             value={word}
//             onChange={handleInputChange}
//           />

//           <div className="mt-2 flex-1 overflow-y-auto text-sm">
//             {loading ? (
//               <div className="flex justify-center items-center h-full">
//                 <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
//               </div>
//             ) : result.length > 0 ? (
//               <div>
//                 {result.map((item, idx) => (
//                   <div key={idx} className="mt-4 p-3 border rounded bg-gray-50 shadow-sm">
//                     <h2 className="text-lg font-bold text-blue-600">{item.word}</h2>
//                     {item.meaning.meanings?.map((m: any, idx: number) => (
//                       <div key={idx} className="mt-2">
//                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
//                         <ul className="list-disc list-inside space-y-1">
//                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
//                             const translation = translations.get(d.definition);
//                             return (
//                               <li key={i}>
//                                 <span className="text-gray-800">{d.definition}</span>
//                                 {translation ? (
//                                   <p className="text-gray-700 text-sm mt-1 italic">
//                                     <strong>Dịch:</strong> {translation}
//                                   </p>
//                                 ) : (
//                                   <p className="text-gray-500 text-sm italic">Đang dịch...</p>
//                                 )}
//                               </li>
//                             );
//                           })}
//                         </ul>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
//             )}
//           </div>
//         </CardContent>
//       </Card>
      
//     </div>
//   );
// }
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ToeicTest from './toeic-lr-test';
import FullPageLoader from '@/components/common/full-page-loader';

// Custom hooks
import { useNavigationWarning } from '@/hooks/use-navigation-warning';
import { useExamTimer } from '@/hooks/use-exam-timer';
import { useExamData } from '@/hooks/use-exam-data';
import { useAudioStatus } from '@/hooks/use-audio-status';

import ExamPartBar from '@/components/practice-tests/exam-part-bar';
import ExamFinished from '@/components/practice-tests/exam-finished';
import ExamError from '@/components/practice-tests/exam-error';

// Dictionary
import DictionarySidebar from '@/components/practice-tests/dictionary-sidebar';
import { Button } from '@/components/ui/button';
import { BookOpen, X } from 'lucide-react';

export default function TestPage() {
  const router = useRouter();

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [testFinished, setTestFinished] = useState<boolean>(false);
  const [examStartTime] = useState(() => new Date());
  const [showingResult, setShowingResult] = useState<boolean>(false);
  const [showDictionary, setShowDictionary] = useState<boolean>(false);

  // Custom hooks
  const {
    examData,
    partIds,
    partNumbers,
    currentPartIndex,
    currentPartData,
    loading,
    loadingPart,
    error,
    allAnswersRef,
    allMarkedForReviewRef,
    partDataCacheRef,
    setCurrentPartIndex,
    setError,
    updateAnswers,
    updateMarkedForReview,
    handleNextPart
  } = useExamData();

  const { audioStatus, updateAudioStatus } = useAudioStatus();

  const isTestActive = !loading && !error && !testFinished && !showingResult && partIds.length > 0;

  const { initialTime, remainingTime, isFullExam, setRemainingTime } = useExamTimer({
    isPaused,
    testFinished,
    onTimeUp: () => setTestFinished(true)
  });

  const { safeNavigate, disableTestWarning } = useNavigationWarning({
    isTestActive,
    warningMessage:
      'Bạn có chắc muốn rời khỏi bài test? Tất cả tiến trình làm bài sẽ bị mất và không thể khôi phục.'
  });

  // Handlers
  const handleBackToSetup = useCallback(() => {
    safeNavigate(`/practice-tests/${examData?.examId || ''}`);
  }, [safeNavigate, examData?.examId]);

  const handleSubmitTest = useCallback(() => {
    disableTestWarning();
    setTestFinished(true);
  }, [disableTestWarning]);

  const handleExitTest = useCallback(() => {
    const confirmExit = window.confirm(
      'Bạn có chắc muốn thoát khỏi bài test?\n\nTất cả tiến trình làm bài sẽ bị mất và không thể khôi phục. Bạn sẽ cần bắt đầu lại từ đầu nếu muốn làm bài test này.'
    );

    if (confirmExit) {
      disableTestWarning();
      router.push('/practice-tests');
    }
  }, [disableTestWarning, router]);

  const handlePartChange = useCallback(
    (index: number) => {
      setCurrentPartIndex(index);
    },
    [setCurrentPartIndex]
  );

  const handleRetry = useCallback(() => {
    setError(null);
    setCurrentPartIndex(currentPartIndex); // Trigger refetch
  }, [setError, setCurrentPartIndex, currentPartIndex]);

  // Render states
  if (testFinished) {
    return (
      <div className="flex relative">
        <div className="flex-1">
          <ExamFinished
            remainingTime={remainingTime}
            initialTime={initialTime}
            allAnswers={allAnswersRef.current}
            partDataCache={partDataCacheRef.current}
          />
        </div>

        {showDictionary && <DictionarySidebar onClose={() => setShowDictionary(false)} />}

        {/* Toggle Button */}
        <Button
          onClick={() => setShowDictionary(!showDictionary)}
          className="fixed bottom-6 right-6 rounded-full shadow-lg"
          size="icon"
        >
          {showDictionary ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
        </Button>
      </div>
    );
  }

  if (loading) {
    return <FullPageLoader />;
  }

  if (error) {
    return (
      <div className="flex relative">
        <div className="flex-1">
          <ExamError error={error} onBackToSetup={handleBackToSetup} onRetry={handleRetry} />
        </div>

        {showDictionary && <DictionarySidebar onClose={() => setShowDictionary(false)} />}

        {/* Toggle Button */}
        <Button
          onClick={() => setShowDictionary(!showDictionary)}
          className="fixed bottom-6 right-6 rounded-full shadow-lg"
          size="icon"
        >
          {showDictionary ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
        </Button>
      </div>
    );
  }

  const currentPartId = partIds[currentPartIndex];

  return (
    <div className="flex relative">
      <div className="flex-1">
        {/* Navigation Bar */}
        {!testFinished && !showingResult && (
          <ExamPartBar
            examData={examData}
            partIds={partIds}
            partNumbers={partNumbers}
            currentPartIndex={currentPartIndex}
            loadingPart={loadingPart}
            isFullExam={isFullExam}
            audioStatus={audioStatus}
            onPartChange={handlePartChange}
            onExitTest={handleExitTest}
          />
        )}

        {/* Main Content */}
        {loadingPart ? (
          <div className="text-center py-8">Đang tải Part {currentPartIndex + 1}...</div>
        ) : currentPartData ? (
          <ToeicTest
            key={currentPartId}
            partData={currentPartData}
            onPartComplete={handleNextPart}
            isLastPart={currentPartIndex === partIds.length - 1}
            currentPartIndex={currentPartIndex + 1}
            totalParts={partIds.length}
            isPaused={isPaused}
            remainingTime={remainingTime}
            onTimeChange={setRemainingTime}
            onSubmitTest={handleSubmitTest}
            initialAnswers={allAnswersRef.current[currentPartId] || {}}
            initialMarkedForReview={allMarkedForReviewRef.current[currentPartId] || {}}
            onAnswersChange={(answers) => updateAnswers(currentPartId, answers)}
            onMarkedForReviewChange={(marked) => updateMarkedForReview(currentPartId, marked)}
            allPartIds={partIds.map((id) => parseInt(id))}
            allAnswers={allAnswersRef.current}
            examStartTime={examStartTime}
            isFullExam={isFullExam}
            onShowResult={setShowingResult}
            onAudioStatusChange={updateAudioStatus}
          />
        ) : null}
      </div>

      {/* Sidebar từ điển (ẩn/hiện) */}
      {showDictionary && <DictionarySidebar onClose={() => setShowDictionary(false)} />}

      {/* Nút toggle từ điển */}
      <Button
        onClick={() => setShowDictionary(!showDictionary)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        size="icon"
      >
        {showDictionary ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
      </Button>
    </div>
  );
}