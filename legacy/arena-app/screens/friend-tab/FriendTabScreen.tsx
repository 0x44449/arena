import { CS } from "@/libs/common-style";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyState from "./controls/EmptyState";
import FriendItem from "./controls/FriendItem";
import Header from "./controls/Header";
import MyProfile from "./controls/MyProfile";

const myProfile = {
  avatar: "https://api.dicebear.com/9.x/adventurer/png?seed=alice",
  nickname: "홍길동",
  tag: "#111",
  statusMessage: "지금은 약속 준비 중",
};

const mockFriends = [
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

const HEADER_HEIGHT = 58;

export default function FriendTabScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[CS.flex1, CS.bgWhite]}>
      <FlatList
        data={mockFriends}
        keyExtractor={(item) => item.tag}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + HEADER_HEIGHT },
        ]}
        ListHeaderComponent={() => (
          <MyProfile
            avatar={myProfile.avatar}
            nickname={myProfile.nickname}
            tag={myProfile.tag}
            statusMessage={myProfile.statusMessage}
          />
        )}
        renderItem={({ item }) => (
          <FriendItem
            avatar={item.avatar}
            nickname={item.nickname}
            tag={item.tag}
            statusMessage={item.statusMessage}
          />
        )}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
});
