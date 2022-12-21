var express = require("express");
var router = express.Router();

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: "dhzujvrdr",
  api_key: "424696575657912",
  api_secret: "vhtdIu12CJ0eprnzwIZGwQ2R3i4",
});

router.post("/upload", async (req, res) => {
  try {
    // Upload the file to Cloudinary
    const resultCloudinary = await cloudinary.uploader.upload(req.body.chemin, {
      public_id: "myfile",
    });

    // Delete the file from the server
    fs.unlinkSync("./tmp/photo.jpg");

    // Send the response to the client
    res.json({ result: true, url: resultCloudinary.secure_url });
  } catch (error) {
    // Handle the error
    console.error(error);
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
