import ClientLayout from "./client-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientLayout>{children}</ClientLayout>
  )
}
