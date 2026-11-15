
import React, { useEffect, useState } from 'react';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedPayments = JSON.parse(
        localStorage.getItem('insureproPayments') || '[]'
      );

      const savedPolicies = JSON.parse(
        localStorage.getItem('insureproPolicies') || '[]'
      );

      // Prefer saved payment records.
      // If none exist, use purchased policies as payment history.
      const records = savedPayments.length > 0
        ? savedPayments
        : savedPolicies;

      const normalizedPayments = records.map((item, index) => ({
        ...item,
        id: item.id || index,
        policyNumber: item.policyNumber || '-',
        name: item.planName || item.name || 'Insurance Policy',
        type: item.type || 'Insurance',
        amount: Number(
          String(item.amount ?? item.premium ?? 0).replace(/[^\d.]/g, '')
        ) || 0,
        paymentDate:
          item.paymentDate || item.purchaseDate || item.startDate || '',
        status: item.status || 'Recorded',
        paymentMethod: item.paymentMethod || 'Not available'
      }));

      setPayments(normalizedPayments);
    } catch (error) {
      console.error('Unable to load payment records:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  const formatDate = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '-';

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalPaid = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const activePolicies = payments.filter(
    (payment) => String(payment.status).toLowerCase() === 'active'
  ).length;

  return (
    <div style={styles.page}>
      <h1>Payments</h1>

      <p style={styles.subtitle}>
        View your insurance policy premiums and payment records.
      </p>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <span>Total Records</span>
          <h2>{loading ? '...' : payments.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <span>Total Premium Amount</span>
          <h2>{loading ? '...' : formatMoney(totalPaid)}</h2>
        </div>

        <div style={styles.summaryCard}>
          <span>Active Policies</span>
          <h2>{loading ? '...' : activePolicies}</h2>
        </div>
      </div>

      <div style={styles.card}>
        <h2>Payment History</h2>

        {loading && (
          <p style={styles.subtitle}>Loading payment records...</p>
        )}

        {!loading && payments.length === 0 && (
          <p style={styles.subtitle}>
            No payment records found. Purchase a Health or Vehicle
            Insurance plan to see your records here.
          </p>
        )}

        {!loading && payments.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Policy Number</th>
                  <th>Policy Name</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.policyNumber}</td>
                    <td>{payment.name}</td>
                    <td>{payment.type}</td>
                    <td>{formatMoney(payment.amount)}</td>
                    <td>{payment.paymentMethod}</td>
                    <td>{formatDate(payment.paymentDate)}</td>
                    <td>
                      <span style={styles.status}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={styles.note}>
          These are frontend demo payment records stored in your browser.
          No real payment is processed and no payment gateway is connected.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f7fc',
    padding: '35px',
    fontFamily: 'Arial, sans-serif',
    color: '#17365d'
  },

  subtitle: {
    color: '#718096',
    lineHeight: 1.6
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '20px',
    margin: '25px 0'
  },

  summaryCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '13px',
    boxShadow: '0 4px 18px rgba(0,0,0,.05)'
  },

  card: {
    background: '#fff',
    padding: '25px',
    borderRadius: '14px',
    boxShadow: '0 4px 18px rgba(0,0,0,.05)'
  },

  table: {
    width: '100%',
    minWidth: '900px',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },

  status: {
    background: '#e5f7ee',
    color: '#187443',
    padding: '7px 12px',
    borderRadius: '20px',
    fontSize: '12px'
  },

  note: {
    marginTop: '20px',
    color: '#718096',
    fontSize: '12px',
    lineHeight: 1.6
  }
};

export default Payments;
