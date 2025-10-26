import z from "zod";

export type Envelope<T = any> = {
  event: string;
  channelId: string;
  ts: number;
  id: string;
  v: number;
  data?: any;
};

export const EnvelopeSchema = z.object({
  event: z.string(),
  channelId: z.string(),
  ts: z.number(),
  id: z.string(),
  v: z.number(),
  data: z.any().optional(),
});

export function createEnvelope(event: string, channelId: string, data: Object) {
  const env: Envelope = {
    event,
    channelId,
    ts: Date.now(),
    id: crypto.randomUUID(),
    v: 1,
    data,
  };
  return env;
}