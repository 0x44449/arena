import chatApi from '@/api/chat';
import { Button } from '@/components/ui/button';
import { FilePlus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useChatStore } from '../stores/chat-store';

interface ChatInputAreaProps {
  // onSend: (message: string) => void;
}

interface AttachmentPreview {
  file: File;
  url: string;
  type: 'image' | 'video' | 'file';
}

export default function ChatInputArea(props: ChatInputAreaProps) {
  const { featureId } = useChatStore();
  const [input, setInput] = useState<string>('');
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);

  const handleSend = async () => {
    if (!featureId) {
      console.error("Feature ID is not set. Cannot send message.");
      return;
    }

    const trimmedInput = input.trim();
    if (attachments.length === 0 && trimmedInput === '') return;
    
    setInput('');

    // 첨부파일 존재시 첨부파일 전송
    const files = attachments.map(attachment => attachment.file);
    const attachmentIds: string[] = [];

    if (files.length > 0) {
      const attachmentsResponse = await chatApi.uploadAttachments(featureId, files);
      if (attachmentsResponse.success) {
        attachmentIds.push(...(attachmentsResponse.data || []).map(a => a.fileId));
      }

      // 첨부파일 업로드 후 미리보기 제거
      setAttachments([]);
    }

    // 메시지 전송
    await chatApi.sendMessage(featureId, {
      text: trimmedInput,
      attachmentIds: attachmentIds
    });
  };

  const handleAddAttachment = () => {
    if (attachmentInputRef.current) {
      attachmentInputRef.current.click();
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: AttachmentPreview[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      let type: 'image' | 'video' | 'file' = 'file';

      if (file.type.startsWith('image/')) {
        type = 'image';
      } else if (file.type.startsWith('video/')) {
        type = 'video';
      }

      newAttachments.push({ file, url, type });
    }

    setAttachments((prev) => [...prev, ...newAttachments]);

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = '';
    }
  }

  const removeAttachment = (index: number) => {
    const attachment = attachments[index];
    URL.revokeObjectURL(attachment.url); // 메모리 정리
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const renderAttachmentPreview = (attachment: AttachmentPreview, index: number) => {
    switch (attachment.type) {
      case 'image':
        return (
          <div className="relative">
            <img
              src={attachment.url}
              alt={attachment.file.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-300"
            />
            <button
              onClick={() => removeAttachment(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        );
      case 'video':
        return null;
      case 'file':
        return null;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col bg-white border-t border-gray-300">
      {/* 첨부파일 미리보기 영역 */}
      {attachments.length > 0 && (
        <div className="px-4 pt-4">
          {attachments.map((attachment, index) => (
            <div key={index} className="flex items-center space-x-2">
              {renderAttachmentPreview(attachment, index)}
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center px-4 py-3 bg-white">
        {/* 첨부파일 업로드 버튼 */}
        <input
          ref={attachmentInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          onChange={handleAttachmentChange}
          multiple
        />
        <div
          className="mr-3 text-gray-500 hover:text-gray-700 transition rounded-full cursor-pointer bg-gray-200 hover:bg-gray-400 p-1.5"
          onClick={handleAddAttachment}
        >
          <FilePlus size={24} strokeWidth={1.5} />
        </div>

        {/* 입력창 */}
        <input
          placeholder="메시지를 입력하세요"
          className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 box-border"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
              e.preventDefault(); // Enter 키 입력 후 줄바꿈 방지
              setInput(''); // 입력창 초기화
            }
          }}
        />

        {/* 보내기 버튼 */}
        <Button className="ml-3 cursor-pointer" onClick={handleSend}>보내기</Button>
      </div>
    </div>
  )
}