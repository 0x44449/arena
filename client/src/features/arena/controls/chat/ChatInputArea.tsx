import { useState } from 'react';

interface ChatInputAreaProps {
  onSend: (message: string) => void;
}

export default function ChatInputArea(props: ChatInputAreaProps) {
  const { onSend } = props;
  const [input, setInput] = useState<string>('');

  const handleSend = () => {
    if (input.trim() === '') return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex items-center px-4 py-3 bg-white border-t border-gray-300">
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
      {/* <button
        onClick={handleSend}
        className="ml-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
      >
        보내기
      </button> */}
    </div>
  )
}