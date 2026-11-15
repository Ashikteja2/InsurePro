
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MyPolicies() {
  const navigate = useNavigate();

  const [policies, setPolicies] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedCustomer = JSON.parse(
        localStorage.getItem('insureproCustomer') || 'null'
      );

      if (!savedCustomer) {
        navigate('/login');
        return;
      }

      const customerId = String(
        savedCustomer.customerId ?? savedCustomer.id ?? ''
      );

      if (!customerId) {
        navigate('/login');
        return;
      }

      setCustomer(savedCustomer);

      const allPolicies = JSON.parse(
        localStorage.getItem('insureproPolicies') || '[]'
      );

      // Only show policies belonging to the logged-in customer.
      const customerPolicies = allPolicies.filter(
        (policy) =>
          String(policy.customerId ?? '') === customerId
      );

      setPolicies(customerPolicies);

    } catch (error) {
      console.error('Unable to load policies:', error);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const parseAmount = (value) => {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }

    const text = String(value ?? '')
      .toLowerCase()
      .replace(/₹/g, '')
      .replace(/,/g, '')
      .trim();

    const amount = parseFloat(text);

    if (!Number.isFinite(amount)) return 0;

    if (text.includes('crore')) return amount * 10000000;
    if (text.includes('lakh')) return amount * 100000;

    return amount;
  };

  const formatCurrency = (value) =>
    parseAmount(value).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });

  const formatDate = (value) => {
    if (!value) return 'Not available';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'Not available';
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const activePolicies = policies.filter(
    (policy) =>
      String(policy.status || '').toLowerCase() === 'active'
  );

  const totalCoverage = policies.reduce(
    (total, policy) => total + parseAmount(
      policy.coverageValue || policy.coverage
    ),
    0
  );

  const totalPremium = policies.reduce(
    (total, policy) => total + parseAmount(policy.premium),
    0
  );

  const viewPolicyDetails = (policy) => {
    window.alert(
      'Policy Number: ' + policy.policyNumber +
      '\nPolicy Name: ' + (policy.name || policy.planName) +
      '\nType: ' + policy.type +
      '\nStart Date: ' + formatDate(policy.startDate) +
      '\nExpiry Date: ' + formatDate(policy.expiryDate) +
      '\nCoverage: ' + formatCurrency(policy.coverageValue || policy.coverage) +
      '\nPremium: ' + formatCurrency(policy.premium)
    );
  };

  return (
    <div className="policies-page">
      <style>{`
        * { box-sizing: border-box; }

        .policies-page {
          min-height: 100vh;
          display: flex;
          background: #f4f7fc;
          color: #102b50;
          font-family: Arial, sans-serif;
        }

        .policies-sidebar {
          width: 250px;
          background: white;
          border-right: 1px solid #e4eaf3;
          padding: 30px 20px;
          flex-shrink: 0;
        }

        .policies-logo {
          font-size: 25px;
          font-weight: 800;
          color: #17447e;
          margin-bottom: 55px;
        }

        .policies-logo span { color: #2875ef; }

        .policies-menu-title {
          font-size: 12px;
          letter-spacing: 2px;
          color: #9aa9bf;
          font-weight: bold;
          margin: 30px 0 18px;
        }

        .policies-nav a {
          display: block;
          padding: 15px;
          margin-bottom: 9px;
          text-decoration: none;
          color: #607795;
          border-radius: 12px;
          font-size: 15px;
        }

        .policies-nav a:hover,
        .policies-nav a.active {
          background: #eaf1ff;
          color: #2168ef;
          font-weight: bold;
        }

        .policies-main { flex: 1; min-width: 0; }

        .policies-header {
          background: white;
          padding: 25px 35px;
          border-bottom: 1px solid #e4eaf3;
          text-align: center;
        }

        .policies-header small {
          color: #2672ef;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .policies-header h2 {
          margin: 12px 0 0;
          font-size: 24px;
        }

        .policies-content {
          padding: 35px;
          max-width: 1250px;
          margin: auto;
        }

        .policies-welcome {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .policies-welcome h1 {
          font-size: 30px;
          margin: 0 0 10px;
        }

        .policies-welcome p { color: #8192aa; }

        .policy-count {
          background: #246ff0;
          color: white;
          padding: 14px 22px;
          border-radius: 10px;
          font-weight: bold;
        }

        .policies-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: white;
          border: 1px solid #e6edf6;
          border-radius: 15px;
          padding: 25px;
          text-align: center;
        }

        .summary-card p { color: #8495ac; }
        .summary-card h2 { margin: 0; font-size: 26px; }

        .policy-section {
          background: white;
          padding: 25px;
          border-radius: 16px;
          border: 1px solid #e6edf6;
        }

        .policy-section h2 {
          margin-top: 0;
          margin-bottom: 25px;
          text-align: center;
        }

        .policy-card {
          border: 1px solid #e5ebf4;
          border-radius: 14px;
          padding: 25px;
          margin-bottom: 20px;
        }

        .policy-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .policy-name {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .policy-icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          background: #edf3ff;
          border-radius: 12px;
          font-size: 25px;
        }

        .policy-name h3 { margin: 0 0 7px; }

        .policy-name p {
          margin: 0;
          color: #8293aa;
          font-size: 13px;
        }

        .active-status {
          color: #009d65;
          background: #e6f8ef;
          padding: 10px 18px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 13px;
        }

        .inactive-status {
          color: #b45309;
          background: #fff3df;
          padding: 10px 18px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 13px;
        }

        .policy-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          border-top: 1px solid #edf0f5;
          margin-top: 25px;
          padding-top: 20px;
        }

        .policy-details p {
          color: #8797ae;
          font-size: 13px;
        }

        .policy-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        .policy-actions button {
          padding: 11px 18px;
          border: 1px solid #dbe5f3;
          background: white;
          color: #246ff0;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .message {
          padding: 25px;
          text-align: center;
          background: white;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        @media(max-width: 850px) {
          .policies-sidebar { width: 190px; }
          .policies-summary { grid-template-columns: 1fr; }
          .policies-content { padding: 20px; }
        }

        @media(max-width: 600px) {
          .policies-page { display: block; }
          .policies-sidebar { width: 100%; }
          .policies-nav { display: flex; flex-wrap: wrap; }
          .policies-nav a { padding: 10px; }
          .policy-details { grid-template-columns: 1fr; }
          .policies-welcome {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <aside className="policies-sidebar">
        <div className="policies-logo">
          🛡 Insure<span>Pro</span>
        </div>

        <div className="policies-menu-title">MAIN MENU</div>

        <nav className="policies-nav">
          <Link to="/dashboard">▦ Dashboard</Link>
          <Link to="/my-policies" className="active">▤ My Policies</Link>
          <Link to="/health-insurance">♡ Health Insurance</Link>
          <Link to="/vehicle-insurance">🚗 Vehicle Insurance</Link>
          <Link to="/premium-calculator">▦ Premium Calculator</Link>
          <Link to="/my-claims">▤ My Claims</Link>
          <Link to="/payments">▣ Payments</Link>
          <Link to="/profile">♙ My Profile</Link>
        </nav>
      </aside>

      <main className="policies-main">
        <header className="policies-header">
          <small>CUSTOMER PORTAL</small>
          <h2>My Insurance Policies</h2>
        </header>

        <div className="policies-content">
          <div className="policies-welcome">
            <div>
              <h1>My Policies 📋</h1>
              <p>
                Welcome {customer?.fullName || customer?.name || 'Customer'}.
                View your insurance policies here.
              </p>
            </div>

            <div className="policy-count">
              {activePolicies.length} Active Policies
            </div>
          </div>

          {loading ? (
            <div className="message">Loading your policies...</div>
          ) : (
            <>
              <div className="policies-summary">
                <div className="summary-card">
                  <p>Total Policies</p>
                  <h2>{policies.length}</h2>
                </div>

                <div className="summary-card">
                  <p>Active Policies</p>
                  <h2>{activePolicies.length}</h2>
                </div>

                <div className="summary-card">
                  <p>Total Coverage</p>
                  <h2>{formatCurrency(totalCoverage)}</h2>
                </div>
              </div>

              <section className="policy-section">
                <h2>All Insurance Policies</h2>

                {policies.length === 0 ? (
                  <div className="message">
                    You don't have any insurance policies yet.
                  </div>
                ) : (
                  policies.map((policy) => (
                    <div
                      className="policy-card"
                      key={policy.id || policy.policyNumber}
                    >
                      <div className="policy-top">
                        <div className="policy-name">
                          <div className="policy-icon">
                            {String(policy.type || '').toLowerCase() === 'health'
                              ? '❤️'
                              : '🚗'}
                          </div>

                          <div>
                            <h3>
                              {policy.name || policy.planName || 'Insurance Policy'}
                            </h3>
                            <p>Policy Number: {policy.policyNumber}</p>
                          </div>
                        </div>

                        <span className={
                          String(policy.status || '').toLowerCase() === 'active'
                            ? 'active-status'
                            : 'inactive-status'
                        }>
                          {policy.status || 'Unknown'}
                        </span>
                      </div>

                      <div className="policy-details">
                        <div>
                          <p>Coverage Amount</p>
                          <strong>
                            {policy.coverage || policy.coverageValue}
                          </strong>
                        </div>

                        <div>
                          <p>Annual Premium</p>
                          <strong>{formatCurrency(policy.premium)}</strong>
                        </div>

                        <div>
                          <p>Valid Until</p>
                          <strong>{formatDate(policy.expiryDate)}</strong>
                        </div>
                      </div>

                      <div className="policy-actions">
                        <button onClick={() => viewPolicyDetails(policy)}>
                          View Details
                        </button>

                        <button onClick={() => window.print()}>
                          Download / Print
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </section>

              <p style={{
                textAlign: 'right',
                color: '#8192aa',
                marginTop: '25px'
              }}>
                Total Annual Premium:{' '}
                <strong>{formatCurrency(totalPremium)}</strong>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyPolicies;
