const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const Blog = require('../Models/blogsModel');

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};

const TokenValidation = (req, res, next) => {
    try {
        let jwttoken = req.headers["x-Api-key"];
        if (!jwttoken) {
            jwttoken = req.headers["x-api-key"];
        }

        if (!jwttoken) {
            return res.status(401).send({ status: false, msg: "Token must be present" });
        }

        let decodedToken = jwt.verify(jwttoken, "Uranium-Group-24");

        if (decodedToken.length == 0) { return res.status(401).send({ status: false, msg: "Token is incorrect" }) }

        req['authorId']=decodedToken.authorId;
        next();
    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message });
    }
}
const authorization = async (req, res, next) => {
    try {
        let loggedInUser=req.authorId;
        
        let authorLogging;

        if (req.body.hasOwnProperty('authorId')) {

            if (!isValidObjectId(req.body.authorId)) return res.status(400).send({ status: false, msg: "Enter a valid author Id" })
            authorLogging = req.body.authorId;
        }

        else if (req.params.hasOwnProperty('blogId')) {

            if (!isValidObjectId(req.params.blogId)) {
                return res.status(400).send({ status: false, msg: "Enter a valid blog Id" })
            }

            let blogData = await Blog.findById(req.params.blogId);

            if (!blogData) {
                return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });
            }
            authorLogging = blogData.authorId.toString();
        }

         if (!authorLogging) {
            return res.status(400).send({ status: false, msg: "AuthorId is required" });
        }
        if (loggedInUser != authorLogging) return res.status(403).send({ status: false, msg: "Error, authorization failed" });
        next();
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports = { TokenValidation, authorization };