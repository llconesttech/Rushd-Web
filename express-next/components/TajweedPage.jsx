import { useEffect } from 'react';
import { getTajweedRulesArray } from '../data/tajweedData';
import { parseTajweed } from '../utils/tajweedParser';
import PageHeader from './PageHeader';
import './TajweedPage.css';

const TajweedPage = () => {
    const rules = getTajweedRulesArray();

    useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, []);

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <PageHeader
                title="Tajweed Rules"
                subtitle="Guide to Quranic recitation rules and color codes"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Tajweed Rules', path: '/tajweed' }
                ]}
            />

            <div className="tajweed-grid">
                {rules.map((rule) => (
                    <div key={rule.css} id={`rule-${rule.css}`} className="tajweed-card">
                        <div className="tajweed-card-header">
                            <span
                                className="tajweed-color-badge"
                                style={{ backgroundColor: rule.color }}
                            />
                            <h3>{rule.label}</h3>
                        </div>
                        <div className="tajweed-card-body">
                            <p className="tajweed-description">
                                {rule.description}
                            </p>

                            <div className="tajweed-example-box">
                                <span className="example-label">Example:</span>
                                <div
                                    className={`quran-text-example tajweed-text`}
                                    dangerouslySetInnerHTML={{ __html: parseTajweed(rule.example || '') }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TajweedPage;
