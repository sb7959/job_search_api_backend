const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");

const register = async (req, res) => {
  //   const { name, email, password } = req.body;
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(password, salt);
  //   const tempUser = { name, email, password: hashedPassword };
  //console.log(req.body);
  const user = await User.create({ ...req.body });
  const token = user.createToken();

  res.status(StatusCodes.CREATED).json({ name: user.name, token });
  // console.log(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  //console.log(email);
  //console.log(password);
  // console.log(req.body);
  // console.log(`${emali} ${password}`);
  //console.log(email);

  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }

  const user = await User.findOne({ email });
  //  console.log(user);

  if (!user) {
    throw new UnauthenticatedError("invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("invalid credentials");
  }

  const token = user.createToken();
  //console.log(token);

  res.status(StatusCodes.OK).json({ name: user.name, token });
};

module.exports = {
  register,
  login,
};
