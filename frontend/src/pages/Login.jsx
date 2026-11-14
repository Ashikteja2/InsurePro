
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      // Get registered demo accounts from browser storage
      const users = JSON.parse(
        localStorage.getItem('insurepro_demo_users') || '[]'
      );

      // Find account using email and password
      const loggedInUser = users.find(
        (user) =>
          user.email === email.trim().toLowerCase() &&
          user.password === password
      );

      if (!loggedInUser) {
        setError('Invalid email or password. Please register first.');
        setLoading(false);
        return;
      }

      // Save logged-in customer details
      const customer = {
        customerId: loggedInUser.id,
        id: loggedInUser.id,
        fullName: loggedInUser.name,
        name: loggedInUser.name,
        email: loggedInUser.email,
        phone: loggedInUser.phone
      };

      localStorage.setItem(
        'insureproCustomer',
        JSON.stringify(customer)
      );

      localStorage.setItem(
        'insurepro_logged_in',
        'true'
      );

      // Go to dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>

        <h1 style={styles.heading}>Welcome Back</h1>

        <p style={styles.subtitle}>
          Login to your InsurePro account
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <label style={styles.label}>
          Email Address
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={styles.input}
          required
        />

        <label style={styles.label}>
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={styles.input}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>

      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f3f6fb',
    padding: '20px',
    boxSizing: 'border-box'
  },

  card: {
    width: '100%',
    maxWidth: '460px',
    background: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    boxSizing: 'border-box'
  },

  heading: {
    textAlign: 'center',
    margin: '0 0 12px 0',
    color: '#16345c',
    fontSize: '36px',
    lineHeight: '1.2',
    fontWeight: '700'
  },

  subtitle: {
    textAlign: 'center',
    color: '#667085',
    fontSize: '17px',
    marginBottom: '30px'
  },

  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#344054',
    fontSize: '16px'
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px',
    marginBottom: '24px',
    border: '1px solid #d0d5dd',
    borderRadius: '9px',
    fontSize: '15px',
    outline: 'none'
  },

  button: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '9px',
    background: '#1456a0',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  error: {
    background: '#fee4e2',
    color: '#b42318',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },

  footer: {
    textAlign: 'center',
    marginTop: '25px',
    color: '#667085',
    fontSize: '16px'
  },

  link: {
    color: '#1456a0',
    fontWeight: '600'
  }
};

export default Login;
