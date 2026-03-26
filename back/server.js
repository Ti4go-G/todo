import app from "./app";
import dbConnect from "./src/database/index.js";
import dotenv from "dotenv";
const PORT = process.env.PORT || 3000;

dotenv.config();

async function startServer() {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}


startServer();