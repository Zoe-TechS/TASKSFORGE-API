import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, (res, req) => {
  console.log(`Server is running on port ${PORT}`);
});
