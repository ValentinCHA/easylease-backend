var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

router.post("/upload", async (req, res) => {
  try {
    console.log("CONSOLE REQ UPLOAD", req.files);

    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath);

    if (!resultMove) {
      // Upload the file to Cloudinary
      // const resultCloudinary = await cloudinary.uploader.upload('./tmp/photo.jpg');
      const resultCloudinary = await cloudinary.uploader.upload(photoPath);
      console.log("CONSOLE resultCloudinary", resultCloudinary);
      // Send the response to the client
      res.json({ result: true, url: resultCloudinary.secure_url });
    } else {
      res.json({ result: false, error: resultCopy });
    }

    // Delete the file from the server
    fs.unlinkSync(photoPath);
  } catch (error) {
    // Handle the error
    console.error(error);
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
