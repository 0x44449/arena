import { CS } from "@/libs/common-style";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./controls/Header";
import MessageInput from "./controls/MessageInput";
import MessageItem from "./controls/MessageItem";

type ChatRoomScreenProps = {
  channelId: string;
};

const MY_USER_ID = "me";

const mockChannel = {
  title: "프로젝트 A",
  memberCount: 4,
};

const mockMessages = [
  {
    id: "1",
    content: "안녕하세요! 오늘 회의 몇 시에 하나요?",
    senderId: "user1",
    senderName: "김코더",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=kim",
    timestamp: "오후 2:00",
  },
  {
    id: "2",
    content: "3시에 하기로 했어요",
    senderId: "me",
    senderName: "나",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=me",
    timestamp: "오후 2:01",
  },
  {
    id: "3",
    content: "네 알겠습니다!",
    senderId: "user1",
    senderName: "김코더",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=kim",
    timestamp: "오후 2:01",
  },
  {
    id: "4",
    content: "저도 참석할게요",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:02",
  },
  {
    id: "5",
    content: "회의 자료는 제가 준비해둘게요",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:02",
  },
  {
    id: "6",
    content: "감사합니다 👍",
    senderId: "me",
    senderName: "나",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=me",
    timestamp: "오후 2:03",
  },
  {
    id: "7",
    content: "그럼 이따 봐요~",
    senderId: "user1",
    senderName: "김코더",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=kim",
    timestamp: "오후 2:05",
  },
  {
    id: "8",
    content: "아 그리고 지난번에 말씀드린 디자인 시안 검토 부탁드려요",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:10",
  },
  {
    id: "9",
    content: "피그마 링크 공유해주실 수 있나요?",
    senderId: "me",
    senderName: "나",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=me",
    timestamp: "오후 2:11",
  },
  {
    id: "10",
    content: "네 잠시만요",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:11",
  },
  {
    id: "11",
    content: "https://figma.com/file/abc123",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:12",
  },
  {
    id: "12",
    content: "감사합니다! 바로 확인해볼게요",
    senderId: "me",
    senderName: "나",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=me",
    timestamp: "오후 2:12",
  },
  {
    id: "13",
    content: "저도 같이 볼게요",
    senderId: "user1",
    senderName: "김코더",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=kim",
    timestamp: "오후 2:13",
  },
  {
    id: "14",
    content: "오 디자인 깔끔하네요",
    senderId: "user1",
    senderName: "김코더",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=kim",
    timestamp: "오후 2:15",
  },
  {
    id: "15",
    content: "색상 조합이 좋은 것 같아요",
    senderId: "user1",
    senderName: "김코더",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=kim",
    timestamp: "오후 2:15",
  },
  {
    id: "16",
    content: "감사합니다 ㅎㅎ",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:16",
  },
  {
    id: "17",
    content: "근데 여기 버튼 위치 조금 애매한 것 같은데 어떻게 생각하세요?",
    senderId: "me",
    senderName: "나",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=me",
    timestamp: "오후 2:18",
  },
  {
    id: "18",
    content: "어떤 버튼이요?",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:18",
  },
  {
    id: "19",
    content: "메인 화면 우측 하단에 있는 플로팅 버튼이요",
    senderId: "me",
    senderName: "나",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=me",
    timestamp: "오후 2:19",
  },
  {
    id: "20",
    content: "아 그거요",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:19",
  },
  {
    id: "21",
    content: "위치 조정해볼게요",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:19",
  },
  {
    id: "22",
    content: "넵 감사합니다!",
    senderId: "me",
    senderName: "나",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=me",
    timestamp: "오후 2:20",
  },
  {
    id: "23",
    content: "그럼 3시에 회의실에서 만나요",
    senderId: "user1",
    senderName: "김코더",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=kim",
    timestamp: "오후 2:25",
  },
  {
    id: "24",
    content: "넵!",
    senderId: "me",
    senderName: "나",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=me",
    timestamp: "오후 2:25",
  },
  {
    id: "25",
    content: "알겠습니다~",
    senderId: "user2",
    senderName: "이디자이너",
    senderAvatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer",
    timestamp: "오후 2:26",
  },
];

const HEADER_HEIGHT = 56;

export default function ChatRoomScreen({ channelId }: ChatRoomScreenProps) {
  const insets = useSafeAreaInsets();
  const isGroup = mockChannel.memberCount > 2;

  return (
    <View style={[CS.flex1, CS.bgWhite]}>
      <FlatList
        data={mockMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isMine = item.senderId === MY_USER_ID;
          const prevMessage = index > 0 ? mockMessages[index - 1] : null;
          const isConsecutive = prevMessage?.senderId === item.senderId;

          return (
            <MessageItem
              id={item.id}
              content={item.content}
              senderId={item.senderId}
              senderName={item.senderName}
              senderAvatar={item.senderAvatar}
              timestamp={item.timestamp}
              isMine={isMine}
              showAvatar={!isMine && !isConsecutive}
              showName={!isMine && isGroup && !isConsecutive}
            />
          );
        }}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + HEADER_HEIGHT + 8 },
        ]}
        showsVerticalScrollIndicator={false}
      />
      <Header title={mockChannel.title} memberCount={mockChannel.memberCount} />
      <MessageInput />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
});
