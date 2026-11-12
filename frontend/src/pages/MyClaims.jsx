
import React, { useState } from 'react';

const STORAGE_KEY = 'insureproClaims';

function MyClaims() {
  const customer = JSON.parse(
    localStorage.getItem('insureproCustomer') || 'null'
  );

  const [claims, setClaims] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return saved.filter(
        (claim) => String(claim.customerId) === String(customer?.customerId ?? customer?.id)
      );
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    policyNumber: '',
    claimType: 'Medical Expense',
    amount: '',
    description: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitClaim = (e) => {
    e.preventDefault();
    setMessage('');

    const customerId = customer?.customerId ?? customer?.id;

    if (!customerId) {
      setMessage('Please login again before submitting a claim.');
      return;
    }

    const newClaim = {
      id: `CLM-${Date.now()}`,
      customerId,
      policyNumber: form.policyNumber.trim(),
      claimType: form.claimType,
      amount: Number(form.amount),
      description: form.description.trim(),
      status: 'Submitted',
      submittedDate: new Date().toISOString().slice(0, 10)
    };

    try {
      const allClaims = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );

      allClaims.push(newClaim);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allClaims));

      setClaims((previous) => [newClaim, ...previous]);
      setForm({
        policyNumber: '',
        claimType: 'Medical Expense',
        amount: '',
        description: ''
      });
      setMessage(`Demo claim submitted. Reference: ${newClaim.id}`);
    } catch {
      setMessage('Unable to save the demo claim in this browser.');
    }
  };

  return (
    <div style={styles.page}>
      <h1>My Claims</h1>
      <p style={styles.subtitle}>
        Submit and review your insurance claim records.
      </p>

      <div style={styles.grid}>
        <form onSubmit={submitClaim} style={styles.card}>
          <h2>Submit a New Claim</h2>

          <label style={styles.label}>Policy Number</label>
          <input
            name="policyNumber"
            value={form.policyNumber}
            onChange={handleChange}
            placeholder="Enter your policy number"
            style={styles.input}
            required
          />

          <label style={styles.label}>Claim Type</label>
          <select
            name="claimType"
            value={form.claimType}
            onChange={handleChange}
            style={styles.input}
          >
            <option>Medical Expense</option>
            <option>Hospitalization</option>
            <option>Vehicle Accident</option>
            <option>Vehicle Damage</option>
            <option>Other</option>
          </select>

          <label style={styles.label}>Claim Amount (₹)</label>
          <input
            name="amount"
            type="number"
            min="1"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter claim amount"
            style={styles.input}
            required
          />

          <label style={styles.label}>Claim Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Explain the reason for your claim"
            style={{ ...styles.input, minHeight: '110px' }}
            required
          />

          <button style={styles.button} type="submit">
            Submit Demo Claim
          </button>

          {message && <p style={styles.message}>{message}</p>}
          <p style={styles.note}>
            Demo only: claims are stored in this browser and are not submitted
            to an insurance company.
          </p>
        </form>

        <div style={styles.card}>
          <h2>Claim Summary</h2>
          <div style={styles.summary}>
            <span>Total Claims</span>
            <strong>{claims.length}</strong>
          </div>
          <div style={styles.summary}>
            <span>Submitted</span>
            <strong>{claims.filter(c => c.status === 'Submitted').length}</strong>
          </div>
          <div style={styles.summary}>
            <span>Approved</span>
            <strong>{claims.filter(c => c.status === 'Approved').length}</strong>
          </div>
          <div style={styles.summary}>
            <span>Rejected</span>
            <strong>{claims.filter(c => c.status === 'Rejected').length}</strong>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2>Claim History</h2>

        {claims.length === 0 ? (
          <p style={styles.subtitle}>You have not submitted any demo claims yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Claim Reference</th>
                  <th>Policy Number</th>
                  <th>Claim Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td>{claim.id}</td>
                    <td>{claim.policyNumber}</td>
                    <td>{claim.claimType}</td>
                    <td>₹{claim.amount.toLocaleString('en-IN')}</td>
                    <td>{claim.submittedDate}</td>
                    <td><span style={styles.status}>{claim.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
    gap: '22px',
    margin: '25px 0'
  },
  card: {
    background: '#fff',
    padding: '25px',
    borderRadius: '14px',
    marginBottom: '22px',
    boxShadow: '0 4px 18px rgba(0,0,0,.05)'
  },
  label: {
    display: 'block',
    fontWeight: '600',
    margin: '17px 0 8px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d5deea',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '14px',
    marginTop: '20px',
    border: 0,
    borderRadius: '8px',
    background: '#1456a0',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 0',
    borderBottom: '1px solid #edf0f5'
  },
  message: {
    padding: '12px',
    background: '#e9f7ef',
    color: '#187443',
    borderRadius: '8px',
    overflowWrap: 'anywhere'
  },
  note: { color: '#8a6d1d', fontSize: '12px', lineHeight: 1.5 },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    minWidth: '650px'
  },
  status: {
    color: '#187443',
    background: '#e5f7ee',
    borderRadius: '20px',
    padding: '7px 12px',
    fontSize: '12px'
  }
};

export default MyClaims;
