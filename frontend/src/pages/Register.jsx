
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, User, Mail, Phone, Lock, Eye, EyeOff
} from 'lucide-react'
import './Auth.css'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setSuccess(false)

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8082/api/customers/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Registration failed. Please try again.')
        return
      }

      setSuccess(true)
      setMessage('Account created successfully! You can now sign in.')

      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      })

    } catch (error) {
      setMessage(
        'Unable to connect to the server. Please check your backend.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <Link to="/" className="auth-logo">
          <ShieldCheck size={32} />
          Insure<span>Pro</span>
        </Link>

        <div className="brand-message">
          <h1>Secure your<br />future today.</h1>
          <p>
            Join InsurePro and manage your health and vehicle insurance
            in one place.
          </p>
          <div className="brand-feature">✓ Simple policy management</div>
          <div className="brand-feature">✓ Convenient claims tracking</div>
          <div className="brand-feature">✓ One account, multiple protections</div>
        </div>

        <small>© 2026 InsurePro. All rights reserved.</small>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-heading">
            <span>CREATE YOUR ACCOUNT</span>
            <h2>Get started with InsurePro</h2>
            <p>Enter your details to create your customer account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <div className="auth-input">
              <User size={19} />
              <input
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <label>Email Address</label>
            <div className="auth-input">
              <Mail size={19} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <label>Phone Number</label>
            <div className="auth-input">
              <Phone size={19} />
              <input
                type="tel"
                name="phone"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Enter a 10-digit mobile number"
                required
              />
            </div>

            <label>Password</label>
            <div className="auth-input">
              <Lock size={19} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <label>Confirm Password</label>
            <div className="auth-input">
              <Lock size={19} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          {message && (
            <p
              className="auth-message"
              style={{ color: success ? 'green' : 'red' }}
            >
              {message}
            </p>
          )}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>

          <Link to="/" className="back-home">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
