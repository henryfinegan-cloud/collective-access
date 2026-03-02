import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SellerUpload() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, retailPrice, currentPrice, targetMembers, countdownEnd, imageUrl } = e.target;

    await addDoc(collection(db, "products"), {
      name: name.value,
      retailPrice: parseFloat(retailPrice.value),
      currentPrice: parseFloat(currentPrice.value),
      targetMembers: parseInt(targetMembers.value),
      currentMembers: 0,
      countdownEnd: countdownEnd.value,
      imageUrl: imageUrl.value,
      sellerId: auth.currentUser.uid,
      status: "pending",
      createdAt: serverTimestamp()
    });

    setLoading(false);
    alert("Product submitted for approval!");
    e.target.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Product Name" required />
      <input name="retailPrice" type="number" placeholder="Retail Price" required />
      <input name="currentPrice" type="number" placeholder="Starting Price" required />
      <input name="targetMembers" type="number" placeholder="Target Members" required />
      <input name="countdownEnd" type="datetime-local" required />
      <input name="imageUrl" placeholder="Image URL" required />
      <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Product"}</button>
    </form>
  );
}
