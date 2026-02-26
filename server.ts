import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;
  const upload = multer({ dest: "uploads/" });

  // Mock database for tasks
  const tasks: Record<string, any> = {};

  // API Routes
  app.post("/upload_video", upload.single("file"), (req, res) => {
    const taskId = Math.random().toString(36).substring(7);
    tasks[taskId] = {
      state: "PENDING",
      progress: 0,
      result: null,
    };

    // Simulate processing
    setTimeout(() => {
      tasks[taskId].state = "SUCCESS";
      tasks[taskId].progress = 100;
      
      // Generate mock result
      const isFake = Math.random() > 0.3;
      tasks[taskId].result = {
        prediction: isFake ? 85 + Math.random() * 14 : 5 + Math.random() * 20,
        c2pa: Math.random() > 0.5 ? {
          validated: Math.random() > 0.5,
          signer: Math.random() > 0.5 ? 'Google LLC' : 'Unknown',
        } : null
      };
    }, 3000); // 3 seconds processing time

    res.json({ task_id: taskId });
  });

  app.get("/status/:taskId", (req, res) => {
    const { taskId } = req.params;
    const task = tasks[taskId];

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
