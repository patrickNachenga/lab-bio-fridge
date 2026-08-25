import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './page-auth.css'
import './AuthWrapper.css'

export const AuthWrapper = ({ children }) => {
    return (
      <div className="bio-auth-wrapper">

        {/* Full laboratory background */}
        <div className="bio-auth-background" />

        {/* Main two-column layout */}
        <div className="bio-auth-layout">

          {/* =====================================================
                    LEFT SIDE
                ===================================================== */}
          <section className="bio-auth-left">

            {/* MNH Logo */}
            <div className="bio-mnh-logo">
              <img src="/assets/img/mnhlogo.png" alt="" width={"60px"} height={"60px"} aria-label='Sneat logo image' />
            </div>


            {/* Main Branding */}
            <div className="bio-brand-content">

              <h1 className="bio-system-title">
                BIO-FRIDGE SYSTEM
              </h1>

              <p className="bio-system-subtitle">
                Biological Sample Repository &amp;<br />
                Cold Storage Mapping System
              </p>


              <div className="bio-world-class">
                <strong>LABORATORY</strong>
                <span>SAMPLE MAPPING</span>
                <span>SYSTEM</span>
              </div>

            </div>


            {/* Feature Cards */}
            <div className="bio-feature-grid">

              <div className="bio-feature-card">
                <div className="bio-feature-icon">
                  <i className="bx bx-box"></i>
                </div>

                <span>
                  Smart Storage<br />
                  Management
                </span>
              </div>


              <div className="bio-feature-card">
                <div className="bio-feature-icon">
                  <i className="bx bx-pulse"></i>
                </div>

                <span>
                  Real-time<br />
                  Monitoring
                </span>
              </div>


              <div className="bio-feature-card">
                <div className="bio-feature-icon">
                  <i className="bx bx-dna"></i>
                </div>

                <span>
                  100% Sample<br />
                  Traceability
                </span>
              </div>


              <div className="bio-feature-card">
                <div className="bio-feature-icon">
                  <i className="bx bx-shield-quarter"></i>
                </div>

                <span>
                  Secure &amp;<br />
                  Reliable
                </span>
              </div>

            </div>


            {/* Bottom Quote */}
            <p className="bio-auth-quote">
              "Preserving today's samples for tomorrow's breakthroughs."
            </p>

          </section>


          {/* =====================================================
                    RIGHT SIDE
                ===================================================== */}
          <section className="bio-auth-right">

            <div className="bio-login-card">

              {/* 
                            IMPORTANT:
                            Your existing Login page becomes the child.
                        */}
              {children}

            </div>

          </section>

        </div>

      </div>
    )
}