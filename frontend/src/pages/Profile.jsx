
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Hash,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const savedCustomer = localStorage.getItem('insureproCustomer');

    if (savedCustomer) {
      try {
        setCustomer(JSON.parse(savedCustomer));
      } catch (error) {
        console.error('Unable to read customer details:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('insureproCustomer');
    sessionStorage.removeItem('customer');
    navigate('/login');
  };

  if (!customer) {
    return (
      <div className="profile-message">
        <h2>Please log in to view your profile.</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  const initials = customer.fullName
    ? customer.fullName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : 'C';

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/dashboard" className="profile-logo">
          <ShieldCheck size={30} />
          Insure<span>Pro</span>
        </Link>

        <button onClick={handleLogout} className="profile-logout">
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <main className="profile-container">
        <Link to="/dashboard" className="profile-back">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="profile-title">
          <h1>My Profile</h1>
          <p>View your personal account information.</p>
        </div>

        <section className="profile-card">
          <div className="profile-avatar">{initials}</div>

          <h2>{customer.fullName || 'Customer'}</h2>
          <p className="profile-member">InsurePro Customer</p>

          <div className="profile-details">
            <div className="profile-detail">
              <User size={21} />
              <div>
                <span>Full Name</span>
                <strong>{customer.fullName || 'Not available'}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <Mail size={21} />
              <div>
                <span>Email Address</span>
                <strong>{customer.email || 'Not available'}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <Phone size={21} />
              <div>
                <span>Phone Number</span>
                <strong>{customer.phone || 'Not available'}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <Hash size={21} />
              <div>
                <span>Customer ID</span>
                <strong>{customer.customerId || 'Not available'}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
