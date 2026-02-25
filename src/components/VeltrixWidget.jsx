import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaRobot } from "react-icons/fa";
import "../styles/VeltrixWidget.css";

const BASE_URL = "http://localhost:5000";

export default function VeltrixWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // 🔥 Get token (changes when user logs in/out)
  const token = localStorage.getItem("token");

  /* ================= RESET CHAT WHEN USER CHANGES ================= */
  useEffect(() => {
    setMessages([]);
  }, [token]);

  /* ================= AUTO INTRO ================= */
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text:
            "Veltrix online.\nThe gates of the Crossing are active.\nState your objective, gamer.",
        },
      ]);
    }
  }, [open]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      if (!token) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Authentication required. Please login." },
        ]);
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${BASE_URL}/api/chat`,
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "System interference detected." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* ================= FLOATING BUTTON ================= */}
      <div
        className="veltrix-toggle"
        onClick={() => setOpen(!open)}
      >
        <FaRobot size={28} />
      </div>

      {/* ================= CHAT BOX ================= */}
      {open && (
        <div className="veltrix-box">
          <div className="veltrix-header">
            <FaRobot size={16} style={{ marginRight: "8px" }} />
            Veltrix Sentinel
          </div>

          <div className="veltrix-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`veltrix-message ${msg.sender}`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="veltrix-message bot">
                Processing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="veltrix-input-area">
            <input
              type="text"
              placeholder="State your objective..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}