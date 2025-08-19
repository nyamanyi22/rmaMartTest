// src/Admin/pages/rmas/RmaDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";
import { Separator } from "../../Components/ui/ceparator";
import { CheckCircle, XCircle, Clock, RefreshCcw } from "lucide-react";
import axiosAdmin from "../../api/axiosAdmin";

export default function RmaDetailPage() {
  const { id } = useParams();
  const [rma, setRma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRma = async () => {
      try {
        const res = await axiosAdmin.get(`/rmas/${id}`);
        setRma(res.data.rma || res.data);
      } catch (err) {
        console.error("Error fetching RMA:", err);
        setError("Failed to fetch RMA details.");
      } finally {
        setLoading(false);
      }
    };
    fetchRma();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading RMA details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!rma) return <p className="p-6 text-red-500">RMA not found.</p>;

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return "bg-green-600 text-white";
      case "rejected": return "bg-red-600 text-white";
      case "pending": return "bg-yellow-500 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Left column - RMA Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>RMA #{rma.rma_number || rma.id}</span>
              <Badge className={`uppercase ${getStatusClass(rma.status)}`}>
                {rma.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Opened on: {new Date(rma.created_at).toLocaleString()}
            </p>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold">Customer</h3>
                <p>{rma.customer?.first_name} {rma.customer?.last_name}</p>
                <p className="text-gray-500">{rma.customer?.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Product</h3>
                <p>{rma.product?.name}</p>
                <p className="text-gray-500">{rma.product?.code}</p>
              </div>
              <div>
                <h3 className="font-semibold">Reason</h3>
                <p>{rma.return_reason}</p>
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{rma.problem_description || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column - Actions & Timeline */}
      <div className="space-y-6">
      
        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rma.history?.length ? (
              rma.history.map((event, idx) => (
                <div key={idx} className="border-l-2 border-gray-300 pl-3">
                  <p className="text-sm">
                    <span className="font-semibold">{event.status}</span> – {event.user} on{" "}
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                  {event.note && <p className="text-xs text-gray-500">{event.note}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No history available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
