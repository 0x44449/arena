'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Folder, Hash, Volume2 } from "lucide-react";
import { useState } from "react";

interface WorkspaceAddModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface Category {
  id: string;
  name: string;
}

export default function WorkspaceAddModal(props: WorkspaceAddModalProps) {
  const { isOpen, onClose } = props;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [workspaceType, setWorkspaceType] = useState<'text' | 'voice'>('text');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories: Category[] = [
    { id: 'general', name: '일반' },
    { id: 'development', name: '개발' },
    { id: 'community', name: '커뮤니티' },
  ];
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border border-[#E5E7EB] shadow-xl">
        <DialogHeader className="text-center pb-2">
          {/* <div className="mx-auto w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-full flex items-center justify-center mb-3">
            {workspaceType === 'text' ? (
              <Hash className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </div> */}
          <DialogTitle className="text-xl text-gray-800">새 워크스페이스 만들기</DialogTitle>
          <DialogDescription className="sr-only">새로운 채널을 만들어 팀원들과 소통해보세요.</DialogDescription>
          {/* <p className="text-[#6B7280] text-sm mt-1">
            새로운 채널을 만들어 팀원들과 소통해보세요.
          </p> */}
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Channel Type Selection */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">워크스페이스 유형</Label>
            <RadioGroup
              value={workspaceType}
              onValueChange={(value: 'text' | 'voice') => setWorkspaceType(value)}
              className="space-y-2"
            >
              <div
                className="flex items-center space-x-3 p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors duration-150 cursor-pointer"
                onClick={() => setWorkspaceType('text')}
              >
                <RadioGroupItem value="text" id="text" className="text-[#8B5CF6]" />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 bg-[#F5F3FF] rounded-full flex items-center justify-center">
                    <Hash className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <Label htmlFor="text" className="text-gray-800 font-medium cursor-pointer">
                      텍스트
                    </Label>
                    <p className="text-[#6B7280] text-xs">메시지, 이미지, 파일을 공유하세요</p>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center space-x-3 p-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors duration-150 cursor-pointer"
                onClick={() => setWorkspaceType('voice')}
              >
                <RadioGroupItem value="voice" id="voice" className="text-[#8B5CF6]" />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 bg-[#F5F3FF] rounded-full flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <Label htmlFor="voice" className="text-gray-800 font-medium cursor-pointer">
                      음성
                    </Label>
                    <p className="text-[#6B7280] text-xs">음성으로 대화하거나 화면을 공유하세요</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">
              카테고리 <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-[#F9FAFB] border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-2 focus:ring-opacity-20 w-full">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <Folder className="w-4 h-4 text-[#6B7280]" />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Channel Name */}
          <div className="space-y-2">
            <Label htmlFor="channelName" className="text-gray-700 font-medium">
              이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="channelName"
              type="text"
              placeholder={workspaceType === 'text' ? '일반-대화' : '일반-음성'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#F9FAFB] border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-2 focus:ring-opacity-20 text-gray-800 placeholder-gray-400"
              maxLength={32}
              required
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#6B7280]">
                {workspaceType === 'text' ? '#' : '🔊'} {name || '워크스페이스-이름'}
              </p>
              <div className="text-xs text-[#6B7280]">
                {name.length}/32
              </div>
            </div>
          </div>

          {/* Channel Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              설명
            </Label>
            <textarea
              id="description"
              placeholder="이 워크스페이스의 용도를 설명해주세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md focus:border-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-2 focus:ring-opacity-20 text-gray-800 placeholder-gray-400 resize-none"
              rows={3}
              maxLength={200}
            />
            <div className="text-xs text-[#6B7280] text-right">
              {description.length}/200
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#E5E7EB] text-gray-700 hover:bg-[#F9FAFB] hover:border-[#D1D5DB] cursor-pointer"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !selectedCategory}
              className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
            >
              채널 만들기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}