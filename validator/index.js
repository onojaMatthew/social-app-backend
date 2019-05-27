exports.createPostValidator = (req, res, next) => {
  req.check("title", "Write a title").notEmpty();
  req.check("title", "Title must be between 4 and 150 characters").isLength({
    min: 4, max: 150
  });

  // Body
  req.check("body", "Write a body").notEmpty();
  req.check("body", "Body must be between 4 to 2000 characters").isLength({
    min: 4,
    max: 2000
  });

  // check for errors
  const errors = req.validationErrors();
  // if there is error show the first error
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError
    });
  }

  // proceed to the next control
  next();
};

exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name is required").notEmpty();
  //email
  req.check("email", "Email must be between 3 to 32 characters")
  .matches(/.+\@.+\..+/)
  .withMessage("Email must contain @")
  .isLength({
    min: 4,
    max: 2000
  });

  // password
  req.check("password", "Password is required").notEmpty()
  .matches(/\d/)
  .withMessage("Password must contain a number")
  .isLength({
    min: 6,
    max: 32
  })
  .withMessage("Password must be at least 6 characters long");

  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError
    });
  };

  next();
}