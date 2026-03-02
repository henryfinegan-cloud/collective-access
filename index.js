import { collection } from "firebase/firestore";
import { db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [value] = useCollection(collection(db, "products"));
  const [timeLeft, setTimeLeft] = useState({});

  const products = value?.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(p => p.status === "approved") || [];

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = {};
      products.forEach(p => {
        const diff = new Date(p.countdownEnd) - new Date();
        newTimeLeft[p.id] = diff > 0 ? diff : 0;
      });
      setTimeLeft(newTimeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <div>
      <h1>Collective Access</h1>
      <div className="product-grid">
        {products.map(p => {
          const percent = Math.min((p.currentMembers / p.targetMembers) * 100, 100);
          const diff = timeLeft[p.id] || 0;
          const d = Math.floor(diff / (24*3600*1000));
          const h = Math.floor((diff % (24*3600*1000)) / (3600*1000));
          const m = Math.floor((diff % (3600*1000)) / (60*1000));
          const s = Math.floor((diff % (60*1000)) / 1000);

          return (
            <div key={p.id} className="product-card">
              <img src={p.imageUrl} alt={p.name} />
              <h2>{p.name}</h2>
              <p>Retail: ${p.retailPrice}</p>
              <p>Current Price: ${p.currentPrice}</p>
              <p>{p.currentMembers}/{p.targetMembers} members joined</p>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${percent}%` }}></div>
              </div>
              <p>Time left: {d}d {h}h {m}m {s}s</p>
              <button className="btn">Join Collective</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
