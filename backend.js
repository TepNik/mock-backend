const express = require("express");
const bodyParser = require("body-parser");
const keccak256 = require("keccak256");

const backendConfig = {
  deployAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  INIT_CODE_HASH:
    "0x5d24d95e5404b98a66dd49e4081a87c0542c9120a8fd9d7109f6577cc509e40c",
  priceConfig: Array.from({ length: 40 }, (v, i) => {
    if (i < 7) {
      return "0x0";
    } else {
      return "0x" + "1" + "0".repeat(i - 7);
    }
  }),
  maxNoncesPerRequest: 100,
};

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/v1/nonce-manager/config", (req, res) => {
  res.status(200).send(backendConfig);
});

app.post("/v1/nonce-manager/nonces", (req, res) => {
  const data = req.body;

  const formattedNonceGeneratorId = padHexValue(data.nonceGeneratorId);

  const answers = data.nonces.map((nonce) =>
    getAnswerForNonce(formattedNonceGeneratorId, nonce)
  );

  console.log("Received nonces, body:", data);
  console.log("Calculated answers:", answers);
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`Started backend on port ${port}`);
});

function padHexValue(hexValue) {
  const valueWithout0x = hexValue.replace("0x", "");

  return "0".repeat(64 - valueWithout0x.length) + valueWithout0x;
}

function getAnswerForNonce(formattedNonceGeneratorId, nonce) {
  const formattedNonce = padHexValue(nonce);

  const salt = keccak256(
    "0x" + formattedNonceGeneratorId + formattedNonce
  ).toString("hex");

  const answer =
    "0x" +
    keccak256(
      "0xff" +
        backendConfig.deployAddress.replace("0x", "") +
        salt +
        backendConfig.INIT_CODE_HASH.replace("0x", "")
    )
      .toString("hex")
      .substring(24);

  return {
    nonce,
    salt,
    answer,
  };
}
