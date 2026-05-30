import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Quote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Globe,
  Users,
} from "lucide-react";
import "./Testimonials.css";

const TESTIMONIALS = [
  {
    name: "Rajesh Mehta",
    role: "VP of Engineering",
    company: "Mehta Engineering",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    quote:
      "AEccentric completely transformed our rapid prototyping workflow. Their engineering systems reduced our production cycle massively.",
    metric: "90% Faster Delivery",
  },
  {
    name: "Priya Sharma",
    role: "Head of Product",
    company: "Sharma Tech",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b332c3e4?w=300",
    quote:
      "Their AI automation pipelines helped us scale operations without increasing team size.",
    metric: "80% Automation",
  },
  {
    name: "Vikram Malhotra",
    role: "Founder",
    company: "Apex Systems",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
    quote:
      "The cloud architecture they built is stable, scalable, and significantly faster than our previous stack.",
    metric: "3x Faster Infrastructure",
  },
  {
    name: "Neha Reddy",
    role: "VP Product",
    company: "FinQuest",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    quote:
      "The UI/UX quality was exceptional. The platform feels modern, premium, and enterprise ready.",
    metric: "97% User Satisfaction",
  },
];

const STATS = [
  {
    value: "500+",
    label: "Projects Completed",
    icon: CheckCircle2,
  },
  {
    value: "97%",
    label: "Client Retention",
    icon: Users,
  },
  {
    value: "4.9★",
    label: "Average Rating",
    icon: Star,
  },
  {
    value: "15+",
    label: "Countries Served",
    icon: Globe,
  },
];

const BRANDS = [
  "Microsoft",
  "AWS",
  "Google",
  "NVIDIA",
  "Oracle",
  "IBM",
];

const Testimonials = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) =>
        prev === TESTIMONIALS.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActive((prev) =>
      prev === TESTIMONIALS.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setActive((prev) =>
      prev === 0 ? TESTIMONIALS.length - 1 : prev - 1
    );
  };

  return (
    <div className="nexus-service-page">
      <div className="page">

      {/* ================= NAVBAR ================= */}



      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-left">

          <div className="hero-badge">
            <Sparkles size={14} />
            CLIENT SUCCESS STORIES
          </div>

          <h1 className="hero-title">
            Real Results Built With
            <span> Innovation.</span>
          </h1>

          <p className="hero-description">
            Discover how companies transformed their
            engineering, automation, and infrastructure
            workflows using our AI systems and modern
            development solutions.
          </p>

          <div className="hero-buttons">
            <Link to="/contact">
              <button className="hero-primary-btn">
                Start Project
              </button>
            </Link>

            <Link to="/work/case-studies">
              <button className="hero-secondary-btn">
                Explore Work
              </button>
            </Link>
          </div>

        </div>

        <div className="hero-right">

          <div className="featured-preview-card">

            <img
              src={TESTIMONIALS[active].image}
              alt=""
              className="preview-avatar"
            />

            <div className="preview-content">

              <Quote
                className="preview-quote-icon"
                size={40}
              />

              <p className="preview-quote">
                "{TESTIMONIALS[active].quote}"
              </p>

              <div className="preview-user">
                <h4>{TESTIMONIALS[active].name}</h4>
                <span>
                  {TESTIMONIALS[active].role}
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats-row">

        {STATS.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className="stat-card" key={index}>

              <Icon size={28} className="stat-icon" />

              <div className="stat-value">
                {item.value}
              </div>

              <div className="stat-label">
                {item.label}
              </div>

            </div>
          );
        })}

      </section>

      {/* ================= FEATURED TESTIMONIAL ================= */}

      <section className="featured-testimonial">

        <div>

          <div className="slider-actions">

            <button onClick={prevSlide}>
              <ChevronLeft size={18} />
            </button>

            <button onClick={nextSlide}>
              <ChevronRight size={18} />
            </button>

          </div>

          <Quote
            size={60}
            className="featured-quote-icon"
          />

          <p className="featured-quote">
            "{TESTIMONIALS[active].quote}"
          </p>

          <div className="client-info">

            <img
              src={TESTIMONIALS[active].image}
              alt=""
              className="client-avatar"
            />

            <div>

              <div className="client-name">
                {TESTIMONIALS[active].name}
              </div>

              <div className="client-role">
                {TESTIMONIALS[active].role}
                {" • "}
                {TESTIMONIALS[active].company}
              </div>

            </div>

          </div>

        </div>

        <div className="metric-card">

          <span className="metric-label">
            KEY ACHIEVEMENT
          </span>

          <h2 className="metric-value">
            {TESTIMONIALS[active].metric}
          </h2>

        </div>

      </section>

      {/* ================= TESTIMONIAL GRID ================= */}

      <section className="testimonial-grid">

        {TESTIMONIALS.map((item, index) => (
          <div className="testimonial-card" key={index}>

            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill="#F59E0B"
                  color="#F59E0B"
                />
              ))}
            </div>

            <p className="testimonial-text">
              "{item.quote}"
            </p>

            <div className="testimonial-footer">

              <img
                src={item.image}
                alt=""
                className="testimonial-avatar"
              />

              <div>
                <h4>{item.name}</h4>
                <span>{item.company}</span>
              </div>

            </div>

          </div>
        ))}

      </section>

      {/* ================= BRANDS ================= */}

      <section className="brand-strip">

        <div className="brand-row">

          {BRANDS.map((brand, index) => (
            <div className="brand-item" key={index}>
              {brand}
            </div>
          ))}

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="cta-banner">

        <h2 className="cta-title">
          Ready To Build Your Success Story?
        </h2>

        <p className="cta-description">
          Let’s build modern AI systems,
          scalable infrastructure, and
          high-performance digital products together.
        </p>

        <Link to="/contact">
          <button className="hero-primary-btn">
            Start Your Project
            <ArrowRight size={18} />
          </button>
        </Link>

      </section>

    </div>
   </div>
  );
};

export default Testimonials;