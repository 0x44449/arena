'use client';

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);

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
        <DialogTitle className="text-base font-semibold sr-only">설정</DialogTitle>
        <DialogDescription className="sr-only">
          프로필 설정 페이지입니다.
        </DialogDescription>

        <div className="flex flex-row flex-1 overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-70 bg-[#FAFAFA] flex flex-col pt-8">
            <div className="flex-1 p-2 pl-10 pr-8">
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
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2 pl-10">
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}