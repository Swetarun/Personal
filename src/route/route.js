const express= require("express")
const router = express.Router();
const authorController = require("../Controllers/authorController")
const blogsController = require("../Controllers/blogsController")
const authorMid = require("../Middlewares/authorMiddleware")

router.post("/authors",authorController.createAuthor)

router.post("/blogs",authorMid.TokenValidation,authorMid.authorization, blogsController.createBlog)

router.get("/blogs",authorMid.TokenValidation, blogsController.getBlog)

router.put("/blogs/:blogId",authorMid.TokenValidation,authorMid.authorization, blogsController.updateBlog)

router.delete("/blogs/:blogId",authorMid.TokenValidation,authorMid.authorization, blogsController.deleteblog)

router.delete("/blogs",authorMid.TokenValidation, blogsController.deletedByQueryParams)

router.post("/login",authorController.Authorlogin)

module.exports = router;