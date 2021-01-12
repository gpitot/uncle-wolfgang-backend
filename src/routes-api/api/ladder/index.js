import express from "express";
const router = express.Router();

router.put("/", async (req, res) => {
  console.log(req.body);
  res.json({
    hello: "word",
  });
});

router.get("/", async (_, res) => {
  res.send("hello world123");
});

export default router;
