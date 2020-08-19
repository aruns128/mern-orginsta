const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requiredLogin");
const Post = mongoose.model("Post");

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, image } = req.body;
  if (!title || !body || !image) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: image,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result, message: "posted successfully" });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/allposts", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((result) => {
      res.json({ posts: result });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.put("/likepost", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((error, result) => {
    if (error) {
      return res.status(402).json(error);
    } else {
      res.json(result);
    }
  });
});

router.put("/unlikepost", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((error, result) => {
    if (error) {
      return res.status(402).json(error);
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      console.log(err, post);
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

// router.delete("/deletecomment/:postId/:commentId", requireLogin, (req, res) => {
//   Post.findOne({ _id: req.params.postId })
//     .populate("postedBy", "_id")
//     .exec((err, post) => {
//       if (err || !post) {
//         return res.status(422).json({ error: err });
//       }
//       if (post.postedBy._id.toString() === req.user._id.toString()) {
//         post.updateOne(
//           {
//             $pull: { "comments" : { _id: req.params.commentId } },
//           },
//           {
//             new: true,
//           }
//           ).then((result) => {
//             console.log(result);
//             res.json(result);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       }
//     });

//   });

    router.delete("/deletecomment/:postId/:commentId", requireLogin, (req, res) => {
      Post.findByIdAndUpdate(
         req.params.postId,
        {
          $pull: { "comments" : { _id: req.params.commentId } },
        },
        {
          new: true,
        }
      ).exec((error, result) => {
        if (error) {
          return res.status(402).json(error);
        } else {
          res.json(result);
        }
      });
    });

module.exports = router;
