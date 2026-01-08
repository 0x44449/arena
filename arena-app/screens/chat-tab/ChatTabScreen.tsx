import { CS } from "@/libs/common-style";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChannelItem from "./controls/ChannelItem";
import EmptyState from "./controls/EmptyState";
import Header from "./controls/Header";

type ChatRoom = {
  id: string;
  title: string;
  participants: Array<{ id: string; avatar: string }>;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
};

const mockRooms: ChatRoom[] = [
  {
    id: "1",
    title: "김코더",
    participants: [{ id: "kim", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=kim" }],
    lastMessage: "오늘 저녁에 회의 가능할까요?",
    lastMessageTime: "오후 2:15",
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "2",
    title: "프로젝트 A",
    participants: [
      { id: "a", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=a" },
      { id: "b", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=b" },
      { id: "c", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=c" },
      { id: "d", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=d" },
    ],
    lastMessage: "새로운 기획안 공유드렸어요. 확인 부탁드립니다.",
    lastMessageTime: "오전 11:02",
    unreadCount: 5,
    isGroup: true,
  },
  {
    id: "3",
    title: "이디자이너",
    participants: [
      { id: "designer", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=designer" },
    ],
    lastMessage: "시안 수정본 전달드렸어요.",
    lastMessageTime: "오전 10:18",
    unreadCount: 1,
    isGroup: false,
  },
  {
    id: "4",
    title: "브레인스토밍",
    participants: [
      { id: "team1", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=team1" },
      { id: "team2", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=team2" },
      { id: "team3", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=team3" },
    ],
    lastMessage: "각자 아이디어 모아서 오후에 공유하죠.",
    lastMessageTime: "오전 9:40",
    unreadCount: 0,
    isGroup: true,
  },
  {
    id: "5",
    title: "마케팅팀",
    participants: [
      { id: "m1", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=m1" },
      { id: "m2", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=m2" },
      { id: "m3", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=m3" },
      { id: "m4", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=m4" },
    ],
    lastMessage: "이번 주 캠페인 일정 확인했습니다.",
    lastMessageTime: "오전 9:10",
    unreadCount: 2,
    isGroup: true,
  },
  {
    id: "6",
    title: "박PM",
    participants: [{ id: "pm", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=pm" }],
    lastMessage: "문서 검토하셨으면 알려주세요.",
    lastMessageTime: "어제",
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "7",
    title: "개발 스터디",
    participants: [
      { id: "dev1", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=dev1" },
      { id: "dev2", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=dev2" },
      { id: "dev3", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=dev3" },
      { id: "dev4", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=dev4" },
    ],
    lastMessage: "이번 주제는 디자인 패턴으로 갈까요?",
    lastMessageTime: "어제",
    unreadCount: 3,
    isGroup: true,
  },
  {
    id: "8",
    title: "법무팀",
    participants: [
      { id: "law1", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=law1" },
    ],
    lastMessage: "계약서 최종본 전달드렸습니다.",
    lastMessageTime: "어제",
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "9",
    title: "디자인 QA",
    participants: [
      { id: "qa1", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=qa1" },
      { id: "qa2", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=qa2" },
    ],
    lastMessage: "QA 시트 업데이트 했어요.",
    lastMessageTime: "어제",
    unreadCount: 0,
    isGroup: true,
  },
  {
    id: "10",
    title: "지원센터",
    participants: [
      { id: "support", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=support" },
    ],
    lastMessage: "고객 문의 대응 완료했습니다.",
    lastMessageTime: "3일 전",
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "11",
    title: "온보딩 친구들",
    participants: [
      { id: "on1", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=on1" },
      { id: "on2", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=on2" },
      { id: "on3", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=on3" },
      { id: "on4", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=on4" },
    ],
    lastMessage: "첫 주 일정 공유합니다.",
    lastMessageTime: "3일 전",
    unreadCount: 0,
    isGroup: true,
  },
  {
    id: "12",
    title: "헬프데스크",
    participants: [
      { id: "help", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=help" },
    ],
    lastMessage: "시스템 점검 예정 안내드립니다.",
    lastMessageTime: "4일 전",
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "13",
    title: "퍼블리셔 모임",
    participants: [
      { id: "pub1", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=pub1" },
      { id: "pub2", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=pub2" },
      { id: "pub3", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=pub3" },
    ],
    lastMessage: "다음 스터디 자료 공유드립니다.",
    lastMessageTime: "4일 전",
    unreadCount: 1,
    isGroup: true,
  },
  {
    id: "14",
    title: "정재무",
    participants: [
      { id: "finance", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=finance" },
    ],
    lastMessage: "비용 관련 자료 정리해서 드릴게요.",
    lastMessageTime: "지난주",
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "15",
    title: "주말 산책",
    participants: [
      { id: "walk1", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=walk1" },
      { id: "walk2", avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=walk2" },
    ],
    lastMessage: "일요일 오전 10시에 만날까요?",
    lastMessageTime: "지난주",
    unreadCount: 4,
    isGroup: true,
  },
];

export default function ChatTabScreen() {
  return (
    <SafeAreaView style={[CS.flex1, CS.bgWhite]} edges={["top", "left", "right"]}>
      <Header />

      <FlatList
        data={mockRooms}
        keyExtractor={(room) => room.id}
        renderItem={({ item }) => (
          <ChannelItem
            title={item.title}
            participants={item.participants}
            lastMessage={item.lastMessage}
            lastMessageTime={item.lastMessageTime}
            unreadCount={item.unreadCount}
            isGroup={item.isGroup}
          />
        )}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
});
