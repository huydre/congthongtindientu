const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/News.controller");

router.get("/", controller.index );

router.post("/postnews", controller.uploadImage, controller.postNews );

router.get("/:id", controller.detailNews );

router.put("/:id", controller.uploadImage, controller.updateNews );

router.delete("/:id", controller.deleteNews );

module.exports = router;