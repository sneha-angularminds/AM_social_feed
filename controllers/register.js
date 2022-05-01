const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./../config");
const User = require("./../models/register");
const bcrypt = require("bcryptjs");

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user)
    return res.status(403).json({ error: { message: "Email already in use" } });
  const newUser = new User({ firstName, lastName, email, password });
  try {
    await newUser.save();
    // const token = getSignedToken(newUser);
    res.status(200).json({ newUser });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user)
    if (!user)
      return res
        .status(403)
        .json({ error: { message: "invalid email/password" } });
    // console.log(user.password)
    const isValid = await user.isPasswordValid(password);
    if (!isValid)
      // if(password !== user.password)
      return res.status(403).json({ error: { message: "invalid password" } });
    const token = getSignedToken(user);
    // res.status(200).json({ token, user});
    res.status(200).json({ user: {_id: user._id, firstName:user.firstName, lastName:user.lastName, email:user.email }, token});
}

exports.changepassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const current_user = req.user;
  // console.log(User)
  // console.log(current_user)
  // console.log(bcrypt.compareSync(oldPassword, current_user.password))
  if (bcrypt.compareSync(oldPassword, current_user.password)) 
  {
    if (newPassword === confirmPassword) {
      let hashPassword = bcrypt.hashSync(newPassword, 10)
      await User.updateOne({ _id: current_user.id }, { password: hashPassword });
      let user = await User.findOne({ _id: current_user.id })
      // console.log(user)
      let token = getSignedToken(user)
      return res.status(200).json({ user, token });
    }
    else{
      return res.status(400).json({ message: 'New password and confirm password does not match' });
    }
  }
  else {
    return res.status(400).json({ message: 'Old password does not match' });
  }
}

getSignedToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    },
    SECRET_KEY,
    { expiresIn: "10h" }
  );
};