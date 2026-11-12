
import React, { useState } from 'react';

function PremiumCalculator() {

  const [insuranceType, setInsuranceType] = useState('Health');
  const [age, setAge] = useState('30');
  const [coverage, setCoverage] = useState('500000');
  const [duration, setDuration] = useState('1');
  const [quote, setQuote] = useState(null);

  const calculatePremium = (e) => {
    e.preventDefault();

    const customerAge = Number(age);
    const cover = Number(coverage);
    const years = Number(duration);

    if (!customerAge || customerAge < 18 || customerAge > 100) {
      alert('Please enter an age between 18 and 100.');
      return;
    }

    let rate;

    if (insuranceType === 'Health') {
      rate =
        customerAge <= 30 ? 0.013 :
        customerAge <= 45 ? 0.018 :
        customerAge <= 60 ? 0.027 : 0.04;
    } else if (insuranceType === 'Car') {
      rate = 0.025;
    } else {
      rate = 0.018;
    }

    const estimatedPremium = Math.round(cover * rate * years);

    setQuote({
      type: insuranceType,
      age: customerAge,
      coverage: cover,
      years: years,
      premium: estimatedPremium
    });
  };

  const formatMoney = (amount) =>
    `₹${Number(amount).toLocaleString('en-IN')}`;

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1>Premium Calculator</h1>
        <p>
          Calculate an illustrative insurance premium based on your requirements.
        </p>
      </div>

      <div style={styles.layout}>

        {/* Calculator Form */}

        <form onSubmit={calculatePremium} style={styles.card}>

          <h2>Enter Insurance Details</h2>

          <label style={styles.label} htmlFor="insuranceType">
            Insurance Type
          </label>

          <select
            id="insuranceType"
            value={insuranceType}
            onChange={(e) => {
              const selectedType = e.target.value;

              setInsuranceType(selectedType);
              setQuote(null);

              if (selectedType === 'Health') {
                setCoverage('500000');
              } else if (selectedType === 'Car') {
                setCoverage('300000');
              } else {
                setCoverage('100000');
              }
            }}
            style={styles.input}
          >
            <option value="Health">Health Insurance</option>
            <option value="Car">Car Insurance</option>
            <option value="Bike">Bike Insurance</option>
          </select>

          <label style={styles.label} htmlFor="age">
            Your Age
          </label>

          <input
            id="age"
            type="number"
            min="18"
            max="100"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              setQuote(null);
            }}
            style={styles.input}
            required
          />

          <label style={styles.label} htmlFor="coverage">
            Coverage Amount
          </label>

          <select
            id="coverage"
            value={coverage}
            onChange={(e) => {
              setCoverage(e.target.value);
              setQuote(null);
            }}
            style={styles.input}
          >
            {insuranceType === 'Health' ? (
              <>
                <option value="500000">₹5 Lakhs</option>
                <option value="1000000">₹10 Lakhs</option>
                <option value="2500000">₹25 Lakhs</option>
              </>
            ) : insuranceType === 'Car' ? (
              <>
                <option value="300000">₹3 Lakhs</option>
                <option value="500000">₹5 Lakhs</option>
                <option value="1000000">₹10 Lakhs</option>
              </>
            ) : (
              <>
                <option value="100000">₹1 Lakh</option>
                <option value="200000">₹2 Lakhs</option>
                <option value="300000">₹3 Lakhs</option>
              </>
            )}
          </select>

          <label style={styles.label} htmlFor="duration">
            Policy Duration
          </label>

          <select
            id="duration"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              setQuote(null);
            }}
            style={styles.input}
          >
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
          </select>

          <button type="submit" style={styles.button}>
            Calculate Premium
          </button>

        </form>

        {/* Premium Result */}

        <div style={styles.resultCard}>

          <div style={styles.resultIcon}>₹</div>

          <h2>Your Premium Estimate</h2>

          {quote ? (
            <>
              <p style={styles.muted}>Estimated premium</p>

              <h1 style={styles.amount}>
                {formatMoney(quote.premium)}
              </h1>

              <div style={styles.resultRow}>
                <span>Insurance</span>
                <strong>{quote.type}</strong>
              </div>

              <div style={styles.resultRow}>
                <span>Age</span>
                <strong>{quote.age} years</strong>
              </div>

              <div style={styles.resultRow}>
                <span>Coverage</span>
                <strong>{formatMoney(quote.coverage)}</strong>
              </div>

              <div style={styles.resultRow}>
                <span>Duration</span>
                <strong>{quote.years} year(s)</strong>
              </div>

              <p style={styles.notice}>
                This is an illustrative estimate, not an insurer's final quotation.
              </p>
            </>
          ) : (
            <p style={styles.muted}>
              Enter your details and select Calculate Premium to see your estimate.
            </p>
          )}

        </div>

      </div>
    </div>
  );
}

const styles = {

  page: {
    minHeight: '100vh',
    background: '#f4f7fc',
    padding: '35px',
    color: '#17365d',
    fontFamily: 'Arial, sans-serif'
  },

  header: {
    marginBottom: '30px'
  },

  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    maxWidth: '1100px'
  },

  card: {
    background: '#fff',
    padding: '28px',
    borderRadius: '14px',
    boxShadow: '0 4px 18px rgba(0,0,0,.06)'
  },

  label: {
    display: 'block',
    fontWeight: '600',
    margin: '20px 0 8px'
  },

  input: {
    width: '100%',
    padding: '13px',
    border: '1px solid #d5deea',
    borderRadius: '8px',
    boxSizing: 'border-box',
    background: '#fff',
    fontSize: '15px'
  },

  button: {
    width: '100%',
    marginTop: '25px',
    padding: '14px',
    background: '#1456a0',
    color: '#fff',
    border: 0,
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  resultCard: {
    background: '#fff',
    padding: '30px',
    borderRadius: '14px',
    boxShadow: '0 4px 18px rgba(0,0,0,.06)'
  },

  resultIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#e9f1ff',
    color: '#1456a0',
    display: 'grid',
    placeItems: 'center',
    fontSize: '26px',
    fontWeight: 'bold'
  },

  amount: {
    color: '#1456a0',
    fontSize: '34px'
  },

  muted: {
    color: '#718096',
    lineHeight: 1.7
  },

  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '15px 0',
    borderBottom: '1px solid #edf0f5'
  },

  notice: {
    marginTop: '22px',
    padding: '13px',
    background: '#fff8e5',
    color: '#805d00',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: 1.5
  }
};

export default PremiumCalculator;
