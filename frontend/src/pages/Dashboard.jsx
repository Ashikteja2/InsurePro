
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';

function Dashboard() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [policies, setPolicies] = useState([]);
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

      setCustomer(savedCustomer);

      const customerId =
        savedCustomer.customerId ?? savedCustomer.id;

      if (!customerId) {
        navigate('/login');
        return;
      }

      const loadPolicies = async () => {
        try {
          const response = await fetch(
            `${API_URL}/api/policies/customer/${customerId}`
          );

          if (response.ok) {
            const data = await response.json();
            setPolicies(Array.isArray(data) ? data : []);
          }
        } catch (error) {
          console.error('Unable to load policies:', error);
        } finally {
          setLoading(false);
        }
      };

      loadPolicies();
    } catch (error) {
      console.error('Customer information error:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('insureproCustomer');
    navigate('/login');
  };

  const formatMoney = (value) => {
    const amount = Number(String(value ?? '').replace(/[^\d.]/g, ''));

    if (!Number.isFinite(amount)) {
      return '₹0';
    }

    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const activePolicies = policies.filter(
    (policy) => String(policy.status).toLowerCase() === 'active'
  );

  const totalPremium = policies.reduce((total, policy) => {
    const amount = Number(
      String(policy.premium ?? '').replace(/[^\d.]/g, '')
    );

    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const firstName = customer?.fullName
    ? customer.fullName.split(' ')[0]
    : 'Customer';

  const menuItems = [
    { icon: '⌂', label: 'Dashboard', path: '/dashboard' },
    { icon: '♡', label: 'Health Insurance', path: '/health-insurance' },
    { icon: '🚗', label: 'Vehicle Insurance', path: '/vehicle-insurance' },
    { icon: '▤', label: 'My Policies', path: '/my-policies' },
    { icon: '▦', label: 'Premium Calculator', path: '/premium-calculator' },
    { icon: '▤', label: 'My Claims', path: '/my-claims' },
    { icon: '▣', label: 'Payments', path: '/payments' },
    { icon: '♙', label: 'My Profile', path: '/profile' }
  ];

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>I</span>
          <span>InsurePro</span>
        </div>

        <p style={styles.menuHeading}>MAIN MENU</p>

        <nav style={styles.navigation}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.menuLink,
                ...(item.path === '/dashboard' ? styles.activeLink : {})
              }}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.helpBox}>
            <strong>Need Help?</strong>
            <p>We are here to support you.</p>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <header style={styles.topbar}>
          <div>
            <h2 style={styles.topTitle}>Customer Dashboard</h2>
            <p style={styles.topSubtitle}>
              Manage your insurance in one place.
            </p>
          </div>

          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{customer?.fullName || 'Customer'}</strong>
              <p style={styles.email}>{customer?.email || ''}</p>
            </div>
          </div>
        </header>

        <section style={styles.welcome}>
          <div>
            <p style={styles.welcomeSmall}>WELCOME TO INSUREPRO</p>
            <h1>Hello, {firstName}!</h1>
            <p>
              Your protection matters. Manage your policies and insurance
              services from here.
            </p>
          </div>

          <div style={styles.welcomeIcon}>🛡️</div>
        </section>

        {/* Summary cards */}
        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>▤</div>
            <p>Total Policies</p>
            <h2>{loading ? '...' : policies.length}</h2>
            <span>Purchased policies</span>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>✓</div>
            <p>Active Policies</p>
            <h2>{loading ? '...' : activePolicies.length}</h2>
            <span>Currently active</span>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>₹</div>
            <p>Total Premium</p>
            <h2>{loading ? '...' : formatMoney(totalPremium)}</h2>
            <span>Recorded policy premiums</span>
          </div>
        </section>

        {/* Quick actions */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Services</h2>

          <div style={styles.servicesGrid}>
            <Link to="/health-insurance" style={styles.serviceCard}>
              <span style={styles.serviceIcon}>♡</span>
              <h3>Health Insurance</h3>
              <p>Explore health coverage plans.</p>
              <span style={styles.serviceLink}>Explore Plans →</span>
            </Link>

            <Link to="/vehicle-insurance" style={styles.serviceCard}>
              <span style={styles.serviceIcon}>🚗</span>
              <h3>Vehicle Insurance</h3>
              <p>Explore car and bike protection.</p>
              <span style={styles.serviceLink}>Explore Plans →</span>
            </Link>

            <Link to="/premium-calculator" style={styles.serviceCard}>
              <span style={styles.serviceIcon}>▦</span>
              <h3>Premium Calculator</h3>
              <p>Calculate an estimated premium.</p>
              <span style={styles.serviceLink}>Calculate Now →</span>
            </Link>

            <Link to="/my-claims" style={styles.serviceCard}>
              <span style={styles.serviceIcon}>▤</span>
              <h3>My Claims</h3>
              <p>Submit and view demo claims.</p>
              <span style={styles.serviceLink}>View Claims →</span>
            </Link>

            <Link to="/payments" style={styles.serviceCard}>
              <span style={styles.serviceIcon}>▣</span>
              <h3>Payments</h3>
              <p>View your policy premium records.</p>
              <span style={styles.serviceLink}>View Payments →</span>
            </Link>

            <Link to="/my-policies" style={styles.serviceCard}>
              <span style={styles.serviceIcon}>📄</span>
              <h3>My Policies</h3>
              <p>Review your purchased policies.</p>
              <span style={styles.serviceLink}>View Policies →</span>
            </Link>
          </div>
        </section>

        {/* Recent policies */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Policies</h2>
            <Link to="/my-policies" style={styles.viewAll}>
              View All →
            </Link>
          </div>

          <div style={styles.policyBox}>
            {loading ? (
              <p style={styles.emptyText}>Loading policies...</p>
            ) : policies.length === 0 ? (
              <div style={styles.empty}>
                <span style={{ fontSize: '35px' }}>📄</span>
                <h3>No Policies Yet</h3>
                <p>Choose an insurance plan to get started.</p>
                <Link to="/health-insurance" style={styles.primaryButton}>
                  Explore Insurance
                </Link>
              </div>
            ) : (
              policies.slice(0, 5).map((policy) => (
                <div key={policy.id || policy.policyNumber} style={styles.policyRow}>
                  <div style={styles.policyIcon}>
                    {String(policy.type).toLowerCase() === 'vehicle'
                      ? '🚗'
                      : '♡'}
                  </div>

                  <div style={styles.policyDetails}>
                    <strong>{policy.name || 'Insurance Policy'}</strong>
                    <span>{policy.policyNumber || 'No policy number'}</span>
                  </div>

                  <div style={styles.policyPremium}>
                    <strong>{formatMoney(policy.premium)}</strong>
                    <span>Annual premium</span>
                  </div>

                  <span style={styles.status}>
                    {policy.status || 'Recorded'}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} InsurePro. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f4f7fc',
    color: '#17365d',
    fontFamily: 'Arial, sans-serif'
  },

  sidebar: {
    width: '245px',
    minWidth: '245px',
    background: '#ffffff',
    padding: '25px 15px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e5eaf2',
    boxSizing: 'border-box'
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '23px',
    fontWeight: 'bold',
    color: '#1456a0',
    padding: '5px 10px 35px'
  },

  logoIcon: {
    background: '#1456a0',
    color: '#ffffff',
    width: '36px',
    height: '36px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '9px'
  },

  menuHeading: {
    fontSize: '11px',
    color: '#9aa7b8',
    fontWeight: 'bold',
    paddingLeft: '12px',
    letterSpacing: '1px'
  },

  navigation: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px'
  },

  menuLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    padding: '13px 12px',
    color: '#61748f',
    textDecoration: 'none',
    borderRadius: '9px',
    fontSize: '14px'
  },

  activeLink: {
    background: '#eaf2ff',
    color: '#1456a0',
    fontWeight: 'bold'
  },

  menuIcon: {
    width: '20px',
    textAlign: 'center',
    fontSize: '18px'
  },

  sidebarBottom: {
    marginTop: 'auto'
  },

  helpBox: {
    background: '#f0f5ff',
    borderRadius: '10px',
    padding: '15px',
    fontSize: '13px',
    margin: '20px 0'
  },

  logoutButton: {
    width: '100%',
    border: 'none',
    background: '#fff0f0',
    color: '#c03939',
    padding: '13px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },

  main: {
    flex: 1,
    minWidth: 0,
    padding: '25px 30px',
    boxSizing: 'border-box'
  },

  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px'
  },

  topTitle: {
    margin: 0,
    fontSize: '23px'
  },

  topSubtitle: {
    color: '#8492a6',
    margin: '7px 0 0',
    fontSize: '13px'
  },

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px'
  },

  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: '#dceaff',
    color: '#1456a0',
    fontWeight: 'bold',
    fontSize: '19px'
  },

  email: {
    color: '#8492a6',
    margin: '5px 0 0'
  },

  welcome: {
    background: 'linear-gradient(110deg, #1456a0, #347ac5)',
    color: '#ffffff',
    borderRadius: '15px',
    padding: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px'
  },

  welcomeSmall: {
    fontSize: '11px',
    letterSpacing: '1.5px',
    fontWeight: 'bold',
    opacity: 0.8
  },

  welcomeIcon: {
    fontSize: '65px'
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '18px',
    marginBottom: '30px'
  },

  statCard: {
    background: '#ffffff',
    padding: '22px',
    borderRadius: '13px',
    boxShadow: '0 3px 15px rgba(0,0,0,.04)'
  },

  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'grid',
    placeItems: 'center',
    background: '#eaf2ff',
    color: '#1456a0',
    fontSize: '21px',
    fontWeight: 'bold'
  },

  section: {
    marginBottom: '30px'
  },

  sectionTitle: {
    fontSize: '20px',
    margin: '0 0 18px'
  },

  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '17px'
  },

  serviceCard: {
    display: 'block',
    background: '#ffffff',
    padding: '20px',
    borderRadius: '13px',
    textDecoration: 'none',
    color: '#17365d',
    boxShadow: '0 3px 15px rgba(0,0,0,.04)'
  },

  serviceIcon: {
    fontSize: '28px',
    color: '#1456a0'
  },

  serviceLink: {
    color: '#1456a0',
    fontWeight: 'bold',
    fontSize: '13px'
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  viewAll: {
    color: '#1456a0',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '13px'
  },

  policyBox: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '13px',
    boxShadow: '0 3px 15px rgba(0,0,0,.04)'
  },

  policyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '17px 5px',
    borderBottom: '1px solid #edf0f5',
    flexWrap: 'wrap'
  },

  policyIcon: {
    width: '43px',
    height: '43px',
    borderRadius: '10px',
    background: '#eaf2ff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '22px'
  },

  policyDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    flex: 1,
    minWidth: '130px'
  },

  policyPremium: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px'
  },

  status: {
    background: '#e5f7ee',
    color: '#16804a',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },

  empty: {
    textAlign: 'center',
    padding: '35px 10px'
  },

  emptyText: {
    color: '#718096'
  },

  primaryButton: {
    display: 'inline-block',
    padding: '12px 20px',
    background: '#1456a0',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    marginTop: '10px'
  },

  footer: {
    padding: '20px 0',
    color: '#8492a6',
    fontSize: '12px',
    textAlign: 'center'
  }
};

export default Dashboard;
