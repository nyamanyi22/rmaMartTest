import { useAuth } from '../context/AuthContext';

const RMAPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-600">You must be logged in to submit an RMA request.</p>
        <a href="/login" className="text-blue-600 underline">Login here</a>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Submit RMA Request</h2>
      {/* Your RMA form here */}
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">RMA Request Form</h2>
      <form className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Product Code</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="e.g., MT-RTR-100" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Product name or details" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Serial Number</label>
            <input type="text" className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Quantity</label>
            <input type="number" className="w-full border rounded px-3 py-2" min="1" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Invoice Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Sales Document No.</label>
            <input type="text" className="w-full border rounded px-3 py-2" required />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Reason for Returning</label>
          <select className="w-full border rounded px-3 py-2" required>
            <option value="">Select a reason</option>
            <option value="defective">Defective Item</option>
            <option value="wrong-item">Wrong Item Shipped</option>
            <option value="damaged">Damaged on Arrival</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Detailed Problem Description</label>
          <textarea className="w-full border rounded px-3 py-2" rows="4" placeholder="Explain the issue clearly..." required></textarea>
        </div>

        {/* Optional: File Upload */}
        <div>
          <label className="block mb-1 font-semibold">Upload Photo (optional)</label>
          <input type="file" className="w-full border rounded px-3 py-2" accept="image/*" />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Submit RMA Request
        </button>
      </form>
    </div>

    </div>
  );
};
export default RMAPage;