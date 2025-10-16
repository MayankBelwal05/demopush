// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: "*", // allow all origins for quick testing
  methods: ["GET", "POST"],
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// Schema & model
const marketingTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  imageUrl: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  publishDate: { type: Date, required: true },
});
const MarketingTemplate = mongoose.model("MarketingTemplate", marketingTemplateSchema);

// Controller (get templates within next 7 days)
app.get("/api/marketing-template", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAhead = new Date(today);
    weekAhead.setDate(today.getDate() + 7);
    weekAhead.setHours(23, 59, 59, 999);

    const templates = await MarketingTemplate.find({
      publishDate: { $gte: today, $lte: weekAhead }
    }).sort({ publishDate: 1 });

    res.status(200).json({ success: true, data: templates });
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("✅ Marketing Template API running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
