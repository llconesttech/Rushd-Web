import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './PageHeader.css';

const PageHeader = ({ breadcrumbs = [], title, subtitle, actions }) => {
    // Determine back link (second to last item in breadcrumb, or home)
    const backLink = breadcrumbs.length > 1
        ? breadcrumbs[breadcrumbs.length - 2].path
        : '/';

    return (
        <div className="page-header">
            {/* Top Navigation Bar */}
            <div className="page-header-nav">
                <Link to={backLink} className="ph-back-btn" title="Go Back">
                    <ChevronLeft size={18} />
                </Link>
                <div style={{ width: '1px', height: '16px', background: 'var(--color-border)', margin: '0 0.5rem' }}></div>

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

            {/* Main Header Content */}
            <div className="page-header-content">
                <div className="ph-titles">
                    <h1 className="ph-title">{title}</h1>
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
