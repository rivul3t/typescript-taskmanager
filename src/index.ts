import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server listen on http://localhost:${PORT}`);
});
