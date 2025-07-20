'use client';

import { CreateTeamDto } from "@/api/generated";
import teamApi from "@/api/team-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Server } from "lucide-react";
import { useState } from "react";

export default function TeamAddButton() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const teamMutation = useMutation({
    mutationFn: async (param: CreateTeamDto) => {
      const response = await teamApi.createTeam(param);
      if (!response.success) {
        throw new Error(response.errorCode || 'Failed to create team');
      }
      return response.data;
    }
  });

  const handleCreateClick = async () => {
    if (!name.trim()) return;

    try {
      await teamMutation.mutateAsync({ name, description });
      queryClient.invalidateQueries({ queryKey: ['teams'] });

      setName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create team:", error);
      return;
    } finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative group mt-2">
          <button
            className={cn(
              "w-12 h-12 bg-white border-2 border-dashed border-[#D1D5DB] rounded-full flex items-center justify-center transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#F5F3FF] shadow-sm hover:shadow-md"
            )}
          >
            <Plus className="w-6 h-6 text-[#8B5CF6] transition-colors duration-200" />
          </button>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white border border-[#E5E7EB] shadow-xl">
        <DialogHeader className="text-center pb-2">
          {/* <div className="mx-auto w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-full flex items-center justify-center mb-3">
            <Server className="w-6 h-6 text-white" />
          </div> */}
          <DialogTitle className="text-xl text-gray-800">새 팀 만들기</DialogTitle>
          <DialogDescription className="sr-only">새로운 팀을 만들어 친구들과 함께 대화해보세요.</DialogDescription>
          {/* <p className="text-[#6B7280] text-sm mt-1">
            새로운 팀을 만들어 친구들과 함께 대화해보세요.
          </p> */}
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="serverName" className="text-gray-700 font-medium">
              이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="serverName"
              type="text"
              placeholder="멋진 팀"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#F9FAFB] border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-2 focus:ring-opacity-20 text-gray-800 placeholder-gray-400"
              maxLength={50}
              required
            />
            <div className="text-xs text-[#6B7280] text-right">
              {name.length}/50
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              설명
            </Label>
            <textarea
              id="description"
              placeholder="이 팀에 대해 간단히 설명해주세요..."
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

          <DialogFooter className="flex space-x-3 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#E5E7EB] text-gray-700 hover:bg-[#F9FAFB] hover:border-[#D1D5DB]"
              >
                취소
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={!name.trim()}
              className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              onClick={handleCreateClick}
            >
              팀 만들기
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}