const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const authConfig = require("./src/auth_config.json");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");

const app = express();

dotenv.config();
const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;
const XRapidAPIKey = process.env.XRAPIKEY;
const XRapidAPIHost = process.env.XRAPIHOST;

try {
  mongoose.connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Could not connect to MongoDB");
}

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});

app.get("/api/codeViewId", checkJwt, (req, res) => {
  res.send({
    id: "examples",
  });
});

app.post("/api/execute", checkJwt, (req, res) => {
  const value = Buffer.from(req.body.code, "utf-8");
  const valueB64 = value.toString("base64");
  const inputOptions = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/",
    params: { base64_encoded: "true", fields: "*", wait: "true" },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": XRapidAPIKey,
      "X-RapidAPI-Host": XRapidAPIHost,
    },
    data: `{"language_id":63,"source_code":"${valueB64}","stdin":""}`,
  };
  axios
    .request(inputOptions)
    .then(function (response) {
      const results = response.data;
      console.log(results.token);
      const outputOptions = {
        method: "GET",
        url: `https://judge0-ce.p.rapidapi.com/submissions/${results.token}`,
        params: { base64_encoded: "true", fields: "*" },
        headers: {
          "X-RapidAPI-Key": XRapidAPIKey,
          "X-RapidAPI-Host": XRapidAPIHost,
        },
      };
      axios
        .request(outputOptions)
        .then(function (response) {
          const resultsB64 = Buffer.from(response.data.stdout, "base64");
          const results = resultsB64.toString("utf-8");
          res.send({ results });
        })
        .catch(function (error) {
          console.error(error);
        });
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
