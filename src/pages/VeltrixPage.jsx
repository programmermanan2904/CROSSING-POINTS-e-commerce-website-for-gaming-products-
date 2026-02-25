import VeltrixWidget from "../components/VeltrixWidget";

export default function VeltrixPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f1b",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <VeltrixWidget />
    </div>
  );
}
