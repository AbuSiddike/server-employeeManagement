import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connect.js";
import authRoutes from "./routes/auth.js";

// Routes
import userRoutes from "./routes/users.js";
import workRoutes from "./routes/workRecords.js";
import payrollRoutes from "./routes/payrolls.js";
import contactRoutes from "./routes/contactMessages.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("Employee Management Server is running");
});

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/work-records", workRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/api/contact-messages", contactRoutes);

// Connect to Database and start Server
const port = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(port, () => console.log(`Server is running on port: ${port}`));
});
