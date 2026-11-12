
import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8082';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const customer = JSON.parse(
          localStorage.getItem('insureproCustomer') || 'null'
        );

        const customerId = customer?.customerId ?? customer?.id;

        if (!customerId) {
          setError('Please login to view your payments.');
          return;
        }

        const response = await fetch(
          `${API_URL}/api/policies/customer/${customerId}`
        );

        if (!response.ok) {
          throw new Error('Unable to retrieve your policies.');
        }

        const data = await response.json();

        const records = Array.isArray(data) ? data : [];

        setPayments(records.map((policy) => ({
          ...policy,
          amount: Number(String(policy.premium).replace(/[^\d.]/g, '')) || 0
        })));
      } catch (err) {
        setError(err.message || 'Unable to connect to the backend.');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const formatMoney = (amount) =>
    `₹${Number(amount).toLocaleString('en-IN')}`;

  const totalPaid = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  return (
    <div style={styles.page}>
      <h1>Payments</h1>
      <p style={styles.subtitle}>
        View your insurance policy premiums and payment records.
      </p>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <span>Total Policies</span>
          <h2>{payments.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <span>Total Premium Amount</span>
          <h2>{formatMoney(totalPaid)}</h2>
        </div>

        <div style={styles.summaryCard}>
          <span>Active Policies</span>
          <h2>
            {payments.filter(
              (p) => String(p.status).toLowerCase() === 'active'
            ).length}
          </h2>
        </div>
      </div>

      <div style={styles.card}>
        <h2>Payment History</h2>

        {loading && <p style={styles.subtitle}>Loading payment records...</p>}

        {!loading && error && (
          <p style={styles.error}>{error}</p>
        )}

        {!loading && !error && payments.length === 0 && (
          <p style={styles.subtitle}>
            No purchased policies were found for this account.
          </p>
        )}

        {!loading && !error && payments.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Policy Number</th>
                  <th>Policy Name</th>
                  <th>Type</th>
                  <th>Premium</th>
                  <th>Purchase Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id || payment.policyNumber}>
                    <td>{payment.policyNumber || '-'}</td>
                    <td>{payment.name || '-'}</td>
                    <td>{payment.type || '-'}</td>
                    <td>{formatMoney(payment.amount)}</td>
                    <td>{payment.startDate || '-'}</td>
                    <td>
                      <span style={styles.status}>
                        {payment.status || 'Recorded'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={styles.note}>
          Payment records are based on saved policies. Your current backend
          does not yet store separate payment transactions or payment gateway
          confirmations. No real payment is processed here.
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
  subtitle: { color: '#718096', lineHeight: 1.6 },
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
    minWidth: '750px',
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
  error: {
    background: '#fee4e2',
    color: '#b42318',
    padding: '12px',
    borderRadius: '8px'
  },
  note: {
    marginTop: '20px',
    color: '#718096',
    fontSize: '12px',
    lineHeight: 1.6
  }
};

export default Payments;
