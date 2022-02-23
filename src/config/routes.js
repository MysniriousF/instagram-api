const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const postsController = require("../controllers/posts.controller");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const extenstion = file.originalname.split(".").pop();
    const fileName = (Math.random() + 1).toString(36).substring(7);
    cb(null, fileName + "." + extenstion);
  },
});
const upload = multer({ storage });

const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  try {
    const user = jwt.verify(token, "snir.nahum");
    req.userId = user.id;
    next();
  } catch (err) {
    console.log(err);
    res.status(403).send();
  }
};
router.post('/post/:id/like', auth, postsController.like);
router.post('/post/:id/unlike', auth, postsController.unlike);
router.post('/post/:id/comment', auth, postsController.createComment)
router.post('/post/:id/comment', auth, postsController.getComments)
router.get('/post/:id', auth, postsController.getOne);
router.post('/post', auth, upload.single('image'), postsController.create);
router.get("/post", postsController.getAll);
router.get('/user/:username/post', auth, postsController.getPosts);
// router.get('/post/:username/post', auth, postsController.getPosts);

router.get("/user/me", auth, usersController.me);
router.post('/user', usersController.create);
router.get('/user/:username', auth, usersController.getUser);
router.get('/search/user/:username', auth, usersController.search);
router.post('user/:username/follow',auth,usersController.Follow)
router.post('user/:username/unfollow',auth,usersController.unFollow)


router.post('/login', usersController.login);
router.get('/health', (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
