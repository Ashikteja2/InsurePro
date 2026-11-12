
import './App.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="website">

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✚</span>
          Insure<span>Pro</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#insurance">Insurance</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-actions">
          <button
            className="login-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          <button
            className="nav-quote"
            onClick={() => navigate('/register')}
          >
            Get a Quote ↗
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">

          <div className="tag">YOUR FUTURE, OUR PRIORITY</div>

          <h1>
            Protection for
            <span> Everything </span>
            That Matters.
          </h1>

          <p>
            Smart, simple and reliable insurance solutions
            for your health, vehicle and your family's future.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => scrollToSection('insurance')}
            >
              Explore Insurance →
            </button>

            <button
              className="secondary-btn"
              onClick={() => scrollToSection('about')}
            >
              Discover More
            </button>
          </div>

          <div className="trust">
            <div className="trust-icon">✓</div>
            <div>
              <strong>Protection you can trust</strong>
              <small>Simple insurance. Peace of mind.</small>
            </div>
          </div>

        </div>

        <div className="hero-visual">
          <div className="hero-circle">
            <div className="shield">♢</div>

            <div className="floating-card">
              <span>✓</span>
              Your protection matters
              <small>InsurePro is here for you</small>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="insurance-section" id="insurance">

        <div className="section-heading">
          <span>OUR INSURANCE SOLUTIONS</span>
          <h2>Protection Made Simple</h2>
          <p>Choose the coverage that fits your life.</p>
        </div>

        <div className="insurance-grid">

          {/* Vehicle Insurance */}
          <div className="insurance-card">
            <div className="card-icon">🚗</div>

            <h3>Vehicle Insurance</h3>

            <p>
              Protect your car and bike against unexpected
              accidents, damages and other risks.
            </p>

            <a
              href="/vehicle-insurance"
              onClick={(e) => {
                e.preventDefault();
                navigate('/vehicle-insurance');
              }}
            >
              Explore Vehicle Insurance →
            </a>
          </div>

          {/* Health Insurance */}
          <div className="insurance-card">
            <div className="card-icon">❤</div>

            <h3>Health Insurance</h3>

            <p>
              Secure your family's health with flexible
              coverage and financial protection.
            </p>

            <a
              href="/health-insurance"
              onClick={(e) => {
                e.preventDefault();
                navigate('/health-insurance');
              }}
            >
              Explore Health Insurance →
            </a>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section className="bottom-banner" id="about">
        <h2>Your Security. Our Commitment.</h2>

        <p>
          Start your insurance journey with InsurePro today.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate('/register')}
        >
          Get Started →
        </button>
      </section>

      {/* Footer */}
      <footer id="contact">
        <div className="logo">
          <span className="logo-icon">✚</span>
          Insure<span>Pro</span>
        </div>

        <p>© 2026 InsurePro. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;
