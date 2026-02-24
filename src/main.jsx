/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import PropTypes from 'prop-types'
import App from './App.jsx'
import { SettingsProvider } from './context/SettingsContext'
import { LocationProvider } from './context/LocationContext'
import './index.css'

function ErrorFallback({ error }) {
  return (
    <div role="alert" style={{ padding: '2rem', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2>Something went wrong:</h2>
      <pre style={{ color: 'red', background: '#f0f0f0', padding: '1rem', borderRadius: '4px', overflow: 'auto', maxWidth: '100%' }}>{error.message}</pre>
      <button style={{ marginTop: '1rem', padding: '0.5rem 1rem' }} onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  )
}

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SettingsProvider>
        <LocationProvider>
          <App />
        </LocationProvider>
      </SettingsProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
