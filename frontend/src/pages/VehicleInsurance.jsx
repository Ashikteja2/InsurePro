
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
      benefits: ['Third-party protection', 'Accident coverage', '24/7 support']
    },
    {
      name: 'Car Plus',
      coverage: '₹5,00,000',
      premium: 7500,
      description: 'Enhanced protection for your car',
      benefits: ['Third-party protection', 'Own damage coverage', 'Roadside assistance']
    },
    {
      name: 'Car Premium',
      coverage: '₹10,00,000',
      premium: 12000,
      description: 'Complete car protection',
      benefits: ['Comprehensive coverage', 'Theft protection', 'Roadside assistance']
    }
  ],
  Bike: [
    {
      name: 'Bike Basic',
      coverage: '₹1,00,000',
      premium: 1500,
      description: 'Essential protection for your bike',
      benefits: ['Third-party protection', 'Accident coverage', '24/7 support']
    },
    {
      name: 'Bike Plus',
      coverage: '₹2,00,000',
      premium: 2500,
      description: 'Enhanced protection for your bike',
      benefits: ['Own damage coverage', 'Theft protection', 'Roadside assistance']
    },
    {
      name: 'Bike Premium',
      coverage: '₹3,00,000',
      premium: 3500,
      description: 'Complete bike protection',
      benefits: ['Comprehensive coverage', 'Accident coverage', 'Roadside assistance']
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

  const handlePurchase = async () => {
    if (!selectedPlan) {
      setError('Please select an insurance plan.');
      return;
    }

    const customerData = localStorage.getItem('insureproCustomer');

    if (!customerData) {
      alert('Please login before purchasing insurance.');
      navigate('/login');
      return;
    }

    let customer;

    try {
      customer = JSON.parse(customerData);
    } catch {
      alert('Customer login information is invalid. Please login again.');
      navigate('/login');
      return;
    }

    const customerId = customer.customerId || customer.id;

    if (!customerId) {
      alert('Customer ID not found. Please login again.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'http://localhost:8082/api/policies/purchase',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerId: Number(customerId),
            name: selectedPlan.name,
            type: 'Vehicle',
            coverage: selectedPlan.coverage,
            premium: `₹${selectedPlan.premium}`
          })
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Policy generation failed.');
      }

      const policy = await response.json();

      setGeneratedPolicy({
        ...policy,
        planName: selectedPlan.name,
        coverage: selectedPlan.coverage,
        premium: selectedPlan.premium,
        vehicleType,
        paymentMethod,
        transactionId: `DEMO-${Date.now()}`
      });

      setPaymentStep('success');
    } catch (err) {
      setError(err.message || 'Unable to generate policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-insurance-page">
      <section className="vehicle-hero">
        <div className="vehicle-hero-content">
          <span className="vehicle-tag">INSUREPRO VEHICLE PROTECTION</span>
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
              {index === 1 && <span className="vehicle-popular">POPULAR</span>}

              <h3>{plan.name}</h3>
              <p className="vehicle-plan-description">{plan.description}</p>

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
            <p>Annual Premium: ₹{selectedPlan.premium.toLocaleString('en-IN')}</p>
            <button
              className="vehicle-pay-btn"
              onClick={() => setPaymentStep('payment')}
            >
              Continue to Payment
            </button>
          </div>
        )}

        {error && <p className="vehicle-error">{error}</p>}
      </section>

      {paymentStep === 'payment' && selectedPlan && (
        <div className="vehicle-modal-overlay">
          <div className="vehicle-payment-modal">
            <button
              className="vehicle-close-btn"
              onClick={() => setPaymentStep('plans')}
            >
              ×
            </button>

            <h2>Complete Your Payment</h2>
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
                />
                {method}
              </label>
            ))}

            {error && <p className="vehicle-error">{error}</p>}

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

      {paymentStep === 'success' && generatedPolicy && (
        <div className="vehicle-modal-overlay">
          <div className="vehicle-success-modal">
            <div className="vehicle-success-icon">✓</div>
            <h2>Policy Generated Successfully!</h2>
            <p>Your vehicle insurance policy has been saved.</p>

            <div className="vehicle-policy-details">
              <p>
                <strong>Policy Number:</strong>{' '}
                {generatedPolicy.policyNumber || `Generated`}
              </p>
              <p><strong>Vehicle:</strong> {generatedPolicy.vehicleType}</p>
              <p><strong>Plan:</strong> {generatedPolicy.planName}</p>
              <p><strong>Coverage:</strong> {generatedPolicy.coverage}</p>
              <p>
                <strong>Premium:</strong>{' '}
                ₹{generatedPolicy.premium.toLocaleString('en-IN')}
              </p>
              <p><strong>Payment Method:</strong> {generatedPolicy.paymentMethod}</p>
              <p><strong>Demo Transaction:</strong> {generatedPolicy.transactionId}</p>
            </div>

            <button
              className="vehicle-pay-btn"
              onClick={() => navigate('/my-policies')}
            >
              View My Policies
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleInsurance;
