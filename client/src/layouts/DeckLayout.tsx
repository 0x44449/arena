import DeckPage from "@/pages/Deck/DeckPage";

function DeckLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ffffff'
      }}
    >
      <main style={{ flex: 1 }}>
        <DeckPage />
      </main>
    </div>
  )
}

export default DeckLayout;
