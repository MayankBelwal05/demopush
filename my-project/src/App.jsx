// App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

const API_URL = "https://demopush.onrender.com/api/marketing-template"; // change this after deploy

export default function App() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data.success) setTemplates(res.data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchTemplates();
  }, []);

  const downloadImage = async (id) => {
    const element = document.getElementById(`template-${id}`);
    if (!element) return;
    const imgs = element.getElementsByTagName("img");
    for (let img of imgs) img.crossOrigin = "anonymous";

    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
    });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "template.png";
    link.click();
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>🖼 Marketing Templates</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {templates.map((tpl) => (
          <div
            key={tpl._id}
            id={`template-${tpl._id}`}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              overflow: "hidden",
              width: "300px",
              position: "relative",
            }}
          >
            <img
              src={tpl.imageUrl}
              alt={tpl.title}
              style={{ width: "100%", height: "auto" }}
              crossOrigin="anonymous"
            />
            <div style={{ padding: "10px" }}>
              <h4>{tpl.title}</h4>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {tpl.description}
              </p>
              <p style={{ fontSize: "12px", color: "#666" }}>
                📅 Publish:{" "}
                {new Date(tpl.publishDate).toLocaleDateString("en-IN")}
              </p>
              <p style={{ fontSize: "12px", color: "#666" }}>
                🕒 Created:{" "}
                {new Date(tpl.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <button
              onClick={() => downloadImage(tpl._id)}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
