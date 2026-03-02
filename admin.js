import { useCollection } from "react-firebase-hooks/firestore";
import { collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function Admin() {
  const [value] = useCollection(collection(db, "products"));
  const pendingProducts = value?.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(p => p.status === "pending") || [];

  const approve = async (id) => {
    await updateDoc(doc(db, "products", id), { status: "approved" });
    alert("Product approved!");
  }
  const reject = async (id) => {
    await updateDoc(doc(db, "products", id), { status: "rejected" });
    alert("Product rejected!");
  }

  return (
    <div>
      <h1>Pending Products</h1>
      {pendingProducts.map(p => (
        <div key={p.id}>
          <p>{p.name}</p>
          <button onClick={() => approve(p.id)}>Approve</button>
          <button onClick={() => reject(p.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}
