var express = require("express");
var router = express.Router();
var UserModel = require("../models/Users");
var BoardModel = require("../models/Board");
var PostModel = require("../models/Posts");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var upload = require("./multer");

// Configure Passport
passport.use(new LocalStrategy(UserModel.authenticate()));

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

// Profile (protected)
router.get("/profile", isLoggedIn, async function (req, res) {
  const user = await UserModel.findOne({
    username: req.session.passport.user,
  }).populate("posts");
  console.log(req.session.passport.user);

  res.render("profile", { user });
});

router.get("/feed", isLoggedIn, async function (req, res) {
  const posts = await PostModel.find();
  res.render("feed", { posts: posts });
});

router.get("/postUpload", isLoggedIn, function (req, res) {
  res.render("postUpload");
});

router.get("/pin/:id", isLoggedIn, async function (req, res) {
  try {
    const post = await PostModel.findById(req.params.id); // findOne({_id: req.params.id})
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const board = await BoardModel.findById(post.board).populate("posts");
    if (!board) {
      return res.status(404).send("Board not found");
    }

    res.render("details", { post, board });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Login page
router.get("/login", function (req, res) {
  res.render("login", { error: req.flash("error") });
});

// Handle register
router.post("/register", function (req, res) {
  const { username, email, profileImage, password, bio } = req.body;

  const userData = new UserModel({
    username: username,
    email: email,
    password: password,
    profileImage: profileImage,
    bio: bio,
  });

  UserModel.register(userData, password, function (err, user) {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});



router.post(
  "/updateProfile",
  isLoggedIn,
  upload.single("profileImage"),
  async function (req, res) {
    try {
      const { username, profession, bio } = req.body;
      console.log("User ID:", req.user.id);
      console.log("Form data:", { username, profession, bio });
      console.log("File:", req.file);

      // Prepare update data
      const updateData = {
        username: username || req.user.username,
        bio: bio || req.user.bio,
      };

      // Add profession if your user model has this field
      if (profession !== undefined) {
        updateData.profession = profession;
      }

      // If a new profile image was uploaded, update the profileImage field
      if (req.file) {
        updateData.profileImage = "/images/uploads/" + req.file.filename;
      }

      console.log("Update data:", updateData);

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updateData },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update the session to reflect the new user data
      req.login(updatedUser, function (err) {
        if (err) {
          console.error("Error updating session:", err);
          return res.status(500).json({
            success: false,
            message: "Server error",
          });
        }

        // Send JSON response for AJAX requests
        if (req.xhr || req.headers.accept.indexOf("json") > -1) {
          res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
          });
        } else {
          // Redirect for regular form submissions
          res.redirect("/profile");
        }
      });
    } catch (err) {
      console.error("Error updating profile:", err);

      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 5MB.",
          });
        }
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

router.post("/upload", upload.single("file"), async function (req, res) {
  console.log(req.session.passport);

  try {
    const boardName = req.body.board;
    const board = await BoardModel.findOne({ name: boardName });
    const user = await UserModel.findOne({
      username: req.session.passport.user,
    });

    console.log("Board from form:", req.body.board);
    console.log("Board found in DB:", board);
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    // Create a new Post
    const newPost = new PostModel({
      title: req.body.title,
      description: req.body.description || "",
      author: user,
      board: board ? board._id : null,
      image: `/images/uploads/${req.file.filename}`,
    });

    await newPost.save();

    // Push post into user
    user.posts.push(newPost._id);
    await user.save();

    // Only push into board if it exists
    if (board) {
      board.posts.push(newPost._id);
      await board.save();
    }

    return res.redirect("/profile");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong while uploading");
  }
});

// Handle login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Handle logout
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/login");
  });
});

// Example delete route
router.get("/delete", async function (req, res) {
  const user = await UserModel.findOneAndDelete({ email: "sigma@male" });
  res.send(user);
});

// Middleware to check authentication
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

module.exports = router;
