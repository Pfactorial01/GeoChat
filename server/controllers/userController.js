const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const mongoose = require('mongoose')
const h3 = require("h3-js");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password, coord } = req.body;
        const usernameCheck = await User.findOne({username})
        if (usernameCheck){
            return res.json({ msg: "Username already used", status: false});
        }
        const emailCheck = await User.findOne({ email })
        if (emailCheck){
            return res.json({ msg: "Email already used", status: false});
        }
        const geoIndex = h3.latLngToCell(coord.latitude, coord.longitude, 8);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            geoIndex: geoIndex
        });
        delete user.password;

        const returnData = {
            _id: user._id.toString(),
            username: user.username,
            isAvatarImageSet: user.isAvatarImageSet,
            avatarImage: user.avatarImage
        }
        return res.json({status: true, returnData})
    } catch (err) {
        next(err);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password, coord } = req.body;
        const geoIndex = h3.latLngToCell(coord.latitude, coord.longitude, 8);
        const user = await User.findOne({ email })
        if (!user){
            return res.json({ msg: "Incorrect email or password", status: false});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect email or password", status: false});
        }
        delete user.password
        await User.findByIdAndUpdate(user._id.toString(), {
            geoIndex: geoIndex
        });
        const returnData = {
            _id: user._id.toString(),
            username: user.username,
            isAvatarImageSet: user.isAvatarImageSet,
            avatarImage: user.avatarImage
        }
        return res.json({status: true, returnData})
    } catch (err) {
        next(err);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        console.log(req.body)
        const avatarImage = req.body?.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        });
        return res.json({
            isSet:userData.isAvatarImageSet, 
            image:userData.avatarImage
        })
    } catch (err) {
        next(err)
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId)
        const geoIndex = user.geoIndex
        const users  = await User.find({ _id: {$ne: userId}, geoIndex }).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ]);      
        return res.json({
            users
        })
    } catch (err) {
        next(err)
    }
};


module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };
