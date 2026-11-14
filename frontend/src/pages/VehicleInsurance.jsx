
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VehicleInsurance.css';

const vehiclePlans = {
  Car: [
    {
      name: 'Car Basic',
      coverage: '₹3,00,000',
      premium: 4500,
      description: 'Essential protection for your car',
      benefits: [
        'Third-party protection',
        'Accident coverage',
        '24/7 support'
      ]
    },
    {
      name: 'Car Plus',
      coverage: '₹5,00,000',
      premium: 7500,
      description: 'Enhanced protection for your car',
      benefits: [
        'Third-party protection',
        'Own damage coverage',
        'Roadside assistance'
      ]
    },
    {
      name: 'Car Premium',
      coverage: '₹10,00,000',
      premium: 12000,
      description: 'Complete car protection',
      benefits: [
        'Comprehensive coverage',
        'Theft protection',
        'Roadside assistance'
      ]
    }
  ],

  Bike: [
    {
      name: 'Bike Basic',
      coverage: '₹1,00,000',
      premium: 1500,
      description: 'Essential protection for your bike',
      benefits: [
        'Third-party protection',
        'Accident coverage',
        '24/7 support'
      ]
    },
    {
      name: 'Bike Plus',
      coverage: '₹2,00,000',
      premium: 2500,
      description: 'Enhanced protection for your bike',
      benefits: [
        'Own damage coverage',
        'Theft protection',
        'Roadside assistance'
      ]
    },
    {
      name: 'Bike Premium',
      coverage: '₹3,00,000',
      premium: 3500,
      description: 'Complete bike protection',
      benefits: [
        'Comprehensive coverage',
        'Accident coverage',
        'Roadside assistance'
      ]
    }
  ]
};

function VehicleInsurance() {
  const navigate = useNavigate();

  const [vehicleType, setVehicleType] = useState('Car');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentStep, setPaymentStep] = useState('plans');
  const [generatedPolicy, setGeneratedPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = vehiclePlans[vehicleType];

  // Frontend-only demo purchase.
  const handlePurchase = () => {
    if (!selectedPlan || loading) {
      setError('Please select an insurance plan.');
      return;
    }

    let customer;

    try {
      customer = JSON.parse(
        localStorage.getItem('insureproCustomer') || 'null'
      );
    } catch {
      customer = null;
    }

    if (!customer) {
      alert('Please login before purchasing insurance.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const now = new Date();

      const expiry = new Date(now);
      expiry.setFullYear(expiry.getFullYear() + 1);

      const policyNumber = 'VEH-' + Date.now();

      const policy = {
        id: policyNumber,
        policyNumber: policyNumber,

        customerId: customer.customerId ?? customer.id ?? null,
        customerName: customer.fullName || '',
        email: customer.email || '',

        name: selectedPlan.name,
        planName: selectedPlan.name,

        type: 'Vehicle',
        vehicleType: vehicleType,

        coverage: selectedPlan.coverage,
        premium: String(selectedPlan.premium),

        status: 'Active',
        paymentMethod: paymentMethod,

        transactionId: 'DEMO-' + Date.now(),

        purchaseDate: now.toISOString(),
        startDate: now.toISOString(),
        expiryDate: expiry.toISOString()
      };

      // Read existing policies.
      const existingPolicies = JSON.parse(
        localStorage.getItem('insureproPolicies') || '[]'
      );

      // Save vehicle policy.
      existingPolicies.push(policy);

      localStorage.setItem(
        'insureproPolicies',
        JSON.stringify(existingPolicies)
      );

      // Read existing payments.
      const existingPayments = JSON.parse(
        localStorage.getItem('insureproPayments') || '[]'
      );

      // Create demo payment.
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

      setGeneratedPolicy({
        ...policy,
        premium: selectedPlan.premium
      });

      setPaymentStep('success');

    } catch (err) {
      console.error('Vehicle policy error:', err);
      setError('Unable to save vehicle policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-insurance-page">

      <section className="vehicle-hero">
        <div className="vehicle-hero-content">
          <span className="vehicle-tag">
            INSUREPRO VEHICLE PROTECTION
          </span>

          <h1>Protect Your Journey</h1>

          <p>
            Choose the right insurance for your car or bike.
            Enjoy peace of mind on every journey.
          </p>

          <button
            className="vehicle-hero-btn"
            onClick={() =>
              document.getElementById('vehicle-plans')?.scrollIntoView({
                behavior: 'smooth'
              })
            }
          >
            Explore Plans
          </button>
        </div>
      </section>

      <section className="vehicle-benefits">
        <div>
          <span>🛡️</span>
          <h3>Reliable Protection</h3>
          <p>Protection for unexpected events.</p>
        </div>

        <div>
          <span>⚡</span>
          <h3>Easy Process</h3>
          <p>Simple insurance purchase process.</p>
        </div>

        <div>
          <span>🤝</span>
          <h3>Customer Support</h3>
          <p>Support when you need assistance.</p>
        </div>
      </section>

      <section className="vehicle-plans-section" id="vehicle-plans">
        <div className="vehicle-section-heading">
          <span>OUR INSURANCE PLANS</span>
          <h2>Choose Your Vehicle Insurance</h2>
          <p>Select your vehicle type and compare available plans.</p>
        </div>

        <div className="vehicle-type-selector">
          <button
            className={vehicleType === 'Car' ? 'active' : ''}
            onClick={() => {
              setVehicleType('Car');
              setSelectedPlan(null);
              setError('');
            }}
          >
            🚗 Car Insurance
          </button>

          <button
            className={vehicleType === 'Bike' ? 'active' : ''}
            onClick={() => {
              setVehicleType('Bike');
              setSelectedPlan(null);
              setError('');
            }}
          >
            🏍️ Bike Insurance
          </button>
        </div>

        <div className="vehicle-plan-grid">
          {plans.map((plan, index) => (
            <div
              className={`vehicle-plan-card ${
                selectedPlan?.name === plan.name ? 'selected' : ''
              }`}
              key={plan.name}
            >
              {index === 1 && (
                <span className="vehicle-popular">POPULAR</span>
              )}

              <h3>{plan.name}</h3>

              <p className="vehicle-plan-description">
                {plan.description}
              </p>

              <div className="vehicle-coverage">
                <small>Coverage Amount</small>
                <h2>{plan.coverage}</h2>
              </div>

              <div className="vehicle-premium">
                <h2>₹{plan.premium.toLocaleString('en-IN')}</h2>
                <span>/ year</span>
              </div>

              <ul>
                {plan.benefits.map((benefit) => (
                  <li key={benefit}>✓ {benefit}</li>
                ))}
              </ul>

              <button
                className="vehicle-select-btn"
                onClick={() => {
                  setSelectedPlan(plan);
                  setError('');
                  setPaymentStep('plans');
                  setGeneratedPolicy(null);
                }}
              >
                {selectedPlan?.name === plan.name
                  ? 'Selected'
                  : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {selectedPlan && paymentStep === 'plans' && (
          <div className="vehicle-selection-summary">
            <h3>Selected Plan: {selectedPlan.name}</h3>

            <p>Coverage: {selectedPlan.coverage}</p>

            <p>
              Annual Premium: ₹
              {selectedPlan.premium.toLocaleString('en-IN')}
            </p>

            <button
              className="vehicle-pay-btn"
              onClick={() => setPaymentStep('payment')}
            >
              Continue to Payment
            </button>
          </div>
        )}

        {error && (
          <p className="vehicle-error">{error}</p>
        )}
      </section>

      {/* Payment Modal */}
      {paymentStep === 'payment' && selectedPlan && (
        <div className="vehicle-modal-overlay">
          <div className="vehicle-payment-modal">

            <button
              className="vehicle-close-btn"
              onClick={() => setPaymentStep('plans')}
              disabled={loading}
            >
              ×
            </button>

            <h2>Demo Payment</h2>

            <p>{selectedPlan.name}</p>

            <h1>
              ₹{selectedPlan.premium.toLocaleString('en-IN')}
            </h1>

            <p>Select Payment Method</p>

            {['UPI', 'Credit/Debit Card', 'Net Banking'].map((method) => (
              <label className="vehicle-payment-option" key={method}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={loading}
                />
                {method}
              </label>
            ))}

            {error && (
              <p className="vehicle-error">{error}</p>
            )}

            <button
              className="vehicle-pay-btn"
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading
                ? 'Generating Policy...'
                : `Pay ₹${selectedPlan.premium.toLocaleString('en-IN')}`}
            </button>

            <p className="vehicle-demo-note">
              Demo payment only. No real money will be charged.
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {paymentStep === 'success' && generatedPolicy && (
        <div className="vehicle-modal-overlay">
          <div className="vehicle-success-modal">

            <div className="vehicle-success-icon">✓</div>

            <h2>Policy Generated Successfully!</h2>

            <p>Your vehicle insurance demo policy has been saved.</p>

            <div className="vehicle-policy-details">
              <p>
                <strong>Policy Number:</strong>{' '}
                {generatedPolicy.policyNumber}
              </p>

              <p>
                <strong>Vehicle:</strong> {generatedPolicy.vehicleType}
              </p>

              <p>
                <strong>Plan:</strong> {generatedPolicy.planName}
              </p>

              <p>
                <strong>Coverage:</strong> {generatedPolicy.coverage}
              </p>

              <p>
                <strong>Premium:</strong>{' '}
                ₹{generatedPolicy.premium.toLocaleString('en-IN')}
              </p>

              <p>
                <strong>Payment Method:</strong>{' '}
                {generatedPolicy.paymentMethod}
              </p>

              <p>
                <strong>Status:</strong> Active
              </p>

              <p>
                <strong>Demo Transaction:</strong>{' '}
                {generatedPolicy.transactionId}
              </p>
            </div>

            <button
              className="vehicle-pay-btn"
              onClick={() => navigate('/my-policies')}
            >
              View My Policies
            </button>

            <button
              className="vehicle-select-btn"
              onClick={() => {
                setPaymentStep('plans');
                setSelectedPlan(null);
                setGeneratedPolicy(null);
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

export default VehicleInsurance;
