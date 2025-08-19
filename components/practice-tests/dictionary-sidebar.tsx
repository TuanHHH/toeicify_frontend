// // // // // // // // // // // 'use client';

// // // // // // // // // // // import { useState, useEffect } from 'react';
// // // // // // // // // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // // // // // // // import { Input } from '@/components/ui/input';
// // // // // // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // // // // // import { Loader2, BookOpen, X } from 'lucide-react';

// // // // // // // // // // // // --- API dịch trực tiếp Lingva Translate ---
// // // // // // // // // // // export const translateText = async (text: string): Promise<string> => {
// // // // // // // // // // //   if (!text) return '';

// // // // // // // // // // //   try {
// // // // // // // // // // //     const source = 'en'; // ngôn ngữ nguồn
// // // // // // // // // // //     const target = 'vi'; // ngôn ngữ đích
// // // // // // // // // // //     const res = await fetch(
// // // // // // // // // // //       `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`,
// // // // // // // // // // //       { method: 'GET' }
// // // // // // // // // // //     );

// // // // // // // // // // //     if (!res.ok) throw new Error('Dịch thất bại');
// // // // // // // // // // //     const data = await res.json();

// // // // // // // // // // //     return data.translation || 'Không thể dịch';
// // // // // // // // // // //   } catch (error) {
// // // // // // // // // // //     console.error('Lỗi khi gọi Lingva Translate:', error);
// // // // // // // // // // //     return 'Không thể dịch';
// // // // // // // // // // //   }
// // // // // // // // // // // };

// // // // // // // // // // // // --- Component DictionarySidebar ---
// // // // // // // // // // // export default function DictionarySidebar() {
// // // // // // // // // // //   const [open, setOpen] = useState(false);
// // // // // // // // // // //   const [word, setWord] = useState('');
// // // // // // // // // // //   const [result, setResult] = useState<any[]>([]);
// // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // //   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
// // // // // // // // // // //   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

// // // // // // // // // // //   // --- API nghĩa từ dictionaryapi.dev ---
// // // // // // // // // // //   const fetchMeaning = async (searchWord: string) => {
// // // // // // // // // // //     if (!searchWord) return null;
// // // // // // // // // // //     try {
// // // // // // // // // // //       const res = await fetch(
// // // // // // // // // // //         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
// // // // // // // // // // //       );
// // // // // // // // // // //       const data = await res.json();
// // // // // // // // // // //       if (Array.isArray(data)) return data[0];
// // // // // // // // // // //       return null;
// // // // // // // // // // //     } catch {
// // // // // // // // // // //       return null;
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   // --- Lấy kết quả gợi ý từ datamuse ---
// // // // // // // // // // //   const fetchResults = async (w: string) => {
// // // // // // // // // // //     if (w.length < 2) {
// // // // // // // // // // //       setResult([]);
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     try {
// // // // // // // // // // //       setLoading(true);
// // // // // // // // // // //       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
// // // // // // // // // // //       const data = await res.json();
// // // // // // // // // // //       const words = data.map((item: any) => item.word);

// // // // // // // // // // //       const results: any[] = [];
// // // // // // // // // // //       for (const w of words) {
// // // // // // // // // // //         const meaning = await fetchMeaning(w);
// // // // // // // // // // //         if (meaning) results.push({ word: w, meaning });
// // // // // // // // // // //       }

// // // // // // // // // // //       setResult(results.slice(0, 6));
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     } catch {
// // // // // // // // // // //       setResult([]);
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   // --- Khi gõ input ---
// // // // // // // // // // //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // // // // // //     const val = e.target.value;
// // // // // // // // // // //     setWord(val);

// // // // // // // // // // //     if (typingTimeout) clearTimeout(typingTimeout);
// // // // // // // // // // //     const timeout = setTimeout(() => fetchResults(val), 1000);
// // // // // // // // // // //     setTypingTimeout(timeout);
// // // // // // // // // // //   };

// // // // // // // // // // //   // --- Dịch từng definition riêng bằng Lingva Translate ---
// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     const fetchAllTranslations = async () => {
// // // // // // // // // // //       const newTranslations = new Map<string, string>();
// // // // // // // // // // //       if (result.length === 0) {
// // // // // // // // // // //         setTranslations(newTranslations);
// // // // // // // // // // //         return;
// // // // // // // // // // //       }

// // // // // // // // // // //       for (const item of result) {
// // // // // // // // // // //         const definitions = item.meaning.meanings?.flatMap((m: any) =>
// // // // // // // // // // //           m.definitions.slice(0, 2).map((d: any) => d.definition)
// // // // // // // // // // //         ) || [];

// // // // // // // // // // //         for (const def of definitions) {
// // // // // // // // // // //           newTranslations.set(def, 'Đang dịch...');
// // // // // // // // // // //           setTranslations(new Map(newTranslations)); // Cập nhật state hiển thị
// // // // // // // // // // //           const translation = await translateText(def);
// // // // // // // // // // //           newTranslations.set(def, translation);
// // // // // // // // // // //           setTranslations(new Map(newTranslations)); // Update từng câu
// // // // // // // // // // //         }
// // // // // // // // // // //       }
// // // // // // // // // // //     };

// // // // // // // // // // //     fetchAllTranslations();
// // // // // // // // // // //   }, [result]);

// // // // // // // // // // //   return (
// // // // // // // // // // //     <>
// // // // // // // // // // //       {!open ? (
// // // // // // // // // // //         <Button
// // // // // // // // // // //           onClick={() => setOpen(true)}
// // // // // // // // // // //           className="fixed right-4 top-4 z-50 shadow-md"
// // // // // // // // // // //         >
// // // // // // // // // // //           <BookOpen className="h-4 w-4 mr-2" /> Hiện từ điển
// // // // // // // // // // //         </Button>
// // // // // // // // // // //       ) : (
// // // // // // // // // // //         <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l shadow-lg flex flex-col z-40">
// // // // // // // // // // //           <Card className="h-full flex flex-col">
// // // // // // // // // // //             <CardHeader className="flex justify-between items-center">
// // // // // // // // // // //               <CardTitle className="flex items-center gap-2">
// // // // // // // // // // //                 <BookOpen className="h-5 w-5 text-blue-600" />
// // // // // // // // // // //                 Từ điển
// // // // // // // // // // //               </CardTitle>
// // // // // // // // // // //               <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
// // // // // // // // // // //                 <X className="h-4 w-4 mr-1" /> Ẩn
// // // // // // // // // // //               </Button>
// // // // // // // // // // //             </CardHeader>

// // // // // // // // // // //             <CardContent className="flex flex-col gap-3 flex-1 overflow-hidden">
// // // // // // // // // // //               <Input
// // // // // // // // // // //                 placeholder="Nhập từ tiếng Anh..."
// // // // // // // // // // //                 value={word}
// // // // // // // // // // //                 onChange={handleInputChange}
// // // // // // // // // // //               />

// // // // // // // // // // //               <div className="mt-2 flex-1 overflow-y-auto text-sm">
// // // // // // // // // // //                 {loading ? (
// // // // // // // // // // //                   <div className="flex justify-center items-center h-full">
// // // // // // // // // // //                     <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 ) : result.length > 0 ? (
// // // // // // // // // // //                   <div>
// // // // // // // // // // //                     {result.map((item, idx) => (
// // // // // // // // // // //                       <div key={idx} className="mt-4 p-3 border rounded bg-gray-50 shadow-sm">
// // // // // // // // // // //                         <h2 className="text-lg font-bold text-blue-600">{item.word}</h2>
// // // // // // // // // // //                         {item.meaning.meanings?.map((m: any, idx: number) => (
// // // // // // // // // // //                           <div key={idx} className="mt-2">
// // // // // // // // // // //                             <p className="italic text-gray-600">{m.partOfSpeech}</p>
// // // // // // // // // // //                             <ul className="list-disc list-inside space-y-1">
// // // // // // // // // // //                               {m.definitions.slice(0, 2).map((d: any, i: number) => {
// // // // // // // // // // //                                 const translation = translations.get(d.definition);
// // // // // // // // // // //                                 return (
// // // // // // // // // // //                                   <li key={i}>
// // // // // // // // // // //                                     <span className="text-gray-800">{d.definition}</span>
// // // // // // // // // // //                                     {translation ? (
// // // // // // // // // // //                                       <p className="text-gray-700 text-sm mt-1 italic">
// // // // // // // // // // //                                         <strong>Dịch:</strong> {translation}
// // // // // // // // // // //                                       </p>
// // // // // // // // // // //                                     ) : (
// // // // // // // // // // //                                       <p className="text-gray-500 text-sm italic">Đang dịch...</p>
// // // // // // // // // // //                                     )}
// // // // // // // // // // //                                   </li>
// // // // // // // // // // //                                 );
// // // // // // // // // // //                               })}
// // // // // // // // // // //                             </ul>
// // // // // // // // // // //                           </div>
// // // // // // // // // // //                         ))}
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                     ))}
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 ) : (
// // // // // // // // // // //                   <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </div>
// // // // // // // // // // //             </CardContent>
// // // // // // // // // // //           </Card>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       )}
// // // // // // // // // // //     </>
// // // // // // // // // // //   );
// // // // // // // // // // // }

// // // // // // // // // // 'use client';

// // // // // // // // // // import { useState, useEffect } from 'react';
// // // // // // // // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // // // // // // import { Input } from '@/components/ui/input';
// // // // // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // // // // import { Loader2, X } from 'lucide-react';

// // // // // // // // // // interface DictionarySidebarProps {
// // // // // // // // // //   hideButton?: boolean; // ẩn nút “Hiện từ điển”
// // // // // // // // // //   onClose?: () => void; // callback khi ấn nút ẩn
// // // // // // // // // // }

// // // // // // // // // // // Lingva Translate
// // // // // // // // // // export const translateText = async (text: string): Promise<string> => {
// // // // // // // // // //   if (!text) return '';
// // // // // // // // // //   try {
// // // // // // // // // //     const source = 'en';
// // // // // // // // // //     const target = 'vi';
// // // // // // // // // //     const res = await fetch(
// // // // // // // // // //       `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`,
// // // // // // // // // //       { method: 'GET' }
// // // // // // // // // //     );
// // // // // // // // // //     if (!res.ok) throw new Error('Dịch thất bại');
// // // // // // // // // //     const data = await res.json();
// // // // // // // // // //     return data.translation || 'Không thể dịch';
// // // // // // // // // //   } catch (error) {
// // // // // // // // // //     console.error('Lỗi khi gọi Lingva Translate:', error);
// // // // // // // // // //     return 'Không thể dịch';
// // // // // // // // // //   }
// // // // // // // // // // };

// // // // // // // // // // export default function DictionarySidebar({ hideButton, onClose }: DictionarySidebarProps) {
// // // // // // // // // //   const [word, setWord] = useState('');
// // // // // // // // // //   const [result, setResult] = useState<any[]>([]);
// // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // //   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
// // // // // // // // // //   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

// // // // // // // // // //   const fetchMeaning = async (searchWord: string) => {
// // // // // // // // // //     if (!searchWord) return null;
// // // // // // // // // //     try {
// // // // // // // // // //       const res = await fetch(
// // // // // // // // // //         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
// // // // // // // // // //       );
// // // // // // // // // //       const data = await res.json();
// // // // // // // // // //       if (Array.isArray(data)) return data[0];
// // // // // // // // // //       return null;
// // // // // // // // // //     } catch {
// // // // // // // // // //       return null;
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const fetchResults = async (w: string) => {
// // // // // // // // // //     if (w.length < 2) {
// // // // // // // // // //       setResult([]);
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     try {
// // // // // // // // // //       setLoading(true);
// // // // // // // // // //       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
// // // // // // // // // //       const data = await res.json();
// // // // // // // // // //       const words = data.map((item: any) => item.word);

// // // // // // // // // //       const results: any[] = [];
// // // // // // // // // //       for (const w of words) {
// // // // // // // // // //         const meaning = await fetchMeaning(w);
// // // // // // // // // //         if (meaning) results.push({ word: w, meaning });
// // // // // // // // // //       }

// // // // // // // // // //       setResult(results.slice(0, 6));
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     } catch {
// // // // // // // // // //       setResult([]);
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // // // // //     const val = e.target.value;
// // // // // // // // // //     setWord(val);

// // // // // // // // // //     if (typingTimeout) clearTimeout(typingTimeout);
// // // // // // // // // //     const timeout = setTimeout(() => fetchResults(val), 1000);
// // // // // // // // // //     setTypingTimeout(timeout);
// // // // // // // // // //   };

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     const fetchAllTranslations = async () => {
// // // // // // // // // //       const newTranslations = new Map<string, string>();
// // // // // // // // // //       if (result.length === 0) {
// // // // // // // // // //         setTranslations(newTranslations);
// // // // // // // // // //         return;
// // // // // // // // // //       }

// // // // // // // // // //       for (const item of result) {
// // // // // // // // // //         const definitions = item.meaning.meanings?.flatMap((m: any) =>
// // // // // // // // // //           m.definitions.slice(0, 2).map((d: any) => d.definition)
// // // // // // // // // //         ) || [];

// // // // // // // // // //         for (const def of definitions) {
// // // // // // // // // //           newTranslations.set(def, 'Đang dịch...');
// // // // // // // // // //           setTranslations(new Map(newTranslations));
// // // // // // // // // //           const translation = await translateText(def);
// // // // // // // // // //           newTranslations.set(def, translation);
// // // // // // // // // //           setTranslations(new Map(newTranslations));
// // // // // // // // // //         }
// // // // // // // // // //       }
// // // // // // // // // //     };

// // // // // // // // // //     fetchAllTranslations();
// // // // // // // // // //   }, [result]);

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l shadow-lg flex flex-col z-40">
// // // // // // // // // //       <Card className="h-full flex flex-col">
// // // // // // // // // //         <CardHeader className="flex justify-between items-center">
// // // // // // // // // //           <CardTitle className="flex items-center gap-2">
// // // // // // // // // //             Từ điển
// // // // // // // // // //           </CardTitle>
// // // // // // // // // //           {onClose && (
// // // // // // // // // //             <Button variant="outline" size="sm" onClick={onClose}>
// // // // // // // // // //               <X className="h-4 w-4 mr-1" /> Ẩn
// // // // // // // // // //             </Button>
// // // // // // // // // //           )}
// // // // // // // // // //         </CardHeader>

// // // // // // // // // //         <CardContent className="flex flex-col gap-3 flex-1 overflow-hidden">
// // // // // // // // // //           <Input
// // // // // // // // // //             placeholder="Nhập từ tiếng Anh..."
// // // // // // // // // //             value={word}
// // // // // // // // // //             onChange={handleInputChange}
// // // // // // // // // //           />

// // // // // // // // // //           <div className="mt-2 flex-1 overflow-y-auto text-sm">
// // // // // // // // // //             {loading ? (
// // // // // // // // // //               <div className="flex justify-center items-center h-full">
// // // // // // // // // //                 <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
// // // // // // // // // //               </div>
// // // // // // // // // //             ) : result.length > 0 ? (
// // // // // // // // // //               <div>
// // // // // // // // // //                 {result.map((item, idx) => (
// // // // // // // // // //                   <div key={idx} className="mt-4 p-3 border rounded bg-gray-50 shadow-sm">
// // // // // // // // // //                     <h2 className="text-lg font-bold text-blue-600">{item.word}</h2>
// // // // // // // // // //                     {item.meaning.meanings?.map((m: any, idx: number) => (
// // // // // // // // // //                       <div key={idx} className="mt-2">
// // // // // // // // // //                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
// // // // // // // // // //                         <ul className="list-disc list-inside space-y-1">
// // // // // // // // // //                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
// // // // // // // // // //                             const translation = translations.get(d.definition);
// // // // // // // // // //                             return (
// // // // // // // // // //                               <li key={i}>
// // // // // // // // // //                                 <span className="text-gray-800">{d.definition}</span>
// // // // // // // // // //                                 {translation ? (
// // // // // // // // // //                                   <p className="text-gray-700 text-sm mt-1 italic">
// // // // // // // // // //                                     <strong>Dịch:</strong> {translation}
// // // // // // // // // //                                   </p>
// // // // // // // // // //                                 ) : (
// // // // // // // // // //                                   <p className="text-gray-500 text-sm italic">Đang dịch...</p>
// // // // // // // // // //                                 )}
// // // // // // // // // //                               </li>
// // // // // // // // // //                             );
// // // // // // // // // //                           })}
// // // // // // // // // //                         </ul>
// // // // // // // // // //                       </div>
// // // // // // // // // //                     ))}
// // // // // // // // // //                   </div>
// // // // // // // // // //                 ))}
// // // // // // // // // //               </div>
// // // // // // // // // //             ) : (
// // // // // // // // // //               <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
// // // // // // // // // //             )}
// // // // // // // // // //           </div>
// // // // // // // // // //         </CardContent>
// // // // // // // // // //       </Card>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // }
// // // // // // // // // 'use client';

// // // // // // // // // import { useState, useEffect } from 'react';
// // // // // // // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // // // // // import { Input } from '@/components/ui/input';
// // // // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // // // import { Loader2, X } from 'lucide-react';

// // // // // // // // // interface DictionarySidebarProps {
// // // // // // // // //   hideButton?: boolean; // ẩn nút “Hiện từ điển”
// // // // // // // // //   onClose?: () => void; // callback khi ấn nút ẩn
// // // // // // // // // }

// // // // // // // // // // Lingva Translate
// // // // // // // // // export const translateText = async (text: string): Promise<string> => {
// // // // // // // // //   if (!text) return '';
// // // // // // // // //   try {
// // // // // // // // //     const source = 'en';
// // // // // // // // //     const target = 'vi';
// // // // // // // // //     const res = await fetch(
// // // // // // // // //       `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`,
// // // // // // // // //       { method: 'GET' }
// // // // // // // // //     );
// // // // // // // // //     if (!res.ok) throw new Error('Dịch thất bại');
// // // // // // // // //     const data = await res.json();
// // // // // // // // //     return data.translation || 'Không thể dịch';
// // // // // // // // //   } catch (error) {
// // // // // // // // //     console.error('Lỗi khi gọi Lingva Translate:', error);
// // // // // // // // //     return 'Không thể dịch';
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // export default function DictionarySidebar({ hideButton, onClose }: DictionarySidebarProps) {
// // // // // // // // //   const [word, setWord] = useState('');
// // // // // // // // //   const [result, setResult] = useState<any[]>([]);
// // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // //   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
// // // // // // // // //   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

// // // // // // // // //   const fetchMeaning = async (searchWord: string) => {
// // // // // // // // //     if (!searchWord) return null;
// // // // // // // // //     try {
// // // // // // // // //       const res = await fetch(
// // // // // // // // //         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
// // // // // // // // //       );
// // // // // // // // //       const data = await res.json();
// // // // // // // // //       if (Array.isArray(data)) return data[0];
// // // // // // // // //       return null;
// // // // // // // // //     } catch {
// // // // // // // // //       return null;
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const fetchResults = async (w: string) => {
// // // // // // // // //     if (w.length < 2) {
// // // // // // // // //       setResult([]);
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     try {
// // // // // // // // //       setLoading(true);
// // // // // // // // //       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
// // // // // // // // //       const data = await res.json();
// // // // // // // // //       const words = data.map((item: any) => item.word);

// // // // // // // // //       const results: any[] = [];
// // // // // // // // //       for (const w of words) {
// // // // // // // // //         const meaning = await fetchMeaning(w);
// // // // // // // // //         if (meaning) results.push({ word: w, meaning });
// // // // // // // // //       }

// // // // // // // // //       setResult(results.slice(0, 6));
// // // // // // // // //       setLoading(false);
// // // // // // // // //     } catch {
// // // // // // // // //       setResult([]);
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // // // //     const val = e.target.value;
// // // // // // // // //     setWord(val);

// // // // // // // // //     if (typingTimeout) clearTimeout(typingTimeout);
// // // // // // // // //     const timeout = setTimeout(() => fetchResults(val), 1000);
// // // // // // // // //     setTypingTimeout(timeout);
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const fetchAllTranslations = async () => {
// // // // // // // // //       const newTranslations = new Map<string, string>();
// // // // // // // // //       if (result.length === 0) {
// // // // // // // // //         setTranslations(newTranslations);
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       for (const item of result) {
// // // // // // // // //         const definitions = item.meaning.meanings?.flatMap((m: any) =>
// // // // // // // // //           m.definitions.slice(0, 2).map((d: any) => d.definition)
// // // // // // // // //         ) || [];

// // // // // // // // //         for (const def of definitions) {
// // // // // // // // //           newTranslations.set(def, 'Đang dịch...');
// // // // // // // // //           setTranslations(new Map(newTranslations));
// // // // // // // // //           const translation = await translateText(def);
// // // // // // // // //           newTranslations.set(def, translation);
// // // // // // // // //           setTranslations(new Map(newTranslations));
// // // // // // // // //         }
// // // // // // // // //       }
// // // // // // // // //     };

// // // // // // // // //     fetchAllTranslations();
// // // // // // // // //   }, [result]);

// // // // // // // // //   return (
// // // // // // // // //     <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l shadow-lg flex flex-col z-40">
// // // // // // // // //       <Card className="h-full flex flex-col">
// // // // // // // // //         <CardHeader className="flex justify-between items-center">
// // // // // // // // //           <CardTitle className="flex items-center gap-2">
// // // // // // // // //             Từ điển
// // // // // // // // //           </CardTitle>
// // // // // // // // //           {onClose && (
// // // // // // // // //             <Button variant="outline" size="sm" onClick={onClose}>
// // // // // // // // //               <X className="h-4 w-4 mr-1" /> Ẩn
// // // // // // // // //             </Button>
// // // // // // // // //           )}
// // // // // // // // //         </CardHeader>

// // // // // // // // //         <CardContent className="flex flex-col gap-3 flex-1 overflow-hidden">
// // // // // // // // //           <Input
// // // // // // // // //             placeholder="Nhập từ tiếng Anh..."
// // // // // // // // //             value={word}
// // // // // // // // //             onChange={handleInputChange}
// // // // // // // // //           />

// // // // // // // // //           <div className="mt-2 flex-1 overflow-y-auto text-sm">
// // // // // // // // //             {loading ? (
// // // // // // // // //               <div className="flex justify-center items-center h-full">
// // // // // // // // //                 <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
// // // // // // // // //               </div>
// // // // // // // // //             ) : result.length > 0 ? (
// // // // // // // // //               <div>
// // // // // // // // //                 {result.map((item, idx) => (
// // // // // // // // //                   <div key={idx} className="mt-4 p-3 border rounded bg-gray-50 shadow-sm">
// // // // // // // // //                     <h2 className="text-lg font-bold text-blue-600">{item.word}</h2>
// // // // // // // // //                     {item.meaning.meanings?.map((m: any, idx: number) => (
// // // // // // // // //                       <div key={idx} className="mt-2">
// // // // // // // // //                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
// // // // // // // // //                         <ul className="list-disc list-inside space-y-1">
// // // // // // // // //                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
// // // // // // // // //                             const translation = translations.get(d.definition);
// // // // // // // // //                             return (
// // // // // // // // //                               <li key={i}>
// // // // // // // // //                                 <span className="text-gray-800">{d.definition}</span>
// // // // // // // // //                                 {translation ? (
// // // // // // // // //                                   <p className="text-gray-700 text-sm mt-1 italic">
// // // // // // // // //                                     <strong>Dịch:</strong> {translation}
// // // // // // // // //                                   </p>
// // // // // // // // //                                 ) : (
// // // // // // // // //                                   <p className="text-gray-500 text-sm italic">Đang dịch...</p>
// // // // // // // // //                                 )}
// // // // // // // // //                               </li>
// // // // // // // // //                             );
// // // // // // // // //                           })}
// // // // // // // // //                         </ul>
// // // // // // // // //                       </div>
// // // // // // // // //                     ))}
// // // // // // // // //                   </div>
// // // // // // // // //                 ))}
// // // // // // // // //               </div>
// // // // // // // // //             ) : (
// // // // // // // // //               <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
// // // // // // // // //             )}
// // // // // // // // //           </div>
// // // // // // // // //         </CardContent>
// // // // // // // // //       </Card>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }


// // // // // // // // 'use client';

// // // // // // // // import { useState, useCallback } from 'react';
// // // // // // // // import { useRouter } from 'next/navigation';
// // // // // // // // import ToeicTest from './toeic-lr-test';
// // // // // // // // import FullPageLoader from '@/components/common/full-page-loader';

// // // // // // // // // Custom hooks
// // // // // // // // import { useNavigationWarning } from '@/hooks/use-navigation-warning';
// // // // // // // // import { useExamTimer } from '@/hooks/use-exam-timer';
// // // // // // // // import { useExamData } from '@/hooks/use-exam-data';
// // // // // // // // import { useAudioStatus } from '@/hooks/use-audio-status';

// // // // // // // // import ExamPartBar from '@/components/practice-tests/exam-part-bar';
// // // // // // // // import ExamFinished from '@/components/practice-tests/exam-finished';
// // // // // // // // import ExamError from '@/components/practice-tests/exam-error';

// // // // // // // // // Dictionary
// // // // // // // // import DictionarySidebar from '@/components/practice-tests/dictionary-sidebar';
// // // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // // import { BookOpen, X } from 'lucide-react';

// // // // // // // // export default function TestPage() {
// // // // // // // //   const router = useRouter();

// // // // // // // //   const [isPaused, setIsPaused] = useState<boolean>(false);
// // // // // // // //   const [testFinished, setTestFinished] = useState<boolean>(false);
// // // // // // // //   const [examStartTime] = useState(() => new Date());
// // // // // // // //   const [showingResult, setShowingResult] = useState<boolean>(false);
// // // // // // // //   const [showDictionary, setShowDictionary] = useState<boolean>(false); // ban đầu chưa hiển thị sidebar

// // // // // // // //   // Custom hooks
// // // // // // // //   const {
// // // // // // // //     examData,
// // // // // // // //     partIds,
// // // // // // // //     partNumbers,
// // // // // // // //     currentPartIndex,
// // // // // // // //     currentPartData,
// // // // // // // //     loading,
// // // // // // // //     loadingPart,
// // // // // // // //     error,
// // // // // // // //     allAnswersRef,
// // // // // // // //     allMarkedForReviewRef,
// // // // // // // //     partDataCacheRef,
// // // // // // // //     setCurrentPartIndex,
// // // // // // // //     setError,
// // // // // // // //     updateAnswers,
// // // // // // // //     updateMarkedForReview,
// // // // // // // //     handleNextPart
// // // // // // // //   } = useExamData();

// // // // // // // //   const { audioStatus, updateAudioStatus } = useAudioStatus();

// // // // // // // //   const isTestActive = !loading && !error && !testFinished && !showingResult && partIds.length > 0;

// // // // // // // //   const { initialTime, remainingTime, isFullExam, setRemainingTime } = useExamTimer({
// // // // // // // //     isPaused,
// // // // // // // //     testFinished,
// // // // // // // //     onTimeUp: () => setTestFinished(true)
// // // // // // // //   });

// // // // // // // //   const { safeNavigate, disableTestWarning } = useNavigationWarning({
// // // // // // // //     isTestActive,
// // // // // // // //     warningMessage:
// // // // // // // //       'Bạn có chắc muốn rời khỏi bài test? Tất cả tiến trình làm bài sẽ bị mất và không thể khôi phục.'
// // // // // // // //   });

// // // // // // // //   const handleBackToSetup = useCallback(() => {
// // // // // // // //     safeNavigate(`/practice-tests/${examData?.examId || ''}`);
// // // // // // // //   }, [safeNavigate, examData?.examId]);

// // // // // // // //   const handleSubmitTest = useCallback(() => {
// // // // // // // //     disableTestWarning();
// // // // // // // //     setTestFinished(true);
// // // // // // // //   }, [disableTestWarning]);

// // // // // // // //   const handleExitTest = useCallback(() => {
// // // // // // // //     const confirmExit = window.confirm(
// // // // // // // //       'Bạn có chắc muốn thoát khỏi bài test?\n\nTất cả tiến trình làm bài sẽ bị mất và không thể khôi phục. Bạn sẽ cần bắt đầu lại từ đầu nếu muốn làm bài test này.'
// // // // // // // //     );

// // // // // // // //     if (confirmExit) {
// // // // // // // //       disableTestWarning();
// // // // // // // //       router.push('/practice-tests');
// // // // // // // //     }
// // // // // // // //   }, [disableTestWarning, router]);

// // // // // // // //   const handlePartChange = useCallback(
// // // // // // // //     (index: number) => {
// // // // // // // //       setCurrentPartIndex(index);
// // // // // // // //     },
// // // // // // // //     [setCurrentPartIndex]
// // // // // // // //   );

// // // // // // // //   const handleRetry = useCallback(() => {
// // // // // // // //     setError(null);
// // // // // // // //     setCurrentPartIndex(currentPartIndex);
// // // // // // // //   }, [setError, setCurrentPartIndex, currentPartIndex]);

// // // // // // // //   // Render states
// // // // // // // //   if (testFinished) {
// // // // // // // //     return (
// // // // // // // //       <div className="flex relative">
// // // // // // // //         <div className="flex-1">
// // // // // // // //           <ExamFinished
// // // // // // // //             remainingTime={remainingTime}
// // // // // // // //             initialTime={initialTime}
// // // // // // // //             allAnswers={allAnswersRef.current}
// // // // // // // //             partDataCache={partDataCacheRef.current}
// // // // // // // //           />
// // // // // // // //         </div>

// // // // // // // //         {showDictionary && <DictionarySidebar onClose={() => setShowDictionary(false)} />}
        
// // // // // // // //         {/* Toggle icon luôn hiện */}
// // // // // // // //         <Button
// // // // // // // //           onClick={() => setShowDictionary(!showDictionary)}
// // // // // // // //           className="fixed bottom-6 right-6 rounded-full shadow-lg"
// // // // // // // //           size="icon"
// // // // // // // //         >
// // // // // // // //           {showDictionary ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
// // // // // // // //         </Button>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   if (loading) return <FullPageLoader />;

// // // // // // // //   if (error) {
// // // // // // // //     return (
// // // // // // // //       <div className="flex relative">
// // // // // // // //         <div className="flex-1">
// // // // // // // //           <ExamError error={error} onBackToSetup={handleBackToSetup} onRetry={handleRetry} />
// // // // // // // //         </div>

// // // // // // // //         {showDictionary && <DictionarySidebar onClose={() => setShowDictionary(false)} />}
        
// // // // // // // //         <Button
// // // // // // // //           onClick={() => setShowDictionary(!showDictionary)}
// // // // // // // //           className="fixed bottom-6 right-6 rounded-full shadow-lg"
// // // // // // // //           size="icon"
// // // // // // // //         >
// // // // // // // //           {showDictionary ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
// // // // // // // //         </Button>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   const currentPartId = partIds[currentPartIndex];

// // // // // // // //   return (
// // // // // // // //     <div className="flex relative">
// // // // // // // //       <div className="flex-1">
// // // // // // // //         {!testFinished && !showingResult && (
// // // // // // // //           <ExamPartBar
// // // // // // // //             examData={examData}
// // // // // // // //             partIds={partIds}
// // // // // // // //             partNumbers={partNumbers}
// // // // // // // //             currentPartIndex={currentPartIndex}
// // // // // // // //             loadingPart={loadingPart}
// // // // // // // //             isFullExam={isFullExam}
// // // // // // // //             audioStatus={audioStatus}
// // // // // // // //             onPartChange={handlePartChange}
// // // // // // // //             onExitTest={handleExitTest}
// // // // // // // //           />
// // // // // // // //         )}

// // // // // // // //         {loadingPart ? (
// // // // // // // //           <div className="text-center py-8">Đang tải Part {currentPartIndex + 1}...</div>
// // // // // // // //         ) : currentPartData ? (
// // // // // // // //           <ToeicTest
// // // // // // // //             key={currentPartId}
// // // // // // // //             partData={currentPartData}
// // // // // // // //             onPartComplete={handleNextPart}
// // // // // // // //             isLastPart={currentPartIndex === partIds.length - 1}
// // // // // // // //             currentPartIndex={currentPartIndex + 1}
// // // // // // // //             totalParts={partIds.length}
// // // // // // // //             isPaused={isPaused}
// // // // // // // //             remainingTime={remainingTime}
// // // // // // // //             onTimeChange={setRemainingTime}
// // // // // // // //             onSubmitTest={handleSubmitTest}
// // // // // // // //             initialAnswers={allAnswersRef.current[currentPartId] || {}}
// // // // // // // //             initialMarkedForReview={allMarkedForReviewRef.current[currentPartId] || {}}
// // // // // // // //             onAnswersChange={(answers) => updateAnswers(currentPartId, answers)}
// // // // // // // //             onMarkedForReviewChange={(marked) => updateMarkedForReview(currentPartId, marked)}
// // // // // // // //             allPartIds={partIds.map((id) => parseInt(id))}
// // // // // // // //             allAnswers={allAnswersRef.current}
// // // // // // // //             examStartTime={examStartTime}
// // // // // // // //             isFullExam={isFullExam}
// // // // // // // //             onShowResult={setShowingResult}
// // // // // // // //             onAudioStatusChange={updateAudioStatus}
// // // // // // // //           />
// // // // // // // //         ) : null}
// // // // // // // //       </div>

// // // // // // // //       {/* Sidebar Dictionary */}
// // // // // // // //       {showDictionary && <DictionarySidebar onClose={() => setShowDictionary(false)} />}

// // // // // // // //       {/* Nút icon Dictionary luôn hiển thị */}
// // // // // // // //       <Button
// // // // // // // //         onClick={() => setShowDictionary(!showDictionary)}
// // // // // // // //         className="fixed bottom-6 right-6 rounded-full shadow-lg"
// // // // // // // //         size="icon"
// // // // // // // //       >
// // // // // // // //         {showDictionary ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
// // // // // // // //       </Button>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // 'use client';

// // // // // // // import { useState, useEffect } from 'react';
// // // // // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // // // import { Input } from '@/components/ui/input';
// // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // import { Loader2, BookOpen, X } from 'lucide-react';

// // // // // // // // --- Props cho component ---
// // // // // // // interface DictionarySidebarProps {
// // // // // // //   onClose: () => void;
// // // // // // // }

// // // // // // // // --- API Lingva Translate ---
// // // // // // // async function translateText(text: string): Promise<string> {
// // // // // // //   try {
// // // // // // //     const res = await fetch(
// // // // // // //       `https://lingva.ml/api/v1/en/vi/${encodeURIComponent(text)}`
// // // // // // //     );
// // // // // // //     const data = await res.json();
// // // // // // //     return data.translation || 'Không thể dịch';
// // // // // // //   } catch {
// // // // // // //     return 'Không thể dịch';
// // // // // // //   }
// // // // // // // }

// // // // // // // export default function DictionarySidebar({ onClose }: DictionarySidebarProps) {
// // // // // // //   const [word, setWord] = useState('');
// // // // // // //   const [result, setResult] = useState<any[]>([]);
// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
// // // // // // //   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

// // // // // // //   // --- API nghĩa ---
// // // // // // //   const fetchMeaning = async (searchWord: string) => {
// // // // // // //     if (!searchWord) return null;
// // // // // // //     try {
// // // // // // //       const res = await fetch(
// // // // // // //         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
// // // // // // //       );
// // // // // // //       const data = await res.json();
// // // // // // //       if (Array.isArray(data)) return data[0];
// // // // // // //       return null;
// // // // // // //     } catch {
// // // // // // //       return null;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // --- Lấy kết quả gợi ý ---
// // // // // // //   const fetchResults = async (w: string) => {
// // // // // // //     if (w.length < 2) {
// // // // // // //       setResult([]);
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
// // // // // // //       const data = await res.json();
// // // // // // //       const words = data.map((item: any) => item.word);

// // // // // // //       const results: any[] = [];
// // // // // // //       for (const w of words) {
// // // // // // //         const meaning = await fetchMeaning(w);
// // // // // // //         if (meaning) results.push({ word: w, meaning });
// // // // // // //       }

// // // // // // //       setResult(results.slice(0, 6));
// // // // // // //       setLoading(false);
// // // // // // //     } catch {
// // // // // // //       setResult([]);
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // --- Khi gõ input ---
// // // // // // //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // // // //     const val = e.target.value;
// // // // // // //     setWord(val);

// // // // // // //     if (typingTimeout) clearTimeout(typingTimeout);
// // // // // // //     const timeout = setTimeout(() => fetchResults(val), 1000);
// // // // // // //     setTypingTimeout(timeout);
// // // // // // //   };

// // // // // // //   // --- Dịch từng definition riêng ---
// // // // // // //   useEffect(() => {
// // // // // // //     const fetchAllTranslations = async () => {
// // // // // // //       const newTranslations = new Map<string, string>();
// // // // // // //       if (result.length === 0) {
// // // // // // //         setTranslations(newTranslations);
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       for (const item of result) {
// // // // // // //         const definitions = item.meaning.meanings?.flatMap((m: any) =>
// // // // // // //           m.definitions.slice(0, 2).map((d: any) => d.definition)
// // // // // // //         ) || [];

// // // // // // //         for (const def of definitions) {
// // // // // // //           newTranslations.set(def, 'Đang dịch...');
// // // // // // //           setTranslations(new Map(newTranslations)); // update state
// // // // // // //           const translation = await translateText(def);
// // // // // // //           newTranslations.set(def, translation);
// // // // // // //           setTranslations(new Map(newTranslations));
// // // // // // //         }
// // // // // // //       }
// // // // // // //     };

// // // // // // //     fetchAllTranslations();
// // // // // // //   }, [result]);

// // // // // // //   return (
// // // // // // //     <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l shadow-lg flex flex-col z-40">
// // // // // // //       <Card className="h-full flex flex-col">
// // // // // // //         <CardHeader className="flex justify-between items-center">
// // // // // // //           <CardTitle className="flex items-center gap-2">
// // // // // // //             <BookOpen className="h-5 w-5 text-blue-600" />
// // // // // // //             Từ điển
// // // // // // //           </CardTitle>
// // // // // // //           <Button variant="outline" size="sm" onClick={onClose}>
// // // // // // //             <X className="h-4 w-4 mr-1" /> Ẩn
// // // // // // //           </Button>
// // // // // // //         </CardHeader>

// // // // // // //         <CardContent className="flex flex-col gap-3 flex-1 overflow-hidden">
// // // // // // //           <Input
// // // // // // //             placeholder="Nhập từ tiếng Anh..."
// // // // // // //             value={word}
// // // // // // //             onChange={handleInputChange}
// // // // // // //           />

// // // // // // //           <div className="mt-2 flex-1 overflow-y-auto text-sm">
// // // // // // //             {loading ? (
// // // // // // //               <div className="flex justify-center items-center h-full">
// // // // // // //                 <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
// // // // // // //               </div>
// // // // // // //             ) : result.length > 0 ? (
// // // // // // //               <div>
// // // // // // //                 {result.map((item, idx) => (
// // // // // // //                   <div key={idx} className="mt-4 p-3 border rounded bg-gray-50 shadow-sm">
// // // // // // //                     <h2 className="text-lg font-bold text-blue-600">{item.word}</h2>
// // // // // // //                     {item.meaning.meanings?.map((m: any, idx: number) => (
// // // // // // //                       <div key={idx} className="mt-2">
// // // // // // //                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
// // // // // // //                         <ul className="list-disc list-inside space-y-1">
// // // // // // //                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
// // // // // // //                             const translation = translations.get(d.definition);
// // // // // // //                             return (
// // // // // // //                               <li key={i}>
// // // // // // //                                 <span className="text-gray-800">{d.definition}</span>
// // // // // // //                                 {translation ? (
// // // // // // //                                   <p className="text-gray-700 text-sm mt-1 italic">
// // // // // // //                                     <strong>Dịch:</strong> {translation}
// // // // // // //                                   </p>
// // // // // // //                                 ) : (
// // // // // // //                                   <p className="text-gray-500 text-sm italic">Đang dịch...</p>
// // // // // // //                                 )}
// // // // // // //                               </li>
// // // // // // //                             );
// // // // // // //                           })}
// // // // // // //                         </ul>
// // // // // // //                       </div>
// // // // // // //                     ))}
// // // // // // //                   </div>
// // // // // // //                 ))}
// // // // // // //               </div>
// // // // // // //             ) : (
// // // // // // //               <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
// // // // // // //             )}
// // // // // // //           </div>
// // // // // // //         </CardContent>
// // // // // // //       </Card>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // 'use client';

// // // // // // import { useState, useEffect } from 'react';
// // // // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // // import { Input } from '@/components/ui/input';
// // // // // // import { Button } from '@/components/ui/button';
// // // // // // import { Loader2, BookOpen, X } from 'lucide-react';

// // // // // // // Props for the component
// // // // // // interface DictionarySidebarProps {
// // // // // //   onClose: () => void;
// // // // // // }

// // // // // // // API for Lingva Translate
// // // // // // async function translateText(text: string): Promise<string> {
// // // // // //   if (!text) return '';
// // // // // //   try {
// // // // // //     const res = await fetch(
// // // // // //       `https://lingva.ml/api/v1/en/vi/${encodeURIComponent(text)}`
// // // // // //     );
// // // // // //     if (!res.ok) throw new Error('Translation failed');
// // // // // //     const data = await res.json();
// // // // // //     return data.translation || 'Không thể dịch';
// // // // // //   } catch (error) {
// // // // // //     console.error('Error calling Lingva Translate:', error);
// // // // // //     return 'Không thể dịch';
// // // // // //   }
// // // // // // }

// // // // // // export default function DictionarySidebar({ onClose }: DictionarySidebarProps) {
// // // // // //   const [word, setWord] = useState('');
// // // // // //   const [result, setResult] = useState<any[]>([]);
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
// // // // // //   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

// // // // // //   // Fetch word meaning from Dictionary API
// // // // // //   const fetchMeaning = async (searchWord: string) => {
// // // // // //     if (!searchWord) return null;
// // // // // //     try {
// // // // // //       const res = await fetch(
// // // // // //         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
// // // // // //       );
// // // // // //       const data = await res.json();
// // // // // //       if (Array.isArray(data)) return data[0];
// // // // // //       return null;
// // // // // //     } catch {
// // // // // //       return null;
// // // // // //     }
// // // // // //   };

// // // // // //   // Fetch word suggestions from Datamuse API
// // // // // //   const fetchResults = async (w: string) => {
// // // // // //     if (w.length < 2) {
// // // // // //       setResult([]);
// // // // // //       return;
// // // // // //     }
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
// // // // // //       const data = await res.json();
// // // // // //       const words = data.map((item: any) => item.word);

// // // // // //       const results: any[] = [];
// // // // // //       for (const w of words) {
// // // // // //         const meaning = await fetchMeaning(w);
// // // // // //         if (meaning) results.push({ word: w, meaning });
// // // // // //       }

// // // // // //       setResult(results.slice(0, 6));
// // // // // //       setLoading(false);
// // // // // //     } catch {
// // // // // //       setResult([]);
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   // Handle input change with debouncing
// // // // // //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // // //     const val = e.target.value;
// // // // // //     setWord(val);

// // // // // //     if (typingTimeout) clearTimeout(typingTimeout);
// // // // // //     const timeout = setTimeout(() => fetchResults(val), 1000);
// // // // // //     setTypingTimeout(timeout);
// // // // // //   };

// // // // // //   // Fetch translations for definitions
// // // // // //   useEffect(() => {
// // // // // //     const fetchAllTranslations = async () => {
// // // // // //       const newTranslations = new Map<string, string>();
// // // // // //       if (result.length === 0) {
// // // // // //         setTranslations(newTranslations);
// // // // // //         return;
// // // // // //       }

// // // // // //       for (const item of result) {
// // // // // //         const definitions = item.meaning.meanings?.flatMap((m: any) =>
// // // // // //           m.definitions.slice(0, 2).map((d: any) => d.definition)
// // // // // //         ) || [];

// // // // // //         for (const def of definitions) {
// // // // // //           newTranslations.set(def, 'Đang dịch...');
// // // // // //           setTranslations(new Map(newTranslations));
// // // // // //           const translation = await translateText(def);
// // // // // //           newTranslations.set(def, translation);
// // // // // //           setTranslations(new Map(newTranslations));
// // // // // //         }
// // // // // //       }
// // // // // //     };

// // // // // //     fetchAllTranslations();
// // // // // //   }, [result]);

// // // // // //   return (
// // // // // //     <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l shadow-lg flex flex-col z-40">
// // // // // //       <Card className="h-full flex flex-col">
// // // // // //         <CardHeader className="flex justify-between items-center">
// // // // // //           <CardTitle className="flex items-center gap-2">
// // // // // //             <BookOpen className="h-5 w-5 text-blue-600" />
// // // // // //             Từ điển
// // // // // //           </CardTitle>
// // // // // //           <Button variant="outline" size="sm" onClick={onClose}>
// // // // // //             <X className="h-4 w-4 mr-1" /> Ẩn
// // // // // //           </Button>
// // // // // //         </CardHeader>

// // // // // //         <CardContent className="flex flex-col gap-3 flex-1 overflow-hidden">
// // // // // //           <Input
// // // // // //             placeholder="Nhập từ tiếng Anh..."
// // // // // //             value={word}
// // // // // //             onChange={handleInputChange}
// // // // // //           />

// // // // // //           <div className="mt-2 flex-1 overflow-y-auto text-sm">
// // // // // //             {loading ? (
// // // // // //               <div className="flex justify-center items-center h-full">
// // // // // //                 <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
// // // // // //               </div>
// // // // // //             ) : result.length > 0 ? (
// // // // // //               <div>
// // // // // //                 {result.map((item, idx) => (
// // // // // //                   <div key={idx} className="mt-4 p-3 border rounded bg-gray-50 shadow-sm">
// // // // // //                     <h2 className="text-lg font-bold text-blue-600">{item.word}</h2>
// // // // // //                     {item.meaning.meanings?.map((m: any, idx: number) => (
// // // // // //                       <div key={idx} className="mt-2">
// // // // // //                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
// // // // // //                         <ul className="list-disc list-inside space-y-1">
// // // // // //                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
// // // // // //                             const translation = translations.get(d.definition);
// // // // // //                             return (
// // // // // //                               <li key={i}>
// // // // // //                                 <span className="text-gray-800">{d.definition}</span>
// // // // // //                                 {translation ? (
// // // // // //                                   <p className="text-gray-700 text-sm mt-1 italic">
// // // // // //                                     <strong>Dịch:</strong> {translation}
// // // // // //                                   </p>
// // // // // //                                 ) : (
// // // // // //                                   <p className="text-gray-500 text-sm italic">Đang dịch...</p>
// // // // // //                                 )}
// // // // // //                               </li>
// // // // // //                             );
// // // // // //                           })}
// // // // // //                         </ul>
// // // // // //                       </div>
// // // // // //                     ))}
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             ) : (
// // // // // //               <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         </CardContent>
// // // // // //       </Card>
// // // // // //     </div>
// // // // // //   );
// // // // // // }



// // // // // 'use client';

// // // // // import { useState, useEffect } from 'react';
// // // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // import { Input } from '@/components/ui/input';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { Loader2, BookOpen, X } from 'lucide-react';

// // // // // // --- API dịch trực tiếp Lingva Translate ---
// // // // // export const translateText = async (text: string): Promise<string> => {
// // // // //   if (!text) return '';

// // // // //   try {
// // // // //     const source = 'en'; // ngôn ngữ nguồn
// // // // //     const target = 'vi'; // ngôn ngữ đích
// // // // //     const res = await fetch(
// // // // //       `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`,
// // // // //       { method: 'GET' }
// // // // //     );

// // // // //     if (!res.ok) throw new Error('Dịch thất bại');
// // // // //     const data = await res.json();

// // // // //     return data.translation || 'Không thể dịch';
// // // // //   } catch (error) {
// // // // //     console.error('Lỗi khi gọi Lingva Translate:', error);
// // // // //     return 'Không thể dịch';
// // // // //   }
// // // // // };

// // // // // // --- Component DictionarySidebar ---
// // // // // export default function DictionarySidebar({ onClose }: { onClose: () => void }) {
// // // // //   const [word, setWord] = useState('');
// // // // //   const [result, setResult] = useState<any[]>([]);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
// // // // //   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

// // // // //   // --- API nghĩa từ dictionaryapi.dev ---
// // // // //   const fetchMeaning = async (searchWord: string) => {
// // // // //     if (!searchWord) return null;
// // // // //     try {
// // // // //       const res = await fetch(
// // // // //         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
// // // // //       );
// // // // //       const data = await res.json();
// // // // //       if (Array.isArray(data)) return data[0];
// // // // //       return null;
// // // // //     } catch {
// // // // //       return null;
// // // // //     }
// // // // //   };

// // // // //   // --- Lấy kết quả gợi ý từ datamuse ---
// // // // //   const fetchResults = async (w: string) => {
// // // // //     if (w.length < 2) {
// // // // //       setResult([]);
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
// // // // //       const data = await res.json();
// // // // //       const words = data.map((item: any) => item.word);

// // // // //       const results: any[] = [];
// // // // //       for (const w of words) {
// // // // //         const meaning = await fetchMeaning(w);
// // // // //         if (meaning) results.push({ word: w, meaning });
// // // // //       }

// // // // //       setResult(results.slice(0, 6));
// // // // //       setLoading(false);
// // // // //     } catch {
// // // // //       setResult([]);
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // --- Khi gõ input ---
// // // // //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // //     const val = e.target.value;
// // // // //     setWord(val);

// // // // //     if (typingTimeout) clearTimeout(typingTimeout);
// // // // //     const timeout = setTimeout(() => fetchResults(val), 1000);
// // // // //     setTypingTimeout(timeout);
// // // // //   };

// // // // //   // --- Dịch từng definition riêng bằng Lingva Translate ---
// // // // //   useEffect(() => {
// // // // //     const fetchAllTranslations = async () => {
// // // // //       const newTranslations = new Map<string, string>();
// // // // //       if (result.length === 0) {
// // // // //         setTranslations(newTranslations);
// // // // //         return;
// // // // //       }

// // // // //       for (const item of result) {
// // // // //         const definitions = item.meaning.meanings?.flatMap((m: any) =>
// // // // //           m.definitions.slice(0, 2).map((d: any) => d.definition)
// // // // //         ) || [];

// // // // //         for (const def of definitions) {
// // // // //           newTranslations.set(def, 'Đang dịch...');
// // // // //           setTranslations(new Map(newTranslations)); // Cập nhật state hiển thị
// // // // //           const translation = await translateText(def);
// // // // //           newTranslations.set(def, translation);
// // // // //           setTranslations(new Map(newTranslations)); // Update từng câu
// // // // //         }
// // // // //       }
// // // // //     };

// // // // //     fetchAllTranslations();
// // // // //   }, [result]);

// // // // //   return (
// // // // //     <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l shadow-lg flex flex-col z-40">
// // // // //       <Card className="h-full flex flex-col">
// // // // //         <CardHeader className="flex justify-between items-center">
// // // // //           <CardTitle className="flex items-center gap-2">
// // // // //             <BookOpen className="h-5 w-5 text-blue-600" />
// // // // //             Từ điển
// // // // //           </CardTitle>
// // // // //           <Button variant="outline" size="sm" onClick={onClose}>
// // // // //             <X className="h-4 w-4 mr-1" /> Ẩn
// // // // //           </Button>
// // // // //         </CardHeader>

// // // // //         <CardContent className="flex flex-col gap-3 flex-1 overflow-hidden">
// // // // //           <Input
// // // // //             placeholder="Nhập từ tiếng Anh..."
// // // // //             value={word}
// // // // //             onChange={handleInputChange}
// // // // //           />

// // // // //           <div className="mt-2 flex-1 overflow-y-auto text-sm">
// // // // //             {loading ? (
// // // // //               <div className="flex justify-center items-center h-full">
// // // // //                 <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
// // // // //               </div>
// // // // //             ) : result.length > 0 ? (
// // // // //               <div>
// // // // //                 {result.map((item, idx) => (
// // // // //                   <div key={idx} className="mt-4 p-3 border rounded bg-gray-50 shadow-sm">
// // // // //                     <h2 className="text-lg font-bold text-blue-600">{item.word}</h2>
// // // // //                     {item.meaning.meanings?.map((m: any, idx: number) => (
// // // // //                       <div key={idx} className="mt-2">
// // // // //                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
// // // // //                         <ul className="list-disc list-inside space-y-1">
// // // // //                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
// // // // //                             const translation = translations.get(d.definition);
// // // // //                             return (
// // // // //                               <li key={i}>
// // // // //                                 <span className="text-gray-800">{d.definition}</span>
// // // // //                                 {translation ? (
// // // // //                                   <p className="text-gray-700 text-sm mt-1 italic">
// // // // //                                     <strong>Dịch:</strong> {translation}
// // // // //                                   </p>
// // // // //                                 ) : (
// // // // //                                   <p className="text-gray-500 text-sm italic">Đang dịch...</p>
// // // // //                                 )}
// // // // //                               </li>
// // // // //                             );
// // // // //                           })}
// // // // //                         </ul>
// // // // //                       </div>
// // // // //                     ))}
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //             ) : (
// // // // //               <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
// // // // //             )}
// // // // //           </div>
// // // // //         </CardContent>
// // // // //       </Card>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // 'use client';

// // // // import { useState, useEffect } from 'react';
// // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // import { Input } from '@/components/ui/input';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Loader2, BookOpen, X } from 'lucide-react';

// // // // // --- API dịch trực tiếp Lingva Translate ---
// // // // export const translateText = async (text: string): Promise<string> => {
// // // //   if (!text) return '';

// // // //   try {
// // // //     const source = 'en'; // ngôn ngữ nguồn
// // // //     const target = 'vi'; // ngôn ngữ đích
// // // //     const res = await fetch(
// // // //       `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`,
// // // //       { method: 'GET' }
// // // //     );

// // // //     if (!res.ok) throw new Error('Dịch thất bại');
// // // //     const data = await res.json();

// // // //     return data.translation || 'Không thể dịch';
// // // //   } catch (error) {
// // // //     console.error('Lỗi khi gọi Lingva Translate:', error);
// // // //     return 'Không thể dịch';
// // // //   }
// // // // };

// // // // // --- Component DictionarySidebar ---
// // // // export default function DictionarySidebar({ onClose }: { onClose: () => void }) {
// // // //   const [word, setWord] = useState('');
// // // //   const [result, setResult] = useState<any[]>([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
// // // //   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

// // // //   // --- API nghĩa từ dictionaryapi.dev ---
// // // //   const fetchMeaning = async (searchWord: string) => {
// // // //     if (!searchWord) return null;
// // // //     try {
// // // //       const res = await fetch(
// // // //         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
// // // //       );
// // // //       const data = await res.json();
// // // //       if (Array.isArray(data)) return data[0];
// // // //       return null;
// // // //     } catch {
// // // //       return null;
// // // //     }
// // // //   };

// // // //   // --- Lấy kết quả gợi ý từ datamuse ---
// // // //   const fetchResults = async (w: string) => {
// // // //     if (w.length < 2) {
// // // //       setResult([]);
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setLoading(true);
// // // //       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
// // // //       const data = await res.json();
// // // //       const words = data.map((item: any) => item.word);

// // // //       const results: any[] = [];
// // // //       for (const w of words) {
// // // //         const meaning = await fetchMeaning(w);
// // // //         if (meaning) results.push({ word: w, meaning });
// // // //       }

// // // //       setResult(results.slice(0, 6));
// // // //       setLoading(false);
// // // //     } catch {
// // // //       setResult([]);
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // --- Khi gõ input ---
// // // //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // //     const val = e.target.value;
// // // //     setWord(val);

// // // //     if (typingTimeout) clearTimeout(typingTimeout);
// // // //     const timeout = setTimeout(() => fetchResults(val), 1000);
// // // //     setTypingTimeout(timeout);
// // // //   };

// // // //   // --- Dịch từng definition riêng bằng Lingva Translate ---
// // // //   useEffect(() => {
// // // //     const fetchAllTranslations = async () => {
// // // //       const newTranslations = new Map<string, string>();
// // // //       if (result.length === 0) {
// // // //         setTranslations(newTranslations);
// // // //         return;
// // // //       }

// // // //       for (const item of result) {
// // // //         const definitions = item.meaning.meanings?.flatMap((m: any) =>
// // // //           m.definitions.slice(0, 2).map((d: any) => d.definition)
// // // //         ) || [];

// // // //         for (const def of definitions) {
// // // //           newTranslations.set(def, 'Đang dịch...');
// // // //           setTranslations(new Map(newTranslations)); // Cập nhật state hiển thị
// // // //           const translation = await translateText(def);
// // // //           newTranslations.set(def, translation);
// // // //           setTranslations(new Map(newTranslations)); // Update từng câu
// // // //         }
// // // //       }
// // // //     };

// // // //     fetchAllTranslations();
// // // //   }, [result]);

// // // //   return (
// // // //     <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l shadow-lg flex flex-col z-40">
// // // //       <Card className="h-full flex flex-col">
// // // //         <CardHeader className="flex justify-between items-center p-4 border-b">
// // // //           <CardTitle className="flex items-center gap-2">
// // // //             <BookOpen className="h-5 w-5 text-blue-600" />
// // // //             Từ điển
// // // //           </CardTitle>
// // // //           <Button variant="outline" size="sm" onClick={onClose} className="shrink-0">
// // // //             <X className="h-4 w-4 mr-1" /> Ẩn
// // // //           </Button>
// // // //         </CardHeader>

// // // //         <CardContent className="flex flex-col gap-3 p-4 flex-1 overflow-y-auto">
// // // //           <Input
// // // //             placeholder="Nhập từ tiếng Anh..."
// // // //             value={word}
// // // //             onChange={handleInputChange}
// // // //             className="w-full"
// // // //           />

// // // //           <div className="mt-2 flex-1 overflow-y-auto text-sm">
// // // //             {loading ? (
// // // //               <div className="flex justify-center items-center h-full">
// // // //                 <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
// // // //               </div>
// // // //             ) : result.length > 0 ? (
// // // //               <div>
// // // //                 {result.map((item, idx) => (
// // // //                   <div key={idx} className="mt-4 p-3 border rounded bg-gray-50 shadow-sm">
// // // //                     <h2 className="text-lg font-bold text-blue-600">{item.word}</h2>
// // // //                     {item.meaning.meanings?.map((m: any, idx: number) => (
// // // //                       <div key={idx} className="mt-2">
// // // //                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
// // // //                         <ul className="list-disc list-inside space-y-1">
// // // //                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
// // // //                             const translation = translations.get(d.definition);
// // // //                             return (
// // // //                               <li key={i} className="break-words">
// // // //                                 <span className="text-gray-800">{d.definition}</span>
// // // //                                 {translation ? (
// // // //                                   <p className="text-gray-700 text-sm mt-1 italic">
// // // //                                     <strong>Dịch:</strong> {translation}
// // // //                                   </p>
// // // //                                 ) : (
// // // //                                   <p className="text-gray-500 text-sm italic">Đang dịch...</p>
// // // //                                 )}
// // // //                               </li>
// // // //                             );
// // // //                           })}
// // // //                         </ul>
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             ) : (
// // // //               <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
// // // //             )}
// // // //           </div>
// // // //         </CardContent>
// // // //       </Card>
// // // //     </div>
// // // //   );
// // // // }

// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // import { Input } from '@/components/ui/input';
// // // import { Button } from '@/components/ui/button';
// // // import { Loader2, BookOpen, X } from 'lucide-react';

// // // // --- API dịch trực tiếp Lingva Translate ---
// // // export const translateText = async (text: string): Promise<string> => {
// // //   if (!text) return '';

// // //   try {
// // //     const source = 'en'; // ngôn ngữ nguồn
// // //     const target = 'vi'; // ngôn ngữ đích
// // //     const res = await fetch(
// // //       `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`,
// // //       { method: 'GET' }
// // //     );

// // //     if (!res.ok) throw new Error('Dịch thất bại');
// // //     const data = await res.json();

// // //     return data.translation || 'Không thể dịch';
// // //   } catch (error) {
// // //     console.error('Lỗi khi gọi Lingva Translate:', error);
// // //     return 'Không thể dịch';
// // //   }
// // // };

// // // // --- Component DictionarySidebar ---
// // // export default function DictionarySidebar({ onClose }: { onClose: () => void }) {
// // //   const [word, setWord] = useState('');
// // //   const [result, setResult] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
// // //   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

// // //   // --- API nghĩa từ dictionaryapi.dev ---
// // //   const fetchMeaning = async (searchWord: string) => {
// // //     if (!searchWord) return null;
// // //     try {
// // //       const res = await fetch(
// // //         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
// // //       );
// // //       const data = await res.json();
// // //       if (Array.isArray(data)) return data[0];
// // //       return null;
// // //     } catch {
// // //       return null;
// // //     }
// // //   };

// // //   // --- Lấy kết quả gợi ý từ datamuse ---
// // //   const fetchResults = async (w: string) => {
// // //     if (w.length < 2) {
// // //       setResult([]);
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);
// // //       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
// // //       const data = await res.json();
// // //       const words = data.map((item: any) => item.word);

// // //       const results: any[] = [];
// // //       for (const w of words) {
// // //         const meaning = await fetchMeaning(w);
// // //         if (meaning) results.push({ word: w, meaning });
// // //       }

// // //       setResult(results.slice(0, 6));
// // //       setLoading(false);
// // //     } catch {
// // //       setResult([]);
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // --- Khi gõ input ---
// // //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const val = e.target.value;
// // //     setWord(val);

// // //     if (typingTimeout) clearTimeout(typingTimeout);
// // //     const timeout = setTimeout(() => fetchResults(val), 1000);
// // //     setTypingTimeout(timeout);
// // //   };

// // //   // --- Dịch từng definition riêng bằng Lingva Translate ---
// // //   useEffect(() => {
// // //     const fetchAllTranslations = async () => {
// // //       const newTranslations = new Map<string, string>();
// // //       if (result.length === 0) {
// // //         setTranslations(newTranslations);
// // //         return;
// // //       }

// // //       for (const item of result) {
// // //         const definitions = item.meaning.meanings?.flatMap((m: any) =>
// // //           m.definitions.slice(0, 2).map((d: any) => d.definition)
// // //         ) || [];

// // //         for (const def of definitions) {
// // //           newTranslations.set(def, 'Đang dịch...');
// // //           setTranslations(new Map(newTranslations)); // Cập nhật state hiển thị
// // //           const translation = await translateText(def);
// // //           newTranslations.set(def, translation);
// // //           setTranslations(new Map(newTranslations)); // Update từng câu
// // //         }
// // //       }
// // //     };

// // //     fetchAllTranslations();
// // //   }, [result]);

// // //   return (
// // //     <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l shadow-lg flex flex-col z-40 dictionary-sidebar">
// // //       <Card className="h-full flex flex-col">
// // //         <CardHeader className="flex justify-between items-center p-6 border-b bg-gray-50">
// // //           <CardTitle className="flex items-center gap-2 text-xl">
// // //             <BookOpen className="h-6 w-6 text-blue-600" />
// // //             Từ điển
// // //           </CardTitle>
// // //           <Button variant="outline" size="sm" onClick={onClose} className="shrink-0">
// // //             <X className="h-5 w-5 mr-1" /> Ẩn
// // //           </Button>
// // //         </CardHeader>

// // //         <CardContent className="flex flex-col gap-4 p-6 flex-1 overflow-y-auto">
// // //           <Input
// // //             placeholder="Nhập từ tiếng Anh..."
// // //             value={word}
// // //             onChange={handleInputChange}
// // //             className="w-full"
// // //           />

// // //           <div className="mt-4 flex-1 overflow-y-auto text-sm">
// // //             {loading ? (
// // //               <div className="flex justify-center items-center h-full">
// // //                 <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
// // //               </div>
// // //             ) : result.length > 0 ? (
// // //               <div>
// // //                 {result.map((item, idx) => (
// // //                   <div key={idx} className="mt-4 p-4 border rounded bg-gray-50 shadow-sm">
// // //                     <h2 className="text-lg font-bold text-blue-600">{item.word}</h2>
// // //                     {item.meaning.meanings?.map((m: any, idx: number) => (
// // //                       <div key={idx} className="mt-2">
// // //                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
// // //                         <ul className="list-disc list-inside space-y-2">
// // //                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
// // //                             const translation = translations.get(d.definition);
// // //                             return (
// // //                               <li key={i} className="break-words">
// // //                                 <span className="text-gray-800">{d.definition}</span>
// // //                                 {translation ? (
// // //                                   <p className="text-gray-700 text-sm mt-1 italic">
// // //                                     <strong>Dịch:</strong> {translation}
// // //                                   </p>
// // //                                 ) : (
// // //                                   <p className="text-gray-500 text-sm italic">Đang dịch...</p>
// // //                                 )}
// // //                               </li>
// // //                             );
// // //                           })}
// // //                         </ul>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             ) : (
// // //               <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
// // //             )}
// // //           </div>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Input } from '@/components/ui/input';
// // import { Button } from '@/components/ui/button';
// // import { Loader2, BookOpen, X } from 'lucide-react';

// // // --- API dịch trực tiếp Lingva Translate ---
// // export const translateText = async (text: string): Promise<string> => {
// //   if (!text) return '';

// //   try {
// //     const source = 'en'; // ngôn ngữ nguồn
// //     const target = 'vi'; // ngôn ngữ đích
// //     const res = await fetch(
// //       `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`,
// //       { method: 'GET' }
// //     );

// //     if (!res.ok) throw new Error('Dịch thất bại');
// //     const data = await res.json();

// //     return data.translation || 'Không thể dịch';
// //   } catch (error) {
// //     console.error('Lỗi khi gọi Lingva Translate:', error);
// //     return 'Không thể dịch';
// //   }
// // };

// // // --- Component DictionarySidebar ---
// // export default function DictionarySidebar({ onClose }: { onClose: () => void }) {
// //   const [word, setWord] = useState('');
// //   const [result, setResult] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
// //   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

// //   // --- API nghĩa từ dictionaryapi.dev ---
// //   const fetchMeaning = async (searchWord: string) => {
// //     if (!searchWord) return null;
// //     try {
// //       const res = await fetch(
// //         `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
// //       );
// //       const data = await res.json();
// //       if (Array.isArray(data)) return data[0];
// //       return null;
// //     } catch {
// //       return null;
// //     }
// //   };

// //   // --- Lấy kết quả gợi ý từ datamuse ---
// //   const fetchResults = async (w: string) => {
// //     if (w.length < 2) {
// //       setResult([]);
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
// //       const data = await res.json();
// //       const words = data.map((item: any) => item.word);

// //       const results: any[] = [];
// //       for (const w of words) {
// //         const meaning = await fetchMeaning(w);
// //         if (meaning) results.push({ word: w, meaning });
// //       }

// //       setResult(results.slice(0, 6));
// //       setLoading(false);
// //     } catch {
// //       setResult([]);
// //       setLoading(false);
// //     }
// //   };

// //   // --- Khi gõ input ---
// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const val = e.target.value;
// //     setWord(val);

// //     if (typingTimeout) clearTimeout(typingTimeout);
// //     const timeout = setTimeout(() => fetchResults(val), 1000);
// //     setTypingTimeout(timeout);
// //   };

// //   // --- Dịch từng definition riêng bằng Lingva Translate ---
// //   useEffect(() => {
// //     const fetchAllTranslations = async () => {
// //       const newTranslations = new Map<string, string>();
// //       if (result.length === 0) {
// //         setTranslations(newTranslations);
// //         return;
// //       }

// //       for (const item of result) {
// //         const definitions = item.meaning.meanings?.flatMap((m: any) =>
// //           m.definitions.slice(0, 2).map((d: any) => d.definition)
// //         ) || [];

// //         for (const def of definitions) {
// //           newTranslations.set(def, 'Đang dịch...');
// //           setTranslations(new Map(newTranslations)); // Cập nhật state hiển thị
// //           const translation = await translateText(def);
// //           newTranslations.set(def, translation);
// //           setTranslations(new Map(newTranslations)); // Update từng câu
// //         }
// //       }
// //     };

// //     fetchAllTranslations();
// //   }, [result]);

// //   return (
// //     <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white border-l shadow-lg flex flex-col z-50 overflow-hidden">
// //       <Card className="h-full flex flex-col overflow-hidden">
// //         <CardHeader className="flex flex-row justify-between items-center p-4 md:p-6 border-b bg-gray-50 shrink-0">
// //           <CardTitle className="flex items-center gap-2 text-lg md:text-xl truncate">
// //             <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
// //             Từ điển
// //           </CardTitle>
// //           <Button variant="outline" size="sm" onClick={onClose} className="shrink-0 ml-auto">
// //             <X className="h-4 w-4 md:h-5 md:w-5 mr-1" /> Ẩn
// //           </Button>
// //         </CardHeader>

// //         <CardContent className="flex flex-col gap-4 p-4 md:p-6 flex-1 overflow-y-auto">
// //           <Input
// //             placeholder="Nhập từ tiếng Anh..."
// //             value={word}
// //             onChange={handleInputChange}
// //             className="w-full"
// //           />

// //           <div className="mt-4 flex-1 overflow-y-auto text-sm">
// //             {loading ? (
// //               <div className="flex justify-center items-center h-full">
// //                 <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-gray-500" />
// //               </div>
// //             ) : result.length > 0 ? (
// //               <div className="space-y-4">
// //                 {result.map((item, idx) => (
// //                   <div key={idx} className="p-3 md:p-4 border rounded bg-gray-50 shadow-sm">
// //                     <h2 className="text-base md:text-lg font-bold text-blue-600 truncate">{item.word}</h2>
// //                     {item.meaning.meanings?.map((m: any, idx: number) => (
// //                       <div key={idx} className="mt-2">
// //                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
// //                         <ul className="list-disc list-inside space-y-2">
// //                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
// //                             const translation = translations.get(d.definition);
// //                             return (
// //                               <li key={i} className="break-words hyphens-auto">
// //                                 <span className="text-gray-800">{d.definition}</span>
// //                                 {translation ? (
// //                                   <p className="text-gray-700 text-sm mt-1 italic">
// //                                     <strong>Dịch:</strong> {translation}
// //                                   </p>
// //                                 ) : (
// //                                   <p className="text-gray-500 text-sm italic">Đang dịch...</p>
// //                                 )}
// //                               </li>
// //                             );
// //                           })}
// //                         </ul>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
// //             )}
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }
// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Loader2, BookOpen, X } from 'lucide-react';

// // --- API dịch trực tiếp Lingva Translate ---
// export const translateText = async (text: string): Promise<string> => {
//   if (!text) return '';

//   try {
//     const source = 'en'; // ngôn ngữ nguồn
//     const target = 'vi'; // ngôn ngữ đích
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

// // --- Component DictionarySidebar ---
// export default function DictionarySidebar({ onClose }: { onClose: () => void }) {
//   const [word, setWord] = useState('');
//   const [result, setResult] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
//   const [translations, setTranslations] = useState<Map<string, string>>(new Map());

//   // --- API nghĩa từ dictionaryapi.dev ---
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

//   // --- Lấy kết quả gợi ý từ datamuse ---
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

//   // --- Khi gõ input ---
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value;
//     setWord(val);

//     if (typingTimeout) clearTimeout(typingTimeout);
//     const timeout = setTimeout(() => fetchResults(val), 1000);
//     setTypingTimeout(timeout);
//   };

//   // --- Dịch từng definition riêng bằng Lingva Translate ---
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
//           setTranslations(new Map(newTranslations)); // Cập nhật state hiển thị
//           const translation = await translateText(def);
//           newTranslations.set(def, translation);
//           setTranslations(new Map(newTranslations)); // Update từng câu
//         }
//       }
//     };

//     fetchAllTranslations();
//   }, [result]);

//   return (
//     <div className="fixed right-0 top-0 h-[75vh] w-full md:w-96 bg-white border-l shadow-lg flex flex-col z-50 overflow-hidden">
//       <Card className="h-full flex flex-col overflow-hidden">
//         <CardHeader className="flex flex-row justify-between items-center p-4 md:p-6 border-b bg-gray-50 shrink-0">
//           <CardTitle className="flex items-center gap-2 text-lg md:text-xl truncate">
//             <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
//             Từ điển
//           </CardTitle>
//           <Button variant="outline" size="sm" onClick={onClose} className="shrink-0 ml-auto">
//             <X className="h-4 w-4 md:h-5 md:w-5 mr-1" /> Ẩn
//           </Button>
//         </CardHeader>

//         <CardContent className="flex flex-col gap-4 p-4 md:p-6 flex-1 overflow-y-auto">
//           <Input
//             placeholder="Nhập từ tiếng Anh..."
//             value={word}
//             onChange={handleInputChange}
//             className="w-full"
//           />

//           <div className="mt-4 flex-1 overflow-y-auto text-sm">
//             {loading ? (
//               <div className="flex justify-center items-center h-full">
//                 <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-gray-500" />
//               </div>
//             ) : result.length > 0 ? (
//               <div className="space-y-4">
//                 {result.map((item, idx) => (
//                   <div key={idx} className="p-3 md:p-4 border rounded bg-gray-50 shadow-sm">
//                     <h2 className="text-base md:text-lg font-bold text-blue-600 truncate">{item.word}</h2>
//                     {item.meaning.meanings?.map((m: any, idx: number) => (
//                       <div key={idx} className="mt-2">
//                         <p className="italic text-gray-600">{m.partOfSpeech}</p>
//                         <ul className="list-disc list-inside space-y-2">
//                           {m.definitions.slice(0, 2).map((d: any, i: number) => {
//                             const translation = translations.get(d.definition);
//                             return (
//                               <li key={i} className="break-words hyphens-auto">
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

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, X } from 'lucide-react';

// --- API dịch trực tiếp Lingva Translate ---
export const translateText = async (text: string): Promise<string> => {
  if (!text) return '';

  try {
    const source = 'en'; // ngôn ngữ nguồn
    const target = 'vi'; // ngôn ngữ đích
    const res = await fetch(
      `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`,
      { method: 'GET' }
    );

    if (!res.ok) throw new Error('Dịch thất bại');
    const data = await res.json();

    return data.translation || 'Không thể dịch';
  } catch (error) {
    console.error('Lỗi khi gọi Lingva Translate:', error);
    return 'Không thể dịch';
  }
};

// --- Component DictionarySidebar ---
export default function DictionarySidebar({ onClose }: { onClose: () => void }) {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [translations, setTranslations] = useState<Map<string, string>>(new Map());

  // --- API nghĩa từ dictionaryapi.dev ---
  const fetchMeaning = async (searchWord: string) => {
    if (!searchWord) return null;
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
      );
      const data = await res.json();
      if (Array.isArray(data)) return data[0];
      return null;
    } catch {
      return null;
    }
  };

  // --- Lấy kết quả gợi ý từ datamuse ---
  const fetchResults = async (w: string) => {
    if (w.length < 2) {
      setResult([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(w)}&max=10`);
      const data = await res.json();
      const words = data.map((item: any) => item.word);

      const results: any[] = [];
      for (const w of words) {
        const meaning = await fetchMeaning(w);
        if (meaning) results.push({ word: w, meaning });
      }

      setResult(results.slice(0, 6));
      setLoading(false);
    } catch {
      setResult([]);
      setLoading(false);
    }
  };

  // --- Khi gõ input ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWord(val);

    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => fetchResults(val), 1000);
    setTypingTimeout(timeout);
  };

  // --- Dịch từng definition riêng bằng Lingva Translate ---
  useEffect(() => {
    const fetchAllTranslations = async () => {
      const newTranslations = new Map<string, string>();
      if (result.length === 0) {
        setTranslations(newTranslations);
        return;
      }

      for (const item of result) {
        const definitions = item.meaning.meanings?.flatMap((m: any) =>
          m.definitions.slice(0, 2).map((d: any) => d.definition)
        ) || [];

        for (const def of definitions) {
          newTranslations.set(def, 'Đang dịch...');
          setTranslations(new Map(newTranslations)); // Cập nhật state hiển thị
          const translation = await translateText(def);
          newTranslations.set(def, translation);
          setTranslations(new Map(newTranslations)); // Update từng câu
        }
      }
    };

    fetchAllTranslations();
  }, [result]);

  return (
    <div className="fixed right-0 bottom-0 h-[75vh] w-full md:w-96 bg-white border-l shadow-lg flex flex-col z-50 overflow-hidden">
      <Card className="h-full flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row justify-between items-center p-4 md:p-6 border-b bg-gray-50 shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl truncate">
            <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
            Từ điển
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose} className="shrink-0 ml-auto">
            <X className="h-4 w-4 md:h-5 md:w-5 mr-1" /> Ẩn
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-4 md:p-6 flex-1 overflow-y-auto">
          <Input
            placeholder="Nhập từ tiếng Anh..."
            value={word}
            onChange={handleInputChange}
            className="w-full"
          />

          <div className="mt-4 flex-1 overflow-y-auto text-sm">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-gray-500" />
              </div>
            ) : result.length > 0 ? (
              <div className="space-y-4">
                {result.map((item, idx) => (
                  <div key={idx} className="p-3 md:p-4 border rounded bg-gray-50 shadow-sm">
                    <h2 className="text-base md:text-lg font-bold text-blue-600 truncate">{item.word}</h2>
                    {item.meaning.meanings?.map((m: any, idx: number) => (
                      <div key={idx} className="mt-2">
                        <p className="italic text-gray-600">{m.partOfSpeech}</p>
                        <ul className="list-disc list-inside space-y-2">
                          {m.definitions.slice(0, 2).map((d: any, i: number) => {
                            const translation = translations.get(d.definition);
                            return (
                              <li key={i} className="break-words hyphens-auto">
                                <span className="text-gray-800">{d.definition}</span>
                                {translation ? (
                                  <p className="text-gray-700 text-sm mt-1 italic">
                                    <strong>Dịch:</strong> {translation}
                                  </p>
                                ) : (
                                  <p className="text-gray-500 text-sm italic">Đang dịch...</p>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Nhập từ để xem nghĩa gợi ý</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}