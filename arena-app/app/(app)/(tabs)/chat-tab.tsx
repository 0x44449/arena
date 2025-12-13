import { CS } from "@/libs/common-style";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const ChatAvatar = ({ participants, isGroup }: Pick<ChatRoom, "participants" | "isGroup">) => {
  if (!isGroup) {
    return (
      <Image
        source={{ uri: participants[0]?.avatar }}
        style={styles.avatarSingle}
        contentFit="cover"
      />
    );
  }

  const sliced = participants.slice(0, 4);
  if (sliced.length === 2) {
    return (
      <View style={styles.avatarTwo}>
        <Image
          source={{ uri: sliced[0].avatar }}
          style={[styles.avatarClusterItem, styles.avatarTwoTop]}
          contentFit="cover"
        />
        <Image
          source={{ uri: sliced[1].avatar }}
          style={[styles.avatarClusterItem, styles.avatarTwoBottom]}
          contentFit="cover"
        />
      </View>
    );
  }

  if (sliced.length === 3) {
    return (
      <View style={styles.avatarThree}>
        <Image
          source={{ uri: sliced[0].avatar }}
          style={[styles.avatarClusterItem, styles.avatarThreeTop]}
          contentFit="cover"
        />
        <Image
          source={{ uri: sliced[1].avatar }}
          style={[styles.avatarClusterItem, styles.avatarThreeBottomLeft]}
          contentFit="cover"
        />
        <Image
          source={{ uri: sliced[2].avatar }}
          style={[styles.avatarClusterItem, styles.avatarThreeBottomRight]}
          contentFit="cover"
        />
      </View>
    );
  }

  return (
    <View style={styles.avatarGrid}>
      {sliced.map((member) => (
        <Image
          key={member.id}
          source={{ uri: member.avatar }}
          style={styles.avatarGridItem}
          contentFit="cover"
        />
      ))}
    </View>
  );
};

export default function ChatTab() {
  return (
    <SafeAreaView style={[CS.flex1, CS.bgWhite]} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <View style={styles.headerActions}>
          <View style={styles.headerIconButton}>
            <Feather name="search" size={20} color="#3C3F4B" />
          </View>
          <View style={styles.headerIconButton}>
            <Feather name="edit-3" size={20} color="#3C3F4B" />
          </View>
        </View>
      </View>

      <FlatList
        data={mockRooms}
        keyExtractor={(room) => room.id}
        renderItem={({ item }) => (
          <View style={styles.chatItem}>
            <ChatAvatar participants={item.participants} isGroup={item.isGroup} />
            <View style={styles.chatTextArea}>
              <View style={styles.chatTitleRow}>
                <Text style={styles.chatTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {item.isGroup ? (
                  <Text style={styles.chatTitleCount}>{item.participants.length}</Text>
                ) : null}
              </View>
              <Text style={styles.chatPreview} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            <View style={styles.chatMetaArea}>
              <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
              {item.unreadCount > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>아직 대화가 없습니다</Text>
            <Text style={styles.emptySubtitle}>친구를 선택해 대화를 시작해보세요</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 32,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EEF0F4",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 12,
  },
  avatarSingle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0E2E9",
  },
  avatarTwo: {
    width: 60,
    height: 60,
    position: "relative",
  },
  avatarThree: {
    width: 60,
    height: 60,
    position: "relative",
  },
  avatarClusterItem: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E2E9",
    position: "absolute",
  },
  avatarTwoTop: {
    top: 6,
    left: 6,
  },
  avatarTwoBottom: {
    bottom: 6,
    right: 6,
  },
  avatarThreeTop: {
    top: 2,
    left: 16,
  },
  avatarThreeBottomLeft: {
    bottom: 4,
    left: 6,
  },
  avatarThreeBottomRight: {
    bottom: 4,
    right: 6,
  },
  avatarGrid: {
    width: 60,
    height: 60,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  avatarGridItem: {
    width: 28,
    height: 28,
    borderRadius: 6,
    margin: 1,
    backgroundColor: "#E0E2E9",
  },
  chatTextArea: {
    flex: 1,
    gap: 4,
  },
  chatTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2128",
    flexShrink: 1,
  },
  chatTitleCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  chatPreview: {
    fontSize: 13,
    color: "#6B7280",
  },
  chatMetaArea: {
    alignItems: "flex-end",
    gap: 6,
  },
  chatTime: {
    fontSize: 12,
    color: "#A0A4AF",
  },
  unreadBadge: {
    backgroundColor: "#3C6DF0",
    borderRadius: 999,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    fontSize: 13,
    color: "white",
    fontWeight: "700",
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#434756",
    fontWeight: "600",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B707C",
  },
});
