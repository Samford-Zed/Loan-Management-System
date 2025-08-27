import React, { useEffect, useState } from "react";
import { CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import {
  fetchPendingForAdmin,
  approveApplication,
  rejectApplication,
} from "../../api/adminLoanApi";

type PendingRow = Awaited<ReturnType<typeof fetchPendingForAdmin>>[number];

const fmtMoney = (n: number) => `$${(n || 0).toLocaleString()}`;

const AdminApplications: React.FC = () => {
  const [rows, setRows] = useState<PendingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [busyKind, setBusyKind] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<{
    type: "ok" | "warn";
    msg: string;
  } | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPendingForAdmin();
      setRows(data);
    } catch (e: any) {
      setError(e?.response?.data || "Failed to load pending applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onApprove = async (id: number) => {
    setBusyId(id);
    setBusyKind("approve");
    setFlash(null);
    try {
      const message = await approveApplication(id);
      const isRejectMsg =
        /reject/i.test(message) || /cannot approve/i.test(message);
      setFlash({ type: isRejectMsg ? "warn" : "ok", msg: message });
      await load();
    } catch (e: any) {
      setError(e?.response?.data || "Approve failed.");
    } finally {
      setBusyId(null);
      setBusyKind(null);
    }
  };

  const onReject = async (id: number) => {
    if (!confirm("Reject this application?")) return;
    setBusyId(id);
    setBusyKind("reject");
    setFlash(null);
    try {
      const message = await rejectApplication(id);
      setFlash({ type: "warn", msg: message || "Application rejected." });
      await load();
    } catch (e: any) {
      setError(e?.response?.data || "Reject failed.");
    } finally {
      setBusyId(null);
      setBusyKind(null);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Applications</h1>
          <p className='text-gray-600 mt-1'>
            Review BMS snapshot and finalize each application.
          </p>
        </div>

        {flash && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 flex items-center gap-2 ${
              flash.type === "ok"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-yellow-50 text-yellow-800 border border-yellow-200"
            }`}
          >
            {flash.type === "ok" ? (
              <CheckCircle className='h-5 w-5' />
            ) : (
              <AlertTriangle className='h-5 w-5' />
            )}
            <span className='text-sm'>{flash.msg}</span>
          </div>
        )}

        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Pending Review
            </h2>
            <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium'>
              {rows.length} Pending
            </span>
          </div>

          {loading ? (
            <div className='p-12 text-center text-gray-600'>Loading…</div>
          ) : error ? (
            <div className='p-12 text-center text-red-600'>{error}</div>
          ) : rows.length === 0 ? (
            <div className='p-12 text-center'>
              <CreditCard className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No pending applications
              </h3>
              <p className='text-gray-600'>
                Everything’s up to date. New items will appear here as customers
                apply.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Purpose
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      BMS Paid
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      BMS Remaining
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      BMS Total
                    </th>

                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className='bg-white divide-y divide-gray-200'>
                  {rows.map((r) => (
                    <tr key={r.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {r.purpose}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900'>
                        {fmtMoney(r.amount)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {fmtMoney(r.bmsPaid)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {fmtMoney(r.bmsRemaining)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {fmtMoney(r.bmsTotal)}
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                        <button
                          onClick={() => onApprove(r.id)}
                          disabled={busyId === r.id}
                          className='bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition-colors disabled:opacity-60'
                        >
                          {busyId === r.id && busyKind === "approve"
                            ? "Working…"
                            : "Approve & Disburse"}
                        </button>

                        <button
                          onClick={() => onReject(r.id)}
                          disabled={busyId === r.id}
                          className='bg-red-600 text-white px-3 py-1.5 rounded text-xs hover:bg-red-700 transition-colors disabled:opacity-60'
                          title='Reject application'
                        >
                          {busyId === r.id && busyKind === "reject"
                            ? "Rejecting…"
                            : "Reject"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;
