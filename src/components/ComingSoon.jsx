import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Construction, Mic, Map, BookOpen, Clock } from 'lucide-react';
import './ComingSoon.css';

const ComingSoon = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine title based on path
    const getPageDetails = () => {
        const path = location.pathname;
        if (path.includes('hajj')) return { title: 'Hajj Guide', icon: <Construction size={48} /> };
        if (path.includes('umrah')) return { title: 'Umrah Guide', icon: <Construction size={48} /> };
        if (path.includes('hajj-duas')) return { title: 'Hajj & Umrah Duas', icon: <BookOpen size={48} /> };
        if (path.includes('packing')) return { title: 'Packing Checklist', icon: <Clock size={48} /> };
        if (path.includes('audio')) return { title: 'Audio Recitation', icon: <Mic size={48} /> };
        return { title: 'Feature', icon: <Construction size={48} /> };
    };

    const { title, icon } = getPageDetails();

    return (
        <div className="coming-soon-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                <span>Go Back</span>
            </button>

            <div className="coming-soon-card">
                <div className="coming-soon-icon">
                    {icon}
                </div>
                <h1 className="coming-soon-title">{title}</h1>
                <p className="coming-soon-message">
                    We're working hard to bring you the best {title.toLowerCase()} experience.
                    This feature is coming very soon!
                </p>
                <div className="coming-soon-badge">
                    Under Development
                </div>

                <div className="coming-soon-decoration">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
