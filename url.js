const { Router } = require("express");
const validUrl = require("valid-url");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  9
);
const URL = require("./model");

const router = Router();

router.get("/", (req, res) => {
  console.log({
    error: false,
    message: "Welcome to kwaba URL shortener service 🔥",
  });
  return res.status(200).json({
    error: false,
    message: "Welcome to kwaba URL shortener service 🔥",
  });
});

router.get("/:code", async (req, res) => {
  try {
    const url = await URL.findOne({ urlCode: req.params.code });

    if (url) {
      url.numberOfClicks++;
      url.save();
      console.log(url);
      return res.redirect(url.longUrl);
    } else {
      console.log("Invalid code");
      return res.status(404).send("Invalid code");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("server error");
  }
});

router.post("/api/url/shorten", async (req, res) => {
  try {
    const { url: longUrl } = req.body;
    const baseUrl = process.env.BASE_URL;
    const urlCode = nanoid();

    if (!validUrl.isUri(longUrl)) {
      console.log({ error: true, message: "Please provide a valid URL" });
      return res
        .status(400)
        .json({ error: true, message: "Please provide a valid URL" });
    }

    if (!validUrl.isUri(baseUrl)) {
      console.log({ error: true, message: "Invalid Base Url" });
      return res.status(400).json({ error: true, message: "Invalid Base Url" });
    }

    const foundUrl = await URL.findOne({ longUrl });
    if (foundUrl)
      return res
        .status(200)
        .json({ error: false, message: "success", url: foundUrl });

    const shortUrl = baseUrl + "/" + urlCode;

    let url = new URL({ longUrl, shortUrl, urlCode, date: new Date() });

    url = await url.save();

    return res.status(201).json({ error: false, message: "success", url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Something went wrong" });
  }
});

module.exports = router;
