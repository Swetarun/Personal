const authorModel = require('../models/authorModel')
const blogsModel = require('../models/blogsModel')
const date = new Date();

const createBlog = async function (req, res) {
  try {
    const requestBody = req.body;
    if (Object.keys(requestBody).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Invalid request parameters. Please provide blog details",
      });
    }
    const { title, body, authorId, tags, category, subcategory, isPublished } = requestBody;

    if (!title) {
      return res.status(400).send({ status: false, message: "Blog Title is required" });
    }
    if (!body) {
      return res.status(400).send({ status: false, message: "Blog body is required" });
    }
    if (!authorId) {
      return res.status(400).send({ status: false, message: "Author id is required" });
    }
    if (!category) {
      return res.status(400).send({ status: false, message: "Blog category is required" });
    }
    const findAuthor = await authorModel.findById(authorId);
    if (!findAuthor) {
      return res.status(400).send({ status: false, message: "Author does not exists." });
    }

    const blog1 = {
      title, body, authorId, tags, category, subcategory,
      isPublished: isPublished ? isPublished : false,
      publishedAt: isPublished ? date : null
    }
    const createdata = await blogsModel.create(blog1)

    res.status(201).send({ status: true, message: "Blog Created", data: createdata })
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
  }
}

const getBlog = async (req, res) => {
  try {
    const data = req.query
    const blogs = await blogsModel.find({ $and: [data, { isDeleted: false }, { isPublished: true }] }).populate("authorId")
    if (blogs.length == 0) return res.status(404).send({ status: false, msg: "No blogs Available." })
    return res.status(200).send({ status: true, count: blogs.length, data: blogs });
  }
  catch (err) {
    res.status(500).send({ Error: err.message })
  }
}

const updateBlog = async function (req, res) {
  try {
    const requestBody = req.body;
    let blogId = req.params.blogId
    if (Object.keys(requestBody).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Invalid request parameters. Please provide blog details",
      });
    }

    const { title, body, tags, category, subcategory, isPublished } = requestBody;

    const updatblog = await blogsModel.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      {
        $set: {
          title: title, body: body, tags: tags, subcategory: subcategory, category: category,
          isPublished: isPublished ? isPublished : false,
          publishedAt: isPublished ? date : null
        }
      },
      { new: true })
    const blogData = updatblog ?? 'Blog not found.'
    res.status(200).send({ Status: true, Data: blogData })
  }

  catch (err) {
    res.status(500).send({ msg: err.message })
  }
}

const deleteblog = async function (req, res) {
  try {
    let BlogId = req.params.blogId;

    let deletedblog = await blogsModel.findOneAndUpdate(
      { _id: BlogId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true }
    );

    if (deletedblog === null) {
      return res.status(400).send({ status: false, msg: "Blog not found" });
    }
    else {
      return res.status(200).send({ status: true, msg: "Blog Deleted succefully" });
    }
  }
  catch (err) {
    res.status(500).send({ msg: "Error", error: err.message })
  };
}

let deletedByQueryParams = async function (req, res) {
  try {
    let loggedInUser = req.authorId;
    const queryparams = req.query;

    if (Object.keys(queryparams).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "Invalid request parameters. Please provide key-value details",
      });
    }

    const blog = await blogsModel.find({ ...queryparams, isDeleted: false, authorId: loggedInUser })
    //blog not found 
    if (blog.length == 0) {
      return res.status(404).send({ status: false, message: "Blog does not exist" })
    }

    const deletedblogs = await blogsModel.updateMany({ _id: { $in: blog } }, { $set: { deletedAt: date, isDeleted: true } })
    return res.status(200).send({ status: true, msg: "Deleted" });
  }
  catch (err) {
    res.status(500).send({ ERROR: err.message });
  }
};

module.exports= {createBlog, deleteblog, deletedByQueryParams, getBlog, updateBlog}