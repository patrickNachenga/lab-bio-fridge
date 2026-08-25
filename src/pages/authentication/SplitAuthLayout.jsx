import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './SplitAuthLayout.css'

export const SplitAuthLayout = ({ children }) => {
    // Carousel images - can be customized
    const images = [
        {
            src: '/assets/img/hospital-mohimbili.jpg',
            alt: 'Orphanage Care',
            title: 'Compassionate Care'
        },
        {
            src: '/assets/img/nembo.jpg',
            alt: 'Children Support',
            title: 'Building Futures'
        },
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            setImageLoaded(false);
        }, 6000); // Change image every 6 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <div className="split-auth-container">
            {/* Left Side - Login Form */}
            <div className="split-auth-form-section">
                <div className="form-scroll-wrapper">
                    <div className="auth-form-container">
                        {/* Brand Header */}
                        <div className="auth-brand-vertical">
                            <Link
                                aria-label="Go to Home Page"
                                to="/"
                                className="app-brand-link-vertical"
                            >
                                <span className="app-brand-logo-vertical auth-logo">
                                    <img
                                        src="/assets/img/nembo.jpg"
                                        alt="Stemenis Orphanage Logo"
                                        width={"70px"}
                                        height={"70px"}
                                    />
                                </span>
                                <div className="auth-brand-content-vertical">
                                    <span className="app-brand-text-vertical auth-brand-main">
                                        Stemenis
                                    </span>
                                    <span className="auth-brand-sub-vertical">Orphanage Center</span>
                                </div>
                            </Link>
                        </div>

                        {/* Form Content */}
                        <div className="auth-form-content">
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Image Carousel */}
            <div className="split-auth-image-section">
                {/* Image Carousel */}
                <div className="image-carousel">
                    <div className="carousel-image-wrapper">
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                className={`carousel-image ${index === currentImageIndex ? 'active' : ''} ${imageLoaded ? 'loaded' : ''}`}
                                onLoad={handleImageLoad}
                            />
                        ))}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="image-overlay"></div>

                    {/* Image Title */}
                    <div className="image-caption">
                        <h2 className="caption-title">
                            {images[currentImageIndex].title}
                        </h2>
                        <p className="caption-subtitle">
                            Dedicated to the wellbeing of every child
                        </p>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => {
                                    setCurrentImageIndex(index);
                                    setImageLoaded(false);
                                }}
                                aria-label={`Show image ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        className="carousel-nav carousel-nav-prev"
                        onClick={() => {
                            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
                            setImageLoaded(false);
                        }}
                        aria-label="Previous image"
                    >
                        <i className="bx bx-chevron-left"></i>
                    </button>
                    <button
                        className="carousel-nav carousel-nav-next"
                        onClick={() => {
                            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                            setImageLoaded(false);
                        }}
                        aria-label="Next image"
                    >
                        <i className="bx bx-chevron-right"></i>
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="image-section-decorations">
                    <div className="decoration-circle decoration-1"></div>
                    <div className="decoration-circle decoration-2"></div>
                    <div className="decoration-line"></div>
                </div>
            </div>

            {/* Mobile Indicator */}
            <div className="mobile-layout-indicator">
                <p>← Swipe to explore our mission →</p>
            </div>
        </div>
    );
}
