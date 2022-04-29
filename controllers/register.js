const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("./../config");

const User = require("./../models/register");

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user)
    return res.status(403).json({ error: { message: "Email already in use" } });
  const newUser = new User({ firstName, lastName, email, password });
  try {
    await newUser.save();
    const token = getSignedToken(newUser);
    res.status(200).json({ token });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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
    res.status(200).json({ token });
}
getSignedToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};