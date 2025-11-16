import { useArenaStore } from "@/stores/arena";
import type { ChannelBannerDto, ChannelDto } from "@/types/arena.type";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChannelBannerItemProps {
  channel: ChannelBannerDto;
}

function ChannelBannerItem(props: ChannelBannerItemProps) {
  const { channel } = props;
  const bannerUrl = channel.bannerImageUrl ? channel.bannerImageUrl : channel.participants.length > 0 ? channel.participants[0].avatarUrl : undefined;
  const message = channel.lastMessage ? channel.lastMessage.message : "아직 메시지가 없습니다.";
  const unreadCount = channel.unreadCount;

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row" }}>
      {/** 이미지 */}
      <Image source={{ uri: bannerUrl }} style={{ width: 48, height: 48, borderRadius: 16, marginRight: 12 }} />
      {/** 채널명 및 마지막 메시지 */}
      <View style={{ flex: 1, paddingTop: 0, marginRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: "500", marginBottom: 2 }}>{channel.name}</Text>
        <Text style={{ fontSize: 12, fontWeight: "400", color: "gray" }}>{message}</Text>
      </View>
      {/** 날짜 및 읽지 않은 메시지 수 */}
      <View style={{ justifyContent: "flex-start", alignItems: "flex-end", paddingTop: 0, paddingBottom: 14 }}>
        <Text style={{ fontSize: 11, color: "gray", textAlign: "right", marginBottom: 4 }}>
          {channel.lastMessage ? new Date(channel.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
        </Text>
        {unreadCount > 0 && (
          <View style={{ backgroundColor: "red", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ color: "white", fontSize: 12 }}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

function renderChannelBannerItem({ item, index }: { item: ChannelBannerDto; index: number }) {
  const router = useRouter();
  const { channelId } = item;

  const handlePress = () => {
    router.navigate(`/channel/${channelId}`);
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <ChannelBannerItem channel={item} />
    </TouchableOpacity>
  )
}

function Header() {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: "#eee" }}>
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 14, alignItems: "center" }}>
        <Text style={{ fontSize: 26, fontWeight: "800" }}>채널 목록</Text>
      </View>
    </View>
  )
}

export default function Channels() {
  const [channelBanners, setChannelBanners] = useState<ChannelBannerDto[]>([]);

  const dummyChannelBanner = {
    channelId: "channel-1",
    name: "General",
    description: "General discussion",
    teamId: "team-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bannerImageUrl: "https://picsum.photos/id/20/200",
    unreadCount: 5,
    lastMessage: {
      messageId: "message-1",
      seq: 1,
      channelId: "channel-1",
      message: "Hello, this is the last message!",
      sender: {
        userId: "user-2",
        email: "user2@example.com",
        displayName: "User Two",
        message: "message from user two",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatarUrl: "https://avatar.iran.liara.run/public/81",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    participants: [],
  } as ChannelBannerDto;
  useEffect(() => {
    const tempChannelBanners: ChannelBannerDto[] = [];
    for (let i = 0; i < 80; i++) {
      tempChannelBanners.push({
        ...dummyChannelBanner,
        channelId: `channel-${i + 1}`,
        name: `Channel name ${i + 1}`,
        bannerImageUrl: Math.random() < 0.5 ? `https://picsum.photos/id/${10 + i}/200` : undefined,
        unreadCount: Math.floor(Math.random() * 10),
        lastMessage: Math.random() < 0.7 ? {
          ...dummyChannelBanner.lastMessage!,
          messageId: `message-${i + 1}`,
          message: `This is the last message for channel ${i + 1} Content here...`,
          sender: {
            ...dummyChannelBanner.lastMessage!.sender,
            userId: `user-${(i % 5) + 1}`,
            displayName: `User ${(i % 5) + 1}`,
            avatarUrl: `https://avatar.iran.liara.run/public/${(i % 5) + 1}`,
          },
        } : undefined,
        participants: [{
          userId: `user-${(i % 5) + 1}`,
          email: `user${(i % 5) + 1}@example.com`,
          displayName: `User ${(i % 5) + 1}`,
          message: `message from user ${(i % 5) + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          avatarUrl: `https://avatar.iran.liara.run/public/${(i % 5) + 1}`,
        }, {
          userId: `user-0`,
          email: `user0@example.com`,
          displayName: `User 0`,
          message: `message from user 0`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          avatarUrl: `https://avatar.iran.liara.run/public/0`,
        }],
      });
    }
    setChannelBanners(tempChannelBanners);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1 }}>
        <Header />
        <FlatList
          data={channelBanners}
          renderItem={renderChannelBannerItem}
          keyExtractor={(item) => item.channelId}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>
    </SafeAreaView>
  )
}