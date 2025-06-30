import ChatMessageDto from "@/types/chat-message.dto";
import ChatAttachment from "./ChatAttachment";
import { useChatStore } from "../../stores/chat-store";

interface ChatAreaProps {
}

export default function ChatArea(props: ChatAreaProps) {
  const { messages } = useChatStore();

  return (
    <div className="overflow-y-scroll bg-red-100 flex flex-1">
      <div style={{ height: 500 }}></div>
    </div>
  )
}

// export default function ChatArea(props: ChatAreaProps) {
//   const { messages } = useChatStore();

//   return (
//     <div className="flex flex-col flex-1 overflow-y-auto bg-red-100">
//       <div className="h-full overflow-y-auto">
//         <div className="px-4 py-2">
//           {messages.map((message, idx) => (
//             <div key={idx} className="mb-2">
//               <div className="flex items-start gap-3 px-4 py-2">
//                 {/* 아바타 */}
//                 <img
//                   src={message.sender.avatarUrl}
//                   alt="avatar"
//                   className="w-10 h-10 rounded-full object-cover"
//                 />

//                 {/* 메시지 본문 */}
//                 <div className="flex flex-col">
//                   {/* 이름 + 시간 */}
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-semibold text-gray-800">{message.sender.displayName}</span>
//                     <span className="text-xs text-gray-400">{new Date(message.createdAt).toLocaleTimeString()}</span>
//                   </div>

//                   {/* 첨부파일 영역 */}
//                   {message.attachments && message.attachments.length > 0 && (
//                     <>
//                       {message.attachments.map((attachment) => (
//                         <ChatAttachment key={attachment.fileId} message={message} attachment={attachment} />
//                       ))}
//                     </>
//                   )}

//                   {/* 메시지 내용 */}
//                   <div className="text-sm text-gray-700 whitespace-pre-wrap">
//                     {message.text}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }