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
const reactBuildPath = path.join(__dirname, "client/dist");
app.use(express.static(reactBuildPath));

//health
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"));
});


// Backend Proxy (Spring Boot)
const SPRING_BOOT_URL = "http://coursera-alb-1571933611.us-east-2.elb.amazonaws.com/api/v1";

//forward auth header if exists
const forwardHeaders = (req) => {
    const headers = {};
    if (req.headers["authorization"]) {
        headers["authorization"] = req.headers["authorization"];
    }
    return headers;
};

// Proxy GET
app.get("/api/*", async (req, res) => {
    try {
        const backendUrl = SPRING_BOOT_URL + req.url.replace("/api", "");
        const response = await axios.get(backendUrl, {
            params: req.query,
            headers: forwardHeaders(req)
        });
        res.send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || err.message);
    }
});

// Proxy POST
app.post("/api/*", async (req, res) => {
    try {
        const backendUrl = SPRING_BOOT_URL + req.url.replace("/api", "");
        const response = await axios.post(backendUrl, req.body, {
            headers: forwardHeaders(req)
        });
        res.send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || err.message);
    }
});

// Proxy DELETE
app.delete("/api/*", async (req, res) => {
    try {
        const backendUrl = SPRING_BOOT_URL + req.url.replace("/api", "");
        const response = await axios.delete(backendUrl, {
            headers: forwardHeaders(req)
        });
        res.send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.response?.data || err.message);
    }
});

// Proxy PUT
app.put("/api/*", async (req, res) => {
    try {
        const backendUrl = `${SPRING_BOOT_URL}${req.url.replace("/api", "")}`;
        const response = await axios.put(backendUrl, req.body, {
            headers: req.headers
        });
        res.send(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).send(err.message);
    }
});

// ------------------------------------
// React Router Support (SPA Fallback)
// ------------------------------------
app.get("*", (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"));
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
     console.log(`Production server running at http://localhost:${PORT}`);
});
