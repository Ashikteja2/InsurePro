
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Payments() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const savedCustomer = localStorage.getItem('insureproCustomer');

    if (!savedCustomer) {
      navigate('/login');
      return;
    }

    try {
      const currentCustomer = JSON.parse(savedCustomer);
      setCustomer(currentCustomer);

      const customerId = String(
        currentCustomer.customerId ?? currentCustomer.id ?? ''
      );

      const customerEmail = String(
        currentCustomer.email ?? ''
      ).toLowerCase();

      const allPayments = JSON.parse(
        localStorage.getItem('insureproPayments') || '[]'
      );

      const allPolicies = JSON.parse(
        localStorage.getItem('insureproPolicies') || '[]'
      );

      // Keep only payments belonging to this customer.
      const customerPayments = allPayments.filter((payment) => {
        const sameId =
          String(payment.customerId ?? payment.userId ?? '') === customerId;

        const sameEmail =
          String(
            payment.customerEmail ?? payment.email ?? ''
          ).toLowerCase() === customerEmail;

        return sameId || sameEmail;
      });

      // If no separate payment records exist, show this customer's policies.
      const records = customerPayments.length > 0
        ? customerPayments
        : allPolicies
            .filter((policy) => {
              const sameId =
                String(policy.customerId ?? policy.userId ?? '') === customerId;

              const sameEmail =
                String(
                  policy.customerEmail ?? policy.email ?? ''
                ).toLowerCase() === customerEmail;

              return sameId || sameEmail;
            })
            .map((policy) => ({
              ...policy,
              paymentAmount:
                policy.paymentAmount ??
                policy.premium ??
                policy.premiumAmount ??
                policy.amount ??
                0,
              paymentStatus:
                policy.paymentStatus || 'Recorded'
            }));

      setPayments(records);
    } catch (error) {
      console.error('Payments loading error:', error);
      setPayments([]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('insureproCustomer');
    localStorage.removeItem('insurepro_logged_in');
    sessionStorage.removeItem('customer');
    navigate('/login');
  };

  if (!customer) {
    return <p style={{ padding: '30px' }}>Loading payments...</p>;
  }

  const totalPaid = payments.reduce(
    (total, payment) =>
      total + Number(
        payment.paymentAmount ??
        payment.premium ??
        payment.premiumAmount ??
        payment.amount ??
        0
      ),
    0
  );

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f3f6fc',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      color: '#17365d'
    },
    container: {
      maxWidth: '1100px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '25px'
    },
    button: {
      padding: '11px 18px',
      border: 'none',
      borderRadius: '8px',
      background: '#1456a0',
      color: 'white',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      marginRight: '10px'
    },
    card: {
      background: 'white',
      padding: '25px',
      borderRadius: '14px',
      marginBottom: '25px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.04)'
    },
    amount: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#1456a0',
      margin: '12px 0'
    },
    tableWrapper: {
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '600px'
    },
    cell: {
      padding: '15px',
      textAlign: 'left',
      borderBottom: '1px solid #eeeeee'
    },
    status: {
      display: 'inline-block',
      background: '#e6f8ed',
      color: '#168348',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <h1>Payment History</h1>
            <p style={{ color: '#8493a8' }}>
              Welcome, {customer.fullName || customer.name || 'Customer'}
            </p>
          </div>

          <div>
            <Link to="/dashboard" style={styles.button}>
              Back to Dashboard
            </Link>

            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </div>
        </div>

        <section style={styles.card}>
          <h3>Total Recorded Payments</h3>

          <div style={styles.amount}>
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>

          <p style={{ color: '#8493a8' }}>
            Payments and premiums recorded for your account
          </p>
        </section>

        <section style={styles.card}>
          <h2>Payment Records</h2>

          {payments.length === 0 ? (
            <p>No payment records found for your account.</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.cell}>Payment / Policy ID</th>
                    <th style={styles.cell}>Policy Type</th>
                    <th style={styles.cell}>Amount</th>
                    <th style={styles.cell}>Date</th>
                    <th style={styles.cell}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment, index) => {
                    const amount =
                      payment.paymentAmount ??
                      payment.premium ??
                      payment.premiumAmount ??
                      payment.amount ??
                      0;

                    const paymentDate =
                      payment.paymentDate ||
                      payment.createdAt ||
                      payment.purchaseDate ||
                      payment.date;

                    return (
                      <tr key={payment.id || payment.policyNumber || index}>
                        <td style={styles.cell}>
                          {payment.paymentId ||
                            payment.policyNumber ||
                            payment.id ||
                            'N/A'}
                        </td>

                        <td style={styles.cell}>
                          {payment.policyType ||
                            payment.type ||
                            'Insurance'}
                        </td>

                        <td style={styles.cell}>
                          ₹{Number(amount).toLocaleString('en-IN')}
                        </td>

                        <td style={styles.cell}>
                          {paymentDate
                            ? new Date(paymentDate).toLocaleDateString('en-IN')
                            : 'Not available'}
                        </td>

                        <td style={styles.cell}>
                          <span style={styles.status}>
                            {payment.paymentStatus ||
                              payment.status ||
                              'Recorded'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p style={{
            marginTop: '20px',
            color: '#8493a8',
            fontSize: '13px'
          }}>
            Demo application: no real payment is collected or processed.
          </p>
        </section>

      </div>
    </div>
  );
}

export default Payments;
