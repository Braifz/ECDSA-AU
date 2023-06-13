import express from "express";
import cors from "cors";
import {keccak256} from "ethereum-cryptography/keccak"
import {toHex,utf8ToBytes} from "ethereum-cryptography/utils"

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "4a57b3f8eca4d1bab619fefef290dbeaaf967742d50cd4b3722510bce86a7109": 100,
  "96a4c90dd85533134620636097e59c0dd760fdd6bf1716960d484758bdd1bf0d": 50,
  "06ca58c36a35276fa83130214aec954872d38834c017f7949db33390019394a6": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount,signature,recovery } = req.body;


  if(!signature) res.status(404).send({message:"signature dont was provide"});
  if(!recovery) res.status(400).send({message:"recovery dont was provide"});


  try {
    const bytes = utf8ToBytes(JSON.stringify({sender, recipient, amount}))
    const hash = keccak256(bytes)

    const sig = new Uint8Array(signature)

    const publicKey = await secp.recoverPublicKey(hash,sig,recovery)

    if(toHex(publicKey) !== sender){
      res.status(400).send({message: "signature no is valid"})
    }

    setInitialBalance(sender);
    setInitialBalance(recipient);
    
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (e) {
    console.log(e.message)
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
