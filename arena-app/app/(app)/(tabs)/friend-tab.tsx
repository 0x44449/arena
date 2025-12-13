import { CS } from "@/libs/common-style";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FriendTab() {
  const myProfile = {
    avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=alice",
    nickname: "홍길동",
    tag: "#111",
    statusMessage: "지금은 약속 준비 중",
  };

  const friends: Array<{
    avatar: string;
    nickname: string;
    tag: string;
    statusMessage?: string;
  }> = [
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=naomi",
      nickname: "김코더",
      tag: "#218",
      statusMessage: "오늘도 개발 중",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=zeke",
      nickname: "라이언",
      tag: "#404",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=hana",
      nickname: "한아름",
      tag: "#512",
      statusMessage: "새 프로젝트가 기대돼요",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=june",
      nickname: "준",
      tag: "#613",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=nova",
      nickname: "노바",
      tag: "#744",
      statusMessage: "여행 중입니다",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=leo",
      nickname: "레오",
      tag: "#852",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=sora",
      nickname: "소라",
      tag: "#903",
      statusMessage: "신곡 추천받아요",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=kai",
      nickname: "카이",
      tag: "#118",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=mina",
      nickname: "미나",
      tag: "#229",
      statusMessage: "커피 한 잔 어때요?",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=orion",
      nickname: "오리온",
      tag: "#330",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=ella",
      nickname: "엘라",
      tag: "#441",
      statusMessage: "오늘은 독서 중",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=ru",
      nickname: "루",
      tag: "#552",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=haru",
      nickname: "하루",
      tag: "#663",
      statusMessage: "달리기 완료!",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=aria",
      nickname: "아리아",
      tag: "#774",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=dune",
      nickname: "듄",
      tag: "#885",
      statusMessage: "사막 사진 정리 중",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=luna",
      nickname: "루나",
      tag: "#996",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=tae",
      nickname: "태",
      tag: "#207",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=maru",
      nickname: "마루",
      tag: "#318",
      statusMessage: "반려견과 산책 중",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=vera",
      nickname: "베라",
      tag: "#429",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=neo",
      nickname: "네오",
      tag: "#540",
      statusMessage: "새 장비 테스트",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=jade",
      nickname: "제이드",
      tag: "#651",
    },
    {
      avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=zen",
      nickname: "젠",
      tag: "#762",
      statusMessage: "명상 시간",
    },
  ];

  return (
    <SafeAreaView style={[CS.flex1, CS.bgWhite]} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <View style={styles.headerActions}>
          <View style={styles.headerIconButton}>
            <Feather name="search" size={20} color="#3C3F4B" />
          </View>
          <View style={styles.headerIconButton}>
            <Feather name="user-plus" size={20} color="#3C3F4B" />
          </View>
        </View>
      </View>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.tag}
        contentContainerStyle={styles.scrollBody}
        ListHeaderComponent={() => (
          <>
            <View style={styles.myProfileBlock}>
              <Image
                source={{ uri: myProfile.avatar }}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>
                  {myProfile.nickname} <Text style={styles.profileTag}>{myProfile.tag}</Text>
                </Text>
                {myProfile.statusMessage ? (
                  <Text style={styles.statusMessage} numberOfLines={1}>
                    {myProfile.statusMessage}
                  </Text>
                ) : null}
              </View>
            </View>

          </>
        )}
        renderItem={({ item: friend }) => (
          <View style={styles.friendItem}>
            <Image
              source={{ uri: friend.avatar }}
              style={styles.avatarSmall}
              contentFit="cover"
            />
            <View style={styles.friendDetails}>
              <Text style={styles.friendName}>
                {friend.nickname} <Text style={styles.friendTag}>{friend.tag}</Text>
              </Text>
              {friend.statusMessage ? (
                <Text style={styles.friendStatus} numberOfLines={1}>
                  {friend.statusMessage}
                </Text>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>아직 친구가 없습니다</Text>
            <Text style={styles.emptyText}>친구를 추가하면 여기에 표시됩니다</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollBody: {
    paddingBottom: 24,
  },
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
  myProfileBlock: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#F5F6F8",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E0E2E9",
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F222C",
  },
  profileTag: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  statusMessage: {
    fontSize: 13,
    color: "#6B7280",
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 12,
  },
  avatarSmall: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E0E2E9",
  },
  friendDetails: {
    flex: 1,
    gap: 3,
  },
  friendName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F222C",
  },
  friendTag: {
    fontSize: 13,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  friendStatus: {
    fontSize: 12,
    color: "#717680",
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 6,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B707C",
  },
});
