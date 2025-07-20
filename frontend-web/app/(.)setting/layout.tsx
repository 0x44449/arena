'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setIsOpen(next);
    if (!next) {
      if (history.length > 1) {
        router.back();
        setTimeout(() => {
          if (location.pathname.startsWith('/setting')) {
            router.replace('/arena'); // fallback
          }
        }, 50);
      } else {
        router.replace('/arena');
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-none max-w-none w-screen h-screen left-0 top-0 translate-x-0 translate-y-0 rounded-none p-0 flex flex-col overflow-hidden gap-0">
        {/* <DialogContent className="h-screen w-screen flex flex-col rounded-none bg-white overflow-hidden"> */}
        {/* <DialogHeader className="flex flex-row items-center justify-between px-4 py-6"> */}
        <DialogTitle className="text-base font-semibold sr-only">설정</DialogTitle>
        {/* <button
            onClick={() => close(false)}
            className="text-xs px-2 py-1 rounded hover:bg-neutral-100"
          >
            닫기
          </button> */}
        {/* </DialogHeader> */}

        <div className="flex flex-row flex-1 overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-70 bg-[#FAFAFA] flex flex-col pt-8">
            {/* <div className="h-12 border-b border-[#E5E7EB] flex items-center px-4 bg-white shadow-sm">
              <h2 className="text-gray-800 font-semibold">설정</h2>
            </div> */}

            <div className="flex-1 p-2 pl-10">
              <div className="space-y-1">
                <button
                  // onClick={() => setActiveSection(category.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-150 ${true
                    ? 'bg-[#8B5CF6] text-white'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]'
                    }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">프로필</span>
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 flex flex-col bg-white border-l border-[#E5E7EB] pt-8">
            {/* Header */}
            {/* <div className="h-12 border-b border-[#E5E7EB] flex items-center justify-between px-6 bg-white shadow-sm">
              <h1 className="text-gray-800 font-semibold">프로필 설정</h1>
              <button
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#374151] transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div> */}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2 pl-10">
              {children}
            </div>

            {/* Save Changes Bar */}
            {hasChanges && (
              <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-[#6B7280] text-sm">변경사항이 저장되지 않았습니다.</p>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      // onClick={handleReset}
                      className="border-[#E5E7EB] text-gray-700 hover:bg-white hover:border-[#D1D5DB]"
                    >
                      초기화
                    </Button>
                    <Button
                      // onClick={handleSave}
                      className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                    >
                      변경사항 저장
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}