import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Footer from '../components/Footer';
import Header from '../components/header/index';


const ClientRmaStatus = () => {
  const { user, isAuthenticated } = useAuth();
  const [rmas, setRmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
useEffect(() => {
  if (!isAuthenticated) return;

  const fetchRmas = async () => {
    try {
     const res = await axios.get("/api/my-rma-requests", {
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});

      // Ensure we get an array
      setRmas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load your RMA requests.");
    } finally {
      setLoading(false);
    }
  };

  fetchRmas();
}, [isAuthenticated]);


  if (loading) return <div>Loading your RMA requests...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (rmas.length === 0) return <div>You have no RMA requests yet.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
    <Header userEmail={userEmail} onLogout={handleLogout} />
      <h2 className="text-2xl font-bold mb-6">Your RMA Requests</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">RMA #</th>
            <th className="py-2 px-4 border-b">Product</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {rmas.map((rma) => (
            <tr key={rma.rma_number} className="text-center">
              <td className="py-2 px-4 border-b">{rma.rma_number}</td>
              <td className="py-2 px-4 border-b">{rma.product_code}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 rounded text-white font-bold ${
                    rma.status === "PENDING"
                      ? "bg-yellow-500"
                      : rma.status === "APPROVED"
                      ? "bg-green-500"
                      : rma.status === "COMPLETED"
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  }`}
                >
                  {rma.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(rma.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer/>
    </div>
  );
};

export default ClientRmaStatus;
