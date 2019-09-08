const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route   GET api/auth
// @desc    Test route
// @access  Public
// router.get("/", auth, (req, res) => res.send("Auth route"));

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public
// router.get("/", auth, (req, res) => res.send("Auth route"));
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  //Checking for errors in the body
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      // Get users gravatar
      // Not using it so we can get rid of it
      //   const avatar = gravatar.url(email, {
      //     s: "200",
      //     r: "pg",
      //     d: "mm"
      //   });

      //   user = new User({
      //     name,
      //     email,
      //     avatar,
      //     password
      //   });

      //   // Encrypt password 10.. the more you have the more secure but slower
      //   const salt = await bcrypt.genSalt(10);
      //   // creates a hash and saves it to the db
      //   user.password = await bcrypt.hash(password, salt);

      //   await user.save();

      // Return jsonwebtoken
      // res.send("User registered");
      //sub res.send with payload

      //KEEP THE MESSAGES THE SAME "INVALID CREDENTIALS" AS THE ABOVE
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
