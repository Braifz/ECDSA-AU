import { useState } from "react";

// secp256k1 elliptic curve operations
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
// hashes
import { keccak256 } from "ethereum-cryptography/keccak.js"
//utilities
import { utf8ToBytes } from "ethereum-cryptography/utils.js";

import server from "./server";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const data = { sender: address, recipient, amount: parseInt(sendAmount) };
    console.log('data', data)
    const bytes = utf8ToBytes(JSON.stringify(data));
    console.log('bytes', bytes)
    const hash = keccak256(bytes);
    console.log('hash', hash)

    const signature = secp256k1.sign(hash, privateKey, { recovered: true });
    console.log(signature[0])


    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        ...data, signature: sig, recovery: signature[1]
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
