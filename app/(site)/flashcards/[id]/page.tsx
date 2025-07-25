'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, BookPlus, FlipHorizontal, X } from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  createdAt: string;
}

interface BulkCard {
  front: string;
  back: string;
}

const FlashcardSetPage = ({ params }: { params: { setId: string } }) => {
  const { setId } = params;
  const router = useRouter();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: 1,
      front: 'Budget',
      back: 'A plan for spending money over a specific period',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      front: 'Revenue',
      back: 'The total amount of income generated by a business',
      createdAt: '2024-01-15'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkAddDialogOpen, setIsBulkAddDialogOpen] = useState(false);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  
  // Bulk cards state với 3 dòng mặc định
  const [bulkCards, setBulkCards] = useState<BulkCard[]>([
    { front: '', back: '' },
    { front: '', back: '' },
    { front: '', back: '' }
  ]);

  const handleAddSingleCard = () => {
    if (newCardFront.trim() && newCardBack.trim()) {
      const newCard: Flashcard = {
        id: Date.now(),
        front: newCardFront.trim(),
        back: newCardBack.trim(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setFlashcards([...flashcards, newCard]);
      setNewCardFront('');
      setNewCardBack('');
      setIsAddDialogOpen(false);
    }
  };

  const handleBulkCardChange = (index: number, field: 'front' | 'back', value: string) => {
    const newBulkCards = [...bulkCards];
    newBulkCards[index][field] = value;
    setBulkCards(newBulkCards);

    // Tự động thêm dòng mới khi người dùng nhập vào dòng cuối và chưa đạt giới hạn
    if (index === bulkCards.length - 1 && value.trim() && bulkCards.length < 10) {
      setBulkCards([...newBulkCards, { front: '', back: '' }]);
    }
  };

  const handleRemoveBulkCard = (index: number) => {
    if (bulkCards.length > 1) {
      const newBulkCards = bulkCards.filter((_, i) => i !== index);
      setBulkCards(newBulkCards);
    }
  };

  const handleBulkAdd = () => {
    const validCards = bulkCards.filter(card => card.front.trim() && card.back.trim());
    
    if (validCards.length > 0) {
      const newCards: Flashcard[] = validCards.map((card, index) => ({
        id: Date.now() + index,
        front: card.front.trim(),
        back: card.back.trim(),
        createdAt: new Date().toISOString().split('T')[0]
      }));

      setFlashcards([...flashcards, ...newCards]);
      
      // Reset về 3 dòng mặc định
      setBulkCards([
        { front: '', back: '' },
        { front: '', back: '' },
        { front: '', back: '' }
      ]);
      setIsBulkAddDialogOpen(false);
    }
  };

  const handleDeleteCard = (id: number) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  const validBulkCards = bulkCards.filter(card => card.front.trim() && card.back.trim()).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/flashcards')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý bộ Flashcard
            </h1>
            <p className="text-gray-600">{flashcards.length} thẻ trong bộ</p>
          </div>

          <div className="flex space-x-2">
            {/* Dialog thêm thẻ đơn */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BookPlus className="h-4 w-4 mr-2" />
                  Thêm thẻ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm thẻ mới</DialogTitle>
                  <DialogDescription>
                    Nhập mặt trước và mặt sau của thẻ.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="front" className='mb-4'>Mặt trước</Label>
                    <Input
                      id="front"
                      placeholder="Ví dụ: Budget"
                      value={newCardFront}
                      onChange={(e) => setNewCardFront(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="back" className='mb-4'>Mặt sau</Label>
                    <Textarea
                      id="back"
                      placeholder="Định nghĩa hoặc giải nghĩa"
                      value={newCardBack}
                      onChange={(e) => setNewCardBack(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Huỷ</Button>
                    <Button onClick={handleAddSingleCard} disabled={!newCardFront || !newCardBack}>Thêm</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Dialog thêm nhiều thẻ */}
            <Dialog open={isBulkAddDialogOpen} onOpenChange={setIsBulkAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BookPlus className="h-4 w-4 mr-2" />
                  Thêm nhiều
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm nhiều thẻ</DialogTitle>
                  <DialogDescription>
                    Nhập mặt trước và mặt sau cho mỗi thẻ. Tối đa 10 thẻ một lần.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Label className="font-medium">Mặt trước</Label>
                    <Label className="font-medium">Mặt sau</Label>
                  </div>
                  
                  <div className="space-y-3 max-h-96">
                    {bulkCards.map((card, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 items-center group">
                        <div className="relative">
                          <Input
                            placeholder={`Thẻ ${index + 1} - Mặt trước`}
                            value={card.front}
                            onChange={(e) => handleBulkCardChange(index, 'front', e.target.value)}
                            className="pr-8"
                          />
                          {bulkCards.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveBulkCard(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <Input
                          placeholder={`Thẻ ${index + 1} - Mặt sau`}
                          value={card.back}
                          onChange={(e) => handleBulkCardChange(index, 'back', e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      {validBulkCards > 0 && (
                        <span>
                          {validBulkCards} thẻ hợp lệ • {bulkCards.length}/10 dòng
                        </span>
                      )}
                      {validBulkCards === 0 && (
                        <span className="text-gray-400">
                          Chưa có thẻ nào hợp lệ • {bulkCards.length}/10 dòng
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsBulkAddDialogOpen(false)}>
                        Huỷ
                      </Button>
                      <Button 
                        onClick={handleBulkAdd} 
                        disabled={validBulkCards === 0}
                      >
                        Thêm {validBulkCards} thẻ
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={() => router.push(`/flashcards/${setId}/study`)}>
              <FlipHorizontal className="h-4 w-4 mr-2" />
              Ôn tập
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcards.map((card) => (
            <Card key={card.id} className="hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{card.front}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{card.back}</CardDescription>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCard(card.id)}>Xoá</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {flashcards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Chưa có thẻ nào trong bộ này.</p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <BookPlus className="h-4 w-4 mr-2" />
                  Thêm thẻ đầu tiên
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlashcardSetPage;