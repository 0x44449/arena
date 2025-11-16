import { dummyData } from "@/controls/channel-room/dummy-data";
import type { ChatMessageDto } from "@/types/arena.type";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Header() {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: "#eee" }}>
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 14, alignItems: "center" }}>
        <Text style={{ fontSize: 26, fontWeight: "800" }}>채널 제목</Text>
      </View>
    </View>
  )
}

interface ChatMessageItemProps {
  message: ChatMessageDto;
  prevMessage?: ChatMessageDto;
  nextMessage?: ChatMessageDto;
}

function ChatMessageItem(props: ChatMessageItemProps) {
  const { message, prevMessage, nextMessage } = props;

  if (message.sender.userId !== "user1") {
    const isPrevSameSender = prevMessage && prevMessage.sender.userId === message.sender.userId;
    const isNextSameSender = nextMessage && nextMessage.sender.userId === message.sender.userId;

    if (isPrevSameSender) {
      return (
        <View style={{ flexDirection: "row" }}>
          {/** 프로필 이미지 자리 */}
          <View style={{ width: 40, height: 40, marginRight: 8 }} />
          <View style={{ flexDirection: "column", maxWidth: "80%", flex: 1 }}>
            {/** 말풍선, 시간 및 추가 정보 */}
            <View style={{ flexDirection: "row" }}>
              {/** 말풍선 */}
              <View style={{ flexDirection: "row", flexShrink: 1 }}>
                {/* 왼쪽 말풍선 꼬리 */}
                <View
                  style={{
                    width: 0,
                    height: 0,
                    borderBottomWidth: 20,
                    borderBottomColor: "transparent",
                    borderRightWidth: 10,
                    borderRightColor: "#333",
                    marginTop: 0,
                    marginRight: -6,
                    // marginLeft: -6,
                    transform: [{ rotate: "15deg" }],
                  }}
                />
                {/* 말풍선 본체 */}
                <View
                  style={{
                    backgroundColor: "#333",
                    borderRadius: 12,
                    borderTopLeftRadius: 0,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    flexShrink: 1,
                    // justifyContent: "center",
                    // alignItems: "center",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "400", color: "#eee", flexWrap: "wrap" }}>{message.message}</Text>
                </View>
              </View>
              {/** 시간 */}
              <View style={{ justifyContent: "flex-end", marginLeft: 6 }}>
                <Text style={{ fontSize: 11, color: "gray" }}>
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={{ flexDirection: "row", flex: 1 }}>
        {/** 프로필 이미지 */}
        <Image
          source={{ uri: message.sender.avatarUrl }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 8 }}
          contentFit="cover"
          transition={0}
          cachePolicy={"disk"}
          recyclingKey={message.sender.userId}
        />
        {/* <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,      // 이건 그대로 유지
            marginRight: 8,
            backgroundColor: "#ccc",
          }}
        /> */}
        <View style={{ flexDirection: "column", maxWidth: "80%" }}>
          {/** 발신자 정보 */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 2 }}>{message.sender.displayName}</Text>
          {/** 말풍선, 시간 및 추가 정보 */}
          <View style={{ flexDirection: "row", flexShrink: 1, backgroundColor: "red" }}>
            {/** 말풍선 */}
            <View style={{ flexDirection: "row", flexShrink: 1 }}>
              {/* 왼쪽 말풍선 꼬리 */}
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderBottomWidth: 20,
                  borderBottomColor: "transparent",
                  borderRightWidth: 10,
                  borderRightColor: "#333",
                  marginTop: 0,
                  marginRight: -6,
                  // marginLeft: -6,
                  transform: [{ rotate: "15deg" }],
                }}
              />
              {/* 말풍선 본체 */}
              <View
                style={{
                  backgroundColor: "#333",
                  borderRadius: 12,
                  borderTopLeftRadius: 0,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  flexShrink: 1,
                  // justifyContent: "center",
                  // alignItems: "center",
                  alignSelf: "flex-start",
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "400", color: "#eee", flexWrap: "wrap" }}>{message.message}</Text>
              </View>
            </View>
            {/** 시간 */}
            <View style={{ justifyContent: "flex-end", marginLeft: 6 }}>
              <Text style={{ fontSize: 11, color: "gray" }}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
  else {
    return (
      <View style={{ flexDirection: "column", maxWidth: "80%", flex: 1, alignSelf: "flex-end" }}>
        {/** 말풍선, 시간 및 추가 정보 */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          {/** 시간 */}
          <View style={{ justifyContent: "flex-end", marginRight: 6 }}>
            <Text style={{ fontSize: 11, color: "gray" }}>
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          {/** 말풍선 */}
          <View style={{ flexDirection: "row", flexShrink: 1 }}>
            {/* 말풍선 본체 */}
            <View
              style={{
                backgroundColor: "#007AFF",
                borderRadius: 12,
                borderTopRightRadius: 0,
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexShrink: 1,
                alignItems: "flex-end",
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "400", color: "#eee", flexWrap: "wrap" }}>{message.message}</Text>
            </View>
            {/* 오른쪽 말풍선 꼬리 */}
            <View
              style={{
                width: 0,
                height: 0,
                borderBottomWidth: 20,
                borderBottomColor: "transparent",
                borderLeftWidth: 10,
                borderLeftColor: "#007AFF",
                marginTop: 0,
                marginLeft: -6,
                transform: [{ rotate: "-15deg" }],
              }}
            />
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <View style={{ flexDirection: "row" }}>
        {/** 프로필 이미지 */}
        <Image
          source={{ uri: message.sender.avatarUrl }}
          style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
          transition={0}
          cachePolicy={"disk"}
          recyclingKey={message.sender.userId}
        />
        <View style={{ flex: 1 }}>
          {/** 발신자 이름 */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 2 }}>{message.sender.displayName}</Text>
          {/** 메시지 내용 */}
          <Text style={{ fontSize: 13, fontWeight: "400", color: "#666" }}>{message.message}</Text>
        </View>
      </View>
    </View>
  )
}

const dummyMessage = {
  messageId: "msg1",
  seq: 1,
  channelId: "channel1",
  message: dummyData[0],
  sender: {
    userId: "user1",
    username: "User One",
    email: "user1@example.com",
    displayName: "User One",
    message: "This is a message from User One",
    avatarUrl: "https://avatar.iran.liara.run/public/81",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as ChatMessageDto;
const dummyMessages: ChatMessageDto[] = [];
let timer = 0;
for (let i = 0; i < 200; i++) {
  const index = Math.floor(Math.random() * 5) + 1;

  dummyMessages.push({
    ...dummyMessage,
    messageId: `msg-${i + 1}`,
    seq: i,
    message: dummyData[Math.floor(Math.random() * dummyData.length)],
    sender: {
      ...dummyMessage.sender,
      userId: `user${index}`,
      email: `user${index}@example.com`,
      displayName: `User ${index}`,
      avatarUrl: `https://avatar.iran.liara.run/public/${index + 80}`,
    },
    createdAt: new Date(Date.now() - timer).toISOString(),
    updatedAt: new Date(Date.now() - timer).toISOString(),
  });

  timer += Math.floor(Math.random() * 60) * 500 * Math.floor(Math.random() * 60);
}

export default function Workspace() {
  const [messages, setMessages] = useState<ChatMessageDto[]>(dummyMessages);

  const renderMessageItem = ({ item, index }: { item: ChatMessageDto, index: number }) => {
    const prevMessage = messages[index + 1];
    const nextMessage = messages[index - 1];

    const isPrevSameSender = prevMessage && prevMessage.sender.userId === item.sender.userId;
    const isNextSameSender = nextMessage && nextMessage.sender.userId === item.sender.userId;

    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: isPrevSameSender ? 4 : 10,
          paddingBottom: isNextSameSender ? 4 : 10,
        }}
      >
        <ChatMessageItem message={item} prevMessage={prevMessage} nextMessage={nextMessage} />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <Header />
        <FlatList
          style={{ flex: 1 }}
          inverted
          data={messages}
          keyExtractor={(item) => item.messageId}
          renderItem={renderMessageItem}
          contentContainerStyle={{ paddingVertical: 8 }}

          initialNumToRender={15}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={16}
          windowSize={5}
          removeClippedSubviews={true}
        />
        {/* <FlashList
          style={{ flex: 1 }}
          data={messages}
          keyExtractor={(item) => item.messageId}
          renderItem={renderMessageItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          maintainVisibleContentPosition={{
            startRenderingFromBottom: true
          }}
        /> */}
      </View>
    </SafeAreaView>
  )
}