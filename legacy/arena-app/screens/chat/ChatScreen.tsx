import { useGetChannel } from "@/api/generated/endpoints/channels/channels";
import { useGetMessages } from "@/api/generated/endpoints/messages/messages";
import { useGetMe } from "@/api/generated/endpoints/users/users";
import type { MessageDto } from "@/api/generated/models";
import { CS } from "@/libs/common-style";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import Header from "./controls/Header";
import MessageInput from "./controls/MessageInput";
import MessageItem from "./controls/MessageItem";

type ChatScreenProps = {
  channelId: string;
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
};

export default function ChatScreen({ channelId }: ChatScreenProps) {
  const { data: meData } = useGetMe();
  const { data: channelData, isLoading: isLoadingChannel } = useGetChannel(channelId);
  const { data: messagesData, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessages(channelId, undefined, {
    query: { staleTime: 0, gcTime: 0 }
  });

  const myUserId = meData?.data?.userId;
  const channel = channelData?.data;
  const messages = messagesData?.data ?? [];
  console.log('messages', messages);

  const isGroup = channel ? channel.participants.length > 2 : false;
  const channelTitle = channel?.name ?? channel?.participants[0]?.user.nick ?? "";
  const memberCount = channel?.participants.length ?? 0;

  if (isLoadingChannel || isLoadingMessages) {
    return (
      <View style={[CS.flex1, CS.bgWhite, CS.center]}>
        <ActivityIndicator size="large" color="#3C6DF0" />
      </View>
    );
  }

  // API는 오래된순(ASC)으로 반환 [오래된, ..., 최신]
  // inverted FlatList는 데이터를 뒤집어서 보여주므로, 최신이 아래로 가려면 역순 필요
  const reversedMessages = [...messages].reverse();

  const renderItem = ({ item, index }: { item: MessageDto; index: number }) => {
    const isMine = item.sender.userId === myUserId;
    // inverted + 역순 데이터이므로 index+1이 화면상 이전 메시지
    const nextMessage = index < reversedMessages.length - 1 ? reversedMessages[index + 1] : null;
    const isConsecutive = nextMessage?.sender.userId === item.sender.userId;
    const isNewSender = !isConsecutive && index < reversedMessages.length - 1;

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
      <Header title={channelTitle} memberCount={memberCount} />
      <KeyboardAvoidingView
        style={CS.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={reversedMessages}
          keyExtractor={(item) => item.messageId}
          renderItem={renderItem}
          inverted
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
        <MessageInput channelId={channelId} onMessageSent={refetchMessages} />
      </KeyboardAvoidingView>
    </View>
  );
}
