import { Injectable } from "@nestjs/common";
import { WebhookReceiver } from "livekit-server-sdk";
import { ChannelEventPublisher } from "../realtime/channel-event.publisher";

@Injectable()
export class LiveService {
  constructor(
    private readonly channelPub: ChannelEventPublisher,
  ) {}

  async handleLiveWebhook(body: string, signature: string) {
    const receiver = new WebhookReceiver(
      process.env.LIVEKIT_API_KEY || "arena-dev-live-api-key",
      process.env.LIVEKIT_API_SECRET || "arena-dev-live-secret"
    );

    const received = await receiver.receive(body, signature);
    console.log("Received Livekit webhook event:", received.event);

    switch (received.event) {
      case "room_started":
        break;
      case "room_finished":
        break;
      case "participant_joined":
        break;
      case "participant_left":
        break;
      case "participant_connection_aborted":
        break;
      case "track_published":
        break;
      case "track_unpublished":
        break;
      case "egress_started":
        break;
      case "egress_updated":
        break;
      case "egress_ended":
        break;
      case "ingress_started":
        break;
      case "ingress_ended":
        break;
      default:
        break;
    }
  }
}