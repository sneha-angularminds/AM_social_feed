const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./../config");
const User = require("./../models/register");
const bcrypt = require("bcryptjs");
const validate = require("./../validation");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client({
  clientId: `${process.env.GOOGLE_CLIENT_ID}`,
});

//------------------------For sign-up page------------------------------------//
exports.register = async (req, res, next) => {
  const { error } = validate.validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { firstName, lastName, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user)
    return res.status(403).json({ error: { message: "Email already in use" } });
  const newUser = new User({ firstName, lastName, email, password });
  try {
    await newUser.save();
    // const token = getSignedToken(newUser);
    res.status(201).json({ newUser });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

//------------------------For login page------------------------------------//
exports.login = async (req, res, next) => {
  const { error } = validate.validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // console.log(user);
  if (!user)
    return res.status(403).json({ error: { message: "invalid email" } });
  // console.log(user.password)
  const isValid = await user.isPasswordValid(password);
  if (!isValid)
    // if(password !== user.password)
    return res.status(403).json({ error: { message: "Password not valid" } });
  const token = getSignedToken(user);
  // res.status(200).json({ token, user});
  res.status(201).json({ user, token });
  // res.status(201).json({ user: {_id: user._id, firstName:user.firstName, lastName:user.lastName, email:user.email }, token});
};

//------------------------For change password------------------------------------//
exports.changepassword = async (req, res, next) => {
  const { error } = validate.changePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { oldPassword, newPassword, confirmPassword } = req.body;
  const current_user = req.user;
  // console.log(User)
  // console.log("current",current_user);
  if (bcrypt.compareSync(oldPassword, current_user.password)) {
    if (newPassword === confirmPassword) {
      let hashPassword = bcrypt.hashSync(newPassword, 10);
      await User.updateOne(
        { _id: current_user.id },
        { password: hashPassword }
      );
      let user = await User.findOne({ _id: current_user._id });
      // console.log(user)
      let token = getSignedToken(user);
      return res.status(201).json({ user, token });
    } else {
      return res
        .status(400)
        .json({ message: "New password and confirm password does not match" });
    }
  } else {
    return res.status(400).json({ message: "Old password does not match" });
  }
};

//------------------------For edit user------------------------------------//
exports.editUser = async (req, res, next) => {
  const { error } = validate.editProfile(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const { name, bio, gender, dob, email, mobile, removeImg } = req.body;
  const current_user = req.user;

  // console.log("r", req.body.removeImg);
  
  if (req.body.removeImg == "true") {
    // console.log("hi")
    await User.updateOne(
      { _id: current_user._id },
      {
        name: name,
        bio: bio,
        gender: gender,
        dob: dob,
        email: email,
        mobile: mobile,
        photo: "",
        removeImg: removeImg
      }
    );
    let user = await User.findOne({ _id: current_user._id });
    // console.log("user",user);
    return res.status(200).json({ user });
  }
  
  // console.log(current_user._id);

  // console.log("u",user)
  // console.log(req.file)
  // console.log(req.file.path)
  
  const user1 = await User.findById({ _id: current_user._id });
  // console.log("u",user.photo);
  // console.log(req.params.editId);
  // console.log("u", user1);
  if (current_user._id == req.params.editId) {
    await User.updateOne(
      { _id: current_user._id },
      {
        name: name,
        bio: bio,
        gender: gender,
        dob: dob,
        email: email,
        mobile: mobile,
        photo: req.file ? req.file.path : user1.photo,
        removeImg: removeImg
      }
    );
    let user = await User.findOne({ _id: current_user._id });
    // console.log(user);
    res.status(200).json({ user });
  } else {
    return res.status(400).json({ message: "Enter valid data" });
  }
};

//------------------------For google login------------------------------------//
exports.googleLogin = async (req, res, next) => {
  const { idToken } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: idToken,
    requiredAudience: `${process.env.GOOGLE_CLIENT_ID}`,
  });

  const payload = ticket.getPayload();
  // console.log(payload)

  try {
    let user = await User.findOne({ email: payload.email });

    // console.log(user);
    if (!user) {
      return res.status(400).send({
        Error: true,
        message: "User not registered! Please sign up to continue",
      });
    } else {
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
        SECRET_KEY,
        {
          expiresIn: "10h",
        }
      );
      return res.status(200).json({
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token,
      });
    }
  } catch (err) {
    // console.log(err);
    return res.status(401).send(` ${err}`);
  }
};

//------------------------For logged in user------------------------------------//
exports.profile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(200).json({ user });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

//------------------------For all user data------------------------------------//
exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json({ user });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

//------------------------Function for getting token------------------------------------//
getSignedToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      createdOn: user.createdOn,
      updatedAt: user.updatedAt,
      name: user.name || "",
      photo: user.photo,
      removeImg: user.removeImg
    },
    SECRET_KEY,
    { expiresIn: "10h" }
  );
};
//2022-04-25T12:18:05.229+00:00
