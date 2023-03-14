const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function passportConfig(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      const user = result.rows[0];
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "phone",
        passwordField: "password",
      },
      async (phone, password, done) => {
        try {
          const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [phone]
          );
          if (result.rows.length === 0) {
            return done(null, false, { message: "Incorrect phone." });
          }
          const user = result.rows[0];
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
module.exports = passportConfig;