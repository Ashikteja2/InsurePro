
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const savedCustomer = localStorage.getItem('insureproCustomer');

    if (!savedCustomer) {
      navigate('/login');
      return;
    }

    try {
      const currentCustomer = JSON.parse(savedCustomer);
      setCustomer(currentCustomer);

      const allPolicies = JSON.parse(
        localStorage.getItem('insureproPolicies') || '[]'
      );

      // Show only policies belonging to the logged-in customer.
      const customerPolicies = allPolicies.filter((policy) => {
        const sameId =
          String(policy.customerId ?? policy.userId ?? '') ===
          String(currentCustomer.customerId ?? currentCustomer.id ?? '');

        const sameEmail =
          String(policy.customerEmail ?? policy.email ?? '').toLowerCase() ===
          String(currentCustomer.email ?? '').toLowerCase();

        return sameId || sameEmail;
      });

      setPolicies(customerPolicies);
    } catch (error) {
      console.error('Dashboard loading error:', error);
      setPolicies([]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('insureproCustomer');
    localStorage.removeItem('insurepro_logged_in');
    sessionStorage.removeItem('customer');
    navigate('/login');
  };

  if (!customer) {
    return <p style={{ padding: '30px' }}>Loading dashboard...</p>;
  }

  const activePolicies = policies.filter(
    (policy) =>
      String(policy.status || 'Active').toLowerCase() === 'active'
  );

  const totalPremium = policies.reduce(
    (total, policy) =>
      total + Number(
        policy.premium ??
        policy.premiumAmount ??
        policy.amount ??
        0
      ),
    0
  );

  const displayName =
    customer.fullName || customer.name || 'Customer';

  const firstLetter = displayName.charAt(0).toUpperCase();

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      background: '#f3f6fc',
      fontFamily: 'Arial, sans-serif',
      color: '#17365d'
    },
    sidebar: {
      width: '230px',
      minWidth: '210px',
      background: '#ffffff',
      padding: '25px 18px',
      boxSizing: 'border-box',
      borderRight: '1px solid #e5eaf2'
    },
    logo: {
      fontSize: '25px',
      fontWeight: 'bold',
      color: '#1456a0',
      marginBottom: '45px'
    },
    menuTitle: {
      color: '#98a2b3',
      fontSize: '12px',
      fontWeight: 'bold',
      margin: '20px 0'
    },
    link: {
      display: 'block',
      padding: '14px 12px',
      marginBottom: '8px',
      color: '#526987',
      textDecoration: 'none',
      borderRadius: '9px'
    },
    main: {
      flex: 1,
      padding: '30px',
      minWidth: 0
    },
    top: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '30px'
    },
    welcome: {
      background: 'linear-gradient(110deg, #1759a5, #367fc9)',
      color: 'white',
      borderRadius: '17px',
      padding: '45px 25px',
      textAlign: 'center',
      marginBottom: '28px'
    },
    cards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
      gap: '18px',
      marginBottom: '35px'
    },
    card: {
      background: 'white',
      padding: '25px 15px',
      borderRadius: '15px',
      textAlign: 'center',
      boxShadow: '0 5px 20px rgba(0,0,0,0.04)'
    },
    number: {
      fontSize: '26px',
      fontWeight: 'bold',
      margin: '12px 0'
    },
    section: {
      background: 'white',
      padding: '22px',
      borderRadius: '15px',
      marginBottom: '22px',
      overflowX: 'auto'
    },
    serviceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px'
    },
    service: {
      display: 'block',
      padding: '22px 12px',
      background: '#f5f8ff',
      borderRadius: '12px',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#1456a0',
      fontWeight: 'bold'
    },
    logout: {
      background: '#eaf1ff',
      color: '#1456a0',
      border: 'none',
      padding: '11px 18px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '500px'
    },
    cell: {
      padding: '13px',
      borderBottom: '1px solid #eeeeee',
      textAlign: 'left'
    }
  };

  return (
    <div style={styles.page}>

      <aside style={styles.sidebar}>
        <div style={styles.logo}>🛡️ InsurePro</div>

        <p style={styles.menuTitle}>MAIN MENU</p>

        <Link to="/dashboard" style={styles.link}>⌂ Dashboard</Link>
        <Link to="/health-insurance" style={styles.link}>♡ Health Insurance</Link>
        <Link to="/vehicle-insurance" style={styles.link}>🚘 Vehicle Insurance</Link>
        <Link to="/my-policies" style={styles.link}>▤ My Policies</Link>
        <Link to="/premium-calculator" style={styles.link}>▦ Premium Calculator</Link>
        <Link to="/my-claims" style={styles.link}>▤ My Claims</Link>
        <Link to="/payments" style={styles.link}>▣ Payments</Link>
        <Link to="/profile" style={styles.link}>♙ My Profile</Link>
      </aside>

      <main style={styles.main}>

        <div style={styles.top}>
          <div>
            <h2 style={{ margin: 0 }}>Customer Dashboard</h2>
            <p style={{ color: '#8493a8' }}>
              Manage your insurance in one place.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#dceaff',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 'bold'
            }}>
              {firstLetter}
            </div>

            <div>
              <strong>{displayName}</strong>
              <p style={{ margin: '5px 0', color: '#8493a8' }}>
                {customer.email}
              </p>
            </div>
          </div>
        </div>

        <section style={styles.welcome}>
          <h4>WELCOME TO INSUREPRO</h4>
          <h1 style={{ fontSize: '42px', margin: '20px 0' }}>
            Hello, {displayName}!
          </h1>
          <p style={{ fontSize: '18px' }}>
            Your protection matters. Manage your policies and insurance services from here.
          </p>
        </section>

        <section style={styles.cards}>

          <div style={styles.card}>
            <div style={{ fontSize: '25px' }}>▤</div>
            <h3>Total Policies</h3>
            <div style={styles.number}>{policies.length}</div>
            <p>Purchased policies</p>
          </div>

          <div style={styles.card}>
            <div style={{ fontSize: '25px' }}>✓</div>
            <h3>Active Policies</h3>
            <div style={styles.number}>{activePolicies.length}</div>
            <p>Currently active</p>
          </div>

          <div style={styles.card}>
            <div style={{ fontSize: '25px' }}>₹</div>
            <h3>Total Premium</h3>
            <div style={styles.number}>
              ₹{totalPremium.toLocaleString('en-IN')}
            </div>
            <p>Recorded policy premiums</p>
          </div>

        </section>

        <h2 style={{ textAlign: 'center' }}>Quick Services</h2>

        <section style={styles.serviceGrid}>
          <Link to="/health-insurance" style={styles.service}>
            ♡<br /><br />Health Insurance
          </Link>

          <Link to="/vehicle-insurance" style={styles.service}>
            🚘<br /><br />Vehicle Insurance
          </Link>

          <Link to="/premium-calculator" style={styles.service}>
            ▦<br /><br />Premium Calculator
          </Link>

          <Link to="/my-claims" style={styles.service}>
            ▤<br /><br />My Claims
          </Link>
        </section>

        <section style={styles.section}>
          <h2>Recent Policies</h2>

          {policies.length === 0 ? (
            <p>No policies found for your account. Purchase a demo policy to see it here.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.cell}>Policy Number</th>
                  <th style={styles.cell}>Policy Type</th>
                  <th style={styles.cell}>Premium</th>
                  <th style={styles.cell}>Status</th>
                </tr>
              </thead>

              <tbody>
                {policies.slice(0, 5).map((policy, index) => (
                  <tr key={policy.policyNumber || policy.id || index}>
                    <td style={styles.cell}>
                      {policy.policyNumber || policy.id || 'N/A'}
                    </td>
                    <td style={styles.cell}>
                      {policy.policyType || policy.type || 'Insurance'}
                    </td>
                    <td style={styles.cell}>
                      ₹{Number(
                        policy.premium ??
                        policy.premiumAmount ??
                        policy.amount ??
                        0
                      ).toLocaleString('en-IN')}
                    </td>
                    <td style={styles.cell}>
                      {policy.status || 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>

      </main>
    </div>
  );
}

export default Dashboard;
