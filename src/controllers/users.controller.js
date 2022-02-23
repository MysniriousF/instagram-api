const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const  Mongoose  = require("mongoose");
const md5 = require("md5");

async function create(req, res) {
  const user = new User(req.body);
  user.password = md5(user.password)
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(400).json({ message: "One of the parameters is incorrect" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(403).send({ message: "One of the parameters are missing" });
    return;
  }
  const userExist = await User.findOne({ 
    username, 
    password : md5(password)
   });
  if (!userExist) {
    res.status(403).json({ message: "One of the parameters is incorrect" });
    return;
  }
  console.log(userExist._id);
  const token = jwt.sign({ id: userExist._id }, "snir.nahum");
  console.log(token);
  res.json({ token });
  res.json(userExist);
}

async function me(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.sendStatus(401);
      return;
    }
    res.send(user);
  } catch (err) {
    res.sendStatus(500);
  }
}

async function getUser(req,res) {
  try{
  const { username } = req.params
  const profile = await User.findOne({username});
  if (!profile){
    res.sendStatus(404);
  }
  else {
    res.send({profile});
  }
  
  }catch(err){
    res.sendStatus(500)
  }
}

async function deletedUser(req,res) {
  console.log("here");
  console.log(req.params.userId);
  User.findByIdAndRemove({_id: req.params.userId});
  res.status(200).send();
}

async function search(req, res) {
    const { username } = req.params;
    try {
        const users = await User.find({
            username: new RegExp(username, 'ig')
        });
        res.json(users);
    } catch (e) {
        res.sendStatus(500);
    }
}

async function Follow(req,res) {
  const {username} = req.params;
  const myId = req.userId;
  
  try {
    const whoToFollow = await User.findOne({username})
    if (!whoToFollow){
      res.sendStatus(400)
      return;
    };
    await User.findByIdAndUpdate(
      myId,
      {$addToSet:{following: Mongoose.Types.ObjectId(whoToFollow._id)}}
    );
    res.send()
  }catch(err) {
    res.sendStatus(500);
  }

}


async function unFollow(req,res) {
  const {username} = req.params;
  const myId = req.userId;
  
  try {
    const whoTounFollow = await User.findOne({username})
    if (!whoTounFollow){
      res.sendStatus(400)
      return;
    };
    await User.findByIdAndUpdate(
      myId,
      {$pull:{following: Mongoose.Types.ObjectId(whoTounFollow._id)}}
    );
    res.send()
  }catch(err) {
    res.sendStatus(500);
  }

}


module.exports = {
  create,
  login,
  me,
  deletedUser,
  getUser,
  search,
  Follow,
  unFollow
};
