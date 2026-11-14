
import React, { useState } from 'react';

const healthPlans = [
  {
    id: 1,
    name: 'Health Basic',
    coverage: '₹5 Lakhs',
    coverageValue: '500000',
    premium: 6500,
    benefits: [
      'Hospitalization coverage',
      'Pre and post hospitalization',
      'Daycare procedures',
      'Ambulance expenses',
      '24/7 customer support'
    ]
  },
  {
    id: 2,
    name: 'Health Plus',
    coverage: '₹10 Lakhs',
    coverageValue: '1000000',
    premium: 9500,
    benefits: [
      'All Basic plan benefits',
      'Higher coverage limits',
      'Additional wellness benefits',
      'Extended hospitalization',
      'Priority customer support'
    ]
  },
  {
    id: 3,
    name: 'Health Premium',
    coverage: '₹25 Lakhs',
    coverageValue: '2500000',
    premium: 14500,
    benefits: [
      'All Plus plan benefits',
      'Premium hospitalization coverage',
      'Enhanced medical benefits',
      'Higher claim limits',
      'Priority assistance'
    ]
  }
];

function HealthInsurance() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [purchasedPolicy, setPurchasedPolicy] = useState(null);

  const choosePlan = (plan) => {
    setMessage('');
    setPurchasedPolicy(null);
    setSelectedPlan(plan);
  };

  // DEMO PAYMENT: No backend or database required.
  const handlePayment = () => {
    if (!selectedPlan || loading) return;

    let customer;

    try {
      customer = JSON.parse(
        localStorage.getItem('insureproCustomer') || 'null'
      );
    } catch {
      customer = null;
    }

    if (!customer) {
      alert('Please login before purchasing a policy.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const now = new Date();
      const expiry = new Date(now);
      expiry.setFullYear(expiry.getFullYear() + 1);

      const policyNumber =
        'INS-' + Date.now().toString().slice(-10);

      const policy = {
        id: policyNumber,
        policyNumber: policyNumber,
        customerId: customer.customerId ?? customer.id ?? null,
        customerName: customer.fullName || '',
        email: customer.email || '',
        planName: selectedPlan.name,
        type: 'Health',
        coverage: selectedPlan.coverage,
        coverageValue: selectedPlan.coverageValue,
        premium: String(selectedPlan.premium),
        status: 'Active',
        paymentMethod: paymentMethod,
        purchaseDate: now.toISOString(),
        startDate: now.toISOString(),
        expiryDate: expiry.toISOString()
      };

      // Save policy in browser storage.
      const existingPolicies = JSON.parse(
        localStorage.getItem('insureproPolicies') || '[]'
      );

      existingPolicies.push(policy);

      localStorage.setItem(
        'insureproPolicies',
        JSON.stringify(existingPolicies)
      );

      // Save demo payment in browser storage.
      const existingPayments = JSON.parse(
        localStorage.getItem('insureproPayments') || '[]'
      );

      const payment = {
        id: 'PAY-' + Date.now(),
        policyNumber: policyNumber,
        planName: selectedPlan.name,
        amount: selectedPlan.premium,
        paymentMethod: paymentMethod,
        status: 'Successful',
        paymentDate: now.toISOString()
      };

      existingPayments.push(payment);

      localStorage.setItem(
        'insureproPayments',
        JSON.stringify(existingPayments)
      );

      setPurchasedPolicy(policy);

      setMessage(
        'Demo payment successful! Your policy has been created.'
      );

    } catch (error) {
      console.error('Demo payment error:', error);

      setMessage(
        'Unable to save your policy. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <header style={styles.header}>
        <h1>Health Insurance Plans</h1>
        <p>
          Choose the right health insurance coverage for your family.
        </p>
      </header>

      <div style={styles.plans}>

        {healthPlans.map((plan) => (

          <div key={plan.id} style={styles.card}>

            <h2>{plan.name}</h2>

            <p style={styles.smallLabel}>SUM INSURED</p>

            <h2 style={styles.coverage}>
              {plan.coverage}
            </h2>

            <h2 style={styles.price}>
              ₹{plan.premium.toLocaleString('en-IN')}
              <span style={styles.perYear}>
                {' '} / year (illustrative)
              </span>
            </h2>

            <hr />

            <h4>Plan Benefits</h4>

            <ul style={styles.benefits}>
              {plan.benefits.map((benefit) => (
                <li key={benefit}>
                  ✓ &nbsp; {benefit}
                </li>
              ))}
            </ul>

            <button
              style={styles.chooseButton}
              onClick={() => choosePlan(plan)}
            >
              Choose This Plan →
            </button>

          </div>

        ))}

      </div>

      {/* DEMO PAYMENT MODAL */}

      {selectedPlan && !purchasedPolicy && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <button
              style={styles.closeButton}
              onClick={() => {
                setSelectedPlan(null);
                setMessage('');
              }}
              disabled={loading}
            >
              ×
            </button>

            <h2>Demo Payment</h2>

            <p>
              Complete your sample payment to generate your policy.
            </p>

            <div style={styles.detail}>
              <span>Selected plan</span>
              <strong>{selectedPlan.name}</strong>
            </div>

            <div style={styles.detail}>
              <span>Coverage</span>
              <strong>{selectedPlan.coverage}</strong>
            </div>

            <div style={styles.detail}>
              <span>Amount to pay</span>
              <strong>
                ₹{selectedPlan.premium.toLocaleString('en-IN')}
              </strong>
            </div>

            <h3>Select Payment Method</h3>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={styles.select}
              disabled={loading}
            >
              <option value="UPI">UPI</option>
              <option value="Credit/Debit Card">
                Credit/Debit Card
              </option>
              <option value="Net Banking">Net Banking</option>
            </select>

            <p style={styles.notice}>
              Demo only: No real payment will be processed.
            </p>

            {message && (
              <p style={styles.error}>
                {message}
              </p>
            )}

            <button
              style={{
                ...styles.payButton,
                opacity: loading ? 0.7 : 1
              }}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : `Pay ₹${selectedPlan.premium.toLocaleString('en-IN')}`
              }
            </button>

            <button
              style={styles.backButton}
              onClick={() => {
                setSelectedPlan(null);
                setMessage('');
              }}
              disabled={loading}
            >
              Back
            </button>

          </div>

        </div>

      )}

      {/* PURCHASE SUCCESS MODAL */}

      {purchasedPolicy && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <h2 style={{ color: '#16834a' }}>
              Purchase Successful!
            </h2>

            <p>{message}</p>

            <div style={styles.detail}>
              <span>Plan</span>
              <strong>{purchasedPolicy.planName}</strong>
            </div>

            <div style={styles.detail}>
              <span>Policy Number</span>
              <strong>{purchasedPolicy.policyNumber}</strong>
            </div>

            <div style={styles.detail}>
              <span>Coverage</span>
              <strong>{purchasedPolicy.coverage}</strong>
            </div>

            <div style={styles.detail}>
              <span>Premium</span>
              <strong>
                ₹{Number(purchasedPolicy.premium).toLocaleString('en-IN')}
              </strong>
            </div>

            <div style={styles.detail}>
              <span>Status</span>
              <strong style={{ color: '#16834a' }}>
                Active
              </strong>
            </div>

            <button
              style={styles.payButton}
              onClick={() => {
                setSelectedPlan(null);
                setPurchasedPolicy(null);
                window.location.href = '/my-policies';
              }}
            >
              View My Policies
            </button>

            <button
              style={styles.backButton}
              onClick={() => {
                setSelectedPlan(null);
                setPurchasedPolicy(null);
              }}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f7fb',
    padding: '35px 5%',
    fontFamily: 'Arial, sans-serif',
    color: '#172b4d'
  },

  header: {
    textAlign: 'center',
    marginBottom: '35px'
  },

  plans: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '25px',
    maxWidth: '1200px',
    margin: 'auto'
  },

  card: {
    background: '#fff',
    borderRadius: '14px',
    padding: '25px',
    boxShadow: '0 4px 18px rgba(0,0,0,0.07)'
  },

  smallLabel: {
    fontSize: '12px',
    color: '#667085',
    marginTop: '25px'
  },

  coverage: {
    fontSize: '27px',
    color: '#101828'
  },

  price: {
    color: '#1456a0',
    marginTop: '20px'
  },

  perYear: {
    fontSize: '11px',
    color: '#667085',
    fontWeight: 'normal'
  },

  benefits: {
    listStyle: 'none',
    padding: 0,
    lineHeight: '2.5'
  },

  chooseButton: {
    width: '100%',
    padding: '14px',
    border: '1px solid #1456a0',
    background: '#fff',
    color: '#1456a0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '15px'
  },

  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    zIndex: 1000
  },

  modal: {
    position: 'relative',
    background: '#fff',
    width: '100%',
    maxWidth: '440px',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '15px',
    padding: '30px',
    boxSizing: 'border-box',
    textAlign: 'center'
  },

  closeButton: {
    position: 'absolute',
    right: '15px',
    top: '10px',
    border: 'none',
    background: 'none',
    fontSize: '25px',
    cursor: 'pointer'
  },

  detail: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '17px 0',
    borderBottom: '1px solid #eee',
    textAlign: 'left'
  },

  select: {
    width: '100%',
    padding: '13px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '15px'
  },

  notice: {
    background: '#fff8df',
    padding: '13px',
    borderRadius: '8px',
    color: '#806000',
    fontSize: '13px'
  },

  payButton: {
    width: '100%',
    padding: '14px',
    background: '#1456a0',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '12px'
  },

  backButton: {
    border: 'none',
    background: 'none',
    padding: '15px',
    cursor: 'pointer'
  },

  error: {
    color: '#b42318',
    background: '#fee4e2',
    padding: '10px',
    borderRadius: '8px'
  }
};

export default HealthInsurance;
