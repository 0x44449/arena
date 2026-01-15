import { useGetChannel } from "@/api/generated/endpoints/channels/channels";
import { useGetMessages } from "@/api/generated/endpoints/messages/messages";
import { useGetMe } from "@/api/generated/endpoints/users/users";
import type { MessageDto } from "@/api/generated/models";
import { CS } from "@/libs/common-style";
import { LegendList } from "@legendapp/list";
import { ActivityIndicator, Text, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./controls/Header";
import MessageInput from "./controls/MessageInput";
import MessageItem from "./controls/MessageItem";

type ChatRoomScreenProps = {
  channelId: string;
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
};

export default function ChatRoomScreen({ channelId }: ChatRoomScreenProps) {
  const insets = useSafeAreaInsets();
  const { height: keyboardHeight, progress: keyboardProgress } = useReanimatedKeyboardAnimation();

  const { data: meData } = useGetMe();
  const { data: channelData, isLoading: isLoadingChannel } = useGetChannel(channelId);
  const { data: messagesData, isLoading: isLoadingMessages } = useGetMessages(channelId);

  const myUserId = meData?.data?.userId;
  const channel = channelData?.data;
  const messages = messagesData?.data ?? [];

  const isGroup = channel ? channel.participants.length > 2 : false;
  const channelTitle = channel?.name ?? channel?.participants[0]?.user.nick ?? "";
  const memberCount = channel?.participants.length ?? 0;

  const animatedFooterStyle = useAnimatedStyle(() => {
    return {
      height: 80 + insets.bottom - (keyboardProgress.value * insets.bottom) + keyboardHeight.value,
    };
  });

  if (isLoadingChannel || isLoadingMessages) {
    return (
      <View style={[CS.flex1, CS.bgWhite, CS.center]}>
        <ActivityIndicator size="large" color="#3C6DF0" />
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: MessageDto; index: number }) => {
    const isMine = item.sender.userId === myUserId;
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const isConsecutive = prevMessage?.sender.userId === item.sender.userId;
    const isNewSender = !isConsecutive && index > 0;

    return (
      <MessageItem
        id={item.messageId}
        content={item.content}
        senderId={item.sender.userId}
        senderName={item.sender.nick}
        senderAvatar={item.sender.avatar?.url ?? `https://api.dicebear.com/9.x/adventurer/png?seed=${item.sender.userId}`}
        timestamp={formatTime(item.createdAt)}
        isMine={isMine}
        showAvatar={!isMine && !isConsecutive}
        showName={!isMine && isGroup && !isConsecutive}
        isNewSender={isNewSender}
      />
    );
  };

  return (
    <View style={[CS.flex1, CS.bgWhite]}>
      <LegendList
        data={messages}
        keyExtractor={(item) => item.messageId}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={320}
        alignItemsAtEnd={true}
        recycleItems={true}
        initialScrollOffset={99999}
        maintainVisibleContentPosition={true}
        ListFooterComponent={<Animated.View style={animatedFooterStyle} />}
        ListHeaderComponent={<View style={{ height: 60 + insets.top }} />}
        style={{ flex: 1 }}
      />
      <MessageInput />
      <Header title={channelTitle} memberCount={memberCount} />
    </View>
  );
}
