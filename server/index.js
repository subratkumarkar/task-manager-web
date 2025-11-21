import express from "express";
import cors from "cors";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientBuildPath = path.join(__dirname, "../client/dist");

// Serve frontend
app.use(express.static(clientBuildPath));

// Health check
app.get("/health", (req, res) => {
    res.send({ status: "UP" });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Proxy API
const BACKEND = process.env.API_URL || "http://coursera-alb-1571933611.us-east-2.elb.amazonaws.com/api/v1";

app.use("/api", async (req, res) => {
    const url = BACKEND + req.url;
    try {
        const response = await axios({
            url,
            method: req.method,
            data: req.body,
            headers: {
                authorization: req.headers.authorization || "",
            },
            params: req.query,
        });

        res.status(response.status).send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || err.message);
    }
});

// SPA fallback
app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
