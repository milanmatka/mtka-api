const express = require("express");
const { uploadResult,getAllResults } = require("../../Controller/starlineGameController/starlineResultController");

const router = express.Router();

router.post("/upload", uploadResult);
 router.get("/getAllResults", getAllResults);

module.exports = router;
