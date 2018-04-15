// Requires
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SEED = require("../config/config").SEED;
const CLIENT_ID = require("../config/config").CLIENT_ID;

// Init Variables
const app = express();
const Users = require("../models/user");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload["sub"];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return {
    name: payload.name,
    image: payload.picture,
    email: payload.email,
    google: true
  };
}
// verify().catch(console.error);
app.post("/google", async (request, response) => {
  const token = request.body.token;
  const googleUser = await verify(token).catch(error => {
    return response.status(403).json({
      ok: false,
      message: "Error: " + error,
      error: {
        message: "Error: " + error
      }
    });
  });

  Users.findOne({ email: googleUser.email }, (error, user) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error al encontrar el usuario",
        errors: error
      });
    }

    if (user) {
      if (user.googleUser === false) {
        return response.status(400).json({
          ok: false,
          message: "Debe de usar una autentificación normal"
        });
      } else {
        const token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

        return response.status(200).json({
          ok: true,
          user: user,
          id: user._id,
          token: token
        });
      }
    } else {
      // Create User
      const user = new Users();
      user.name = googleUser.name;
      user.img = googleUser.image;
      user.email = googleUser.email;
      user.google = true;
      user.password = "******";

      user.save((error, user) => {
        if (error) {
          return response.status(500).json({
            ok: false,
            message: "Error al crear el usuario",
            errors: error
          });
        }

        const token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

        return response.status(200).json({
          ok: true,
          user: user,
          id: user._id,
          token: token
        });
      });
    }
  });

  // return response.status(200).json({
  //     ok: true,
  //     message: "Todo ok",
  //     googleUser: googleUser
  // });
});

app.post("/", (request, response) => {
  const body = request.body;

  Users.findOne({ email: body.email }, (error, user) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error al encontrar el usuario",
        errors: error
      });
    }

    if (!user) {
      return response.status(400).json({
        ok: false,
        message: `El usuario con email ${body.email} no existe`,
        user: user,
        errors: {
          message: "No existe un usuario con ese email."
        }
      });
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
      return response.status(400).json({
        ok: false,
        message: `Credenciales incorrectas`,
        user: user,
        errors: {
          message: "Credenciales incorrectas."
        }
      });
    }

    user.password = "*****";

    const token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

    response.status(200).json({
      ok: true,
      user: user,
      id: user._id,
      token: token
    });
  });
});

module.exports = app;
