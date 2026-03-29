const User = require("./../models/User");

const appError = require("./../utils/appError");

const catchAsync = require("./../utils/catchAsync");

const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return next(new appError("Please provide all the fiels", 400));
  }

  let user = await User.findOne({ email: email });

  if (user) {
    return next(
      new appError(
        "there is already a user with this email address,Login instead",
        409,
      ),
    );
  }

  user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = createToken(user._id);

  const sanitizedUser = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  return res.status(201).json({
    status: "success",
    token,
    data: {
      user: sanitizedUser,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Please proovide both password and email", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Invalid credentials", 401));
  }

  const token = createToken(user._id);

  return res.status(200).json({
    status: "success",
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  //getting the token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new appError("You are not logged in! please login", 401));
  }
  //verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );
  //check is user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError(
        "The user belonging to this token does no longer exists",
        401,
      ),
    );
  }
  //check if user has changed password
  if (currentUser.changedPassword(decoded.iat)) {
    return next(
      new appError(
        "Recenly yout password has changed! please login agian",
        401,
      ),
    );
  }
  //grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  if (!currentPassword || !newPassword || !passwordConfirm) {
    return next(new appError("Please provide all required fields", 400));
  }

  if (newPassword !== passwordConfirm) {
    return next(
      new appError("New password and confirm password must match", 400),
    );
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new appError("User not found", 404));
  }

  const isMatch = await user.correctPassword(currentPassword, user.password);

  if (!isMatch) {
    return next(new appError("Your current password is incorrect", 401));
  }

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;

  user.passwordChangedAt = Date.now() - 1000;

  await user.save();

  const token = createToken(user._id);

  return res.status(200).json({
    status: "success",
    token,
  });
});
