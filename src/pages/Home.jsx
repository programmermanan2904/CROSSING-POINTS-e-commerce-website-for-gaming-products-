import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    const numberOfParticles = 80;

    let mouse = {
      x: null,
      y: null,
      radius: 150,
    };

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("mousemove", (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 2.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Mouse interaction (repel effect)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          this.x -= dx / 15;
          this.y -= dy / 15;
        }
      }

      draw() {
        ctx.fillStyle = "#8a2be2";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = dx * dx + dy * dy;

          if (distance < 12000) {
            ctx.strokeStyle = "rgba(138,43,226,0.08)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connect();

      requestAnimationFrame(animate);
    }

    init();
    animate();

    // Resize handler
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });

    return () => {
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div className="hero">
      <canvas ref={canvasRef} className="hero-canvas"></canvas>

      <div className="hero-content">
        <h1 className="hero-title">
          CROSSING POINTS
        </h1>

        <h2 className="hero-tagline">
          A Realm for Gamers.
          <br />
          A Battlefield for Legends.
        </h2>

        <p className="hero-description">
          Enter the battlefield of performance.
          Precision gear engineered for dominance.
        </p>

        <div className="hero-buttons">
          <Link to="/shop" className="primary-btn">
            Enter The Realm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
