export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 p-4 bg-gray-100">
        <h2 className="text-xl font-bold">팀 사이드바</h2>
        {/* 사이드바 내용 */}
      </aside>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}