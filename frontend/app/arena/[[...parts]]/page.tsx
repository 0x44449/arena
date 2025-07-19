import ArenaClient from "./arena-client";

interface PageProps {
  params: { parts?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <ArenaClient />
  )
}