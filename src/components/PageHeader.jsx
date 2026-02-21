import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './PageHeader.css';

const PageHeader = ({ breadcrumbs = [], title, subtitle, badge, actions, isScrolled: externalIsScrolled }) => {
    const backLink = breadcrumbs.length > 1
        ? breadcrumbs[breadcrumbs.length - 2].path
        : '/';

    const [internalIsScrolled, setInternalIsScrolled] = React.useState(false);
    const isScrolled = externalIsScrolled !== undefined ? externalIsScrolled : internalIsScrolled;

    React.useEffect(() => {
        if (externalIsScrolled !== undefined) return; // Skip internal logic if controlled externally

        const scroller = document.querySelector('.reader-main-content') || window;
        const handleScroll = () => {
            const scrollTop = scroller === window ? window.scrollY : scroller.scrollTop;
            setInternalIsScrolled(prev => {
                // The header physically shrinks by ~50-60px. 
                // Setting the gap to 100px (120 - 20) ensures no layout thrashing loops.
                if (!prev && scrollTop > 120) return true;
                if (prev && scrollTop < 20) return false;
                return prev;
            });
        };

        scroller.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => scroller.removeEventListener('scroll', handleScroll);
    }, [externalIsScrolled]);

    return (
        <div className={`page-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="page-header-nav">
                <Link to={backLink} className="ph-back-btn" title="Go Back">
                    <ChevronLeft size={18} />
                </Link>

                <nav className="ph-breadcrumbs">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <React.Fragment key={index}>
                                {index > 0 && <ChevronRight size={14} className="ph-crumb-separator" />}
                                {isLast ? (
                                    <span className="ph-crumb-current">{crumb.label}</span>
                                ) : (
                                    <Link to={crumb.path} className="ph-crumb-link">
                                        {crumb.label}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </div>

            <div className="page-header-content">
                <div className="ph-titles">
                    <h1 className="ph-title">
                        {title}
                        {badge && <span className="ph-title-badge">{badge}</span>}
                    </h1>
                    {subtitle && <p className="ph-subtitle">{subtitle}</p>}
                </div>

                {actions && (
                    <div className="ph-actions">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
