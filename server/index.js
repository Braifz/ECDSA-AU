import express from "express";
import cors from "cors";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02dacc7a19ae90de06259527e2f42ad08d2f7bca73409f3cdae72fea8764fefa3f": 100,
  "030fa5df60bb1e1683bc96bef960ac62cc4de595e9435abcb60c1c93b90abb9db1": 50,
  "032ce306552085d18d714725930b69976e4936142b08ec6f286966abb7c0e8b6da": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
