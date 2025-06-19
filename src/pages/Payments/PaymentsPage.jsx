import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PaymentsList from "../../components/payments/PaymentsList";
import { API_URL } from "../../config/config";
import Loading from "../../components/elements/Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // <-- Import like this


// Add this modal component in the same file or import from a separate file
// function ReceiptModal({ payment, onClose }) {
//   if (!payment) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
//         <button
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//           onClick={onClose}
//         >
//           ×
//         </button>
//         <h2 className="text-xl font-bold mb-2 text-center">Payment Receipt</h2>
//         <div className="border-b pb-2 mb-2 text-center">
//           <span className="text-xs text-gray-500">Reference:</span>
//           <div className="font-mono text-sm text-blue-700 break-all">{payment.reference || payment.id}</div>
//         </div>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span className="text-gray-600">Amount:</span>
//             <span className="font-semibold text-gray-800">₦{Number(payment.amount).toLocaleString()}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Status:</span>
//             <span className={`font-semibold ${payment.status === "success" ? "text-green-600" : "text-yellow-600"}`}>
//               {payment.status}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Date:</span>
//             <span>{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Email:</span>
//             <span>{payment.email || "N/A"}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Type:</span>
//             <span>{payment.type || "Payment"}</span>
//           </div>
//           {/* description */}
//           <div className="flex justify-between">
//             <span className="text-gray-600">Description:</span>
//             <span>{payment.purpose || "N/A"}</span>
//           </div>
//         </div>
//         <div className="mt-6 text-center">
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={onClose}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptPayment, setReceiptPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${API_URL}/payment/transactions`);
        const data = await response.json();
        setPayments(data.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleConfirm = async (id) => {
    try {
      const response = await fetch(`${API_URL}/payment/transactions/${id}/confirm`, {
        method: 'POST'
      });
      const updatedPayment = await response.json();
      setPayments(payments.map(payment => 
        payment.id === id ? updatedPayment : payment
      ));
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  const handleReinitiate = async (id) => {
    try {
      const response = await fetch(`${API_URL}/payment/transactions/${id}/reinitiate`, {
        method: 'POST'
      });
      const updatedPayment = await response.json();
      setPayments(payments.map(payment => 
        payment.id === id ? updatedPayment : payment
      ));
    } catch (error) {
      console.error('Error reinitiating payment:', error);
    }
  };

  // Show receipt modal with payment details
  const handleDownload = (id) => {
  const payment = payments.find((p) => p.id === id);
  console.log(payment);
  if (!payment) return;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Payment Receipt", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Reference: ${payment.reference || payment.id}`, 14, 35);

  // Use autoTable from the imported variable
  autoTable(doc, {
    startY: 45,
    theme: "grid",
    head: [["Field", "Value"]],
    body: [
      ["Amount", `N${Number(payment.amount / 100).toLocaleString()}`],
      ["Status", payment.status],
      ["Date", payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"],
      ["Email", payment.customer.email || "N/A"],
      ["Type", payment.type || "Payment"],
      ["Description", payment.metadata.purpose || "N/A"],
    ],
    styles: { fontSize: 11 },
    headStyles: { fillColor: [59, 130, 246] }, // blue
  });

  doc.save(`receipt-${payment.reference || payment.id}.pdf`);
};

  if (loading) {
    return <Loading/>;
  }

  return (
    <div>
      <PageMeta
        title="Payments Management | Property Management Platform"
        description="Manage payment records in the property management system"
      />
      <PageBreadcrumb pageTitle="Payments Management" />

      <div>
        <PaymentsList 
          payments={payments} 
          onConfirm={handleConfirm}
          onReinitiate={handleReinitiate}
          onDownload={handleDownload}
        />
      </div>

      {/* Receipt Modal */}
      {receiptPayment && (
        <ReceiptModal
          payment={receiptPayment}
          onClose={() => setReceiptPayment(null)}
        />
      )}
    </div>
  );
}