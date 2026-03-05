'use client';
import { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import './PrivacyPolicy.css';

const AndroidContent = () => (
    <>
        <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
                Rushd ("we", "our", "the app") is an Islamic companion app developed by
                Onest Tech. We are committed to protecting your privacy. This policy
                explains what data is collected, why it is collected, and how it is used
                when you use the Rushd app on Android.
            </p>
            <p>By using Rushd, you agree to the practices described in this policy.</p>
        </section>

        <section className="privacy-section">
            <h2>2. Data We Collect</h2>

            <h3>2a. Location Data</h3>
            <p>Rushd requests access to your device's GPS location for two purposes:</p>
            <ul>
                <li>
                    <strong>Prayer times &amp; Qibla direction</strong> — Your coordinates are
                    sent to the <a href="https://aladhan.com" target="_blank" rel="noopener noreferrer">Aladhan API</a> to
                    calculate accurate prayer times for your area. Your location is <strong>not stored</strong> on our
                    servers after this calculation.
                </li>
                <li>
                    <strong>Pilgrim Finder (opt-in)</strong> — If you join a Hajj/Umrah group,
                    your live GPS location is shared with your group members via Firebase
                    Realtime Database. This is strictly opt-in, visible only to your group,
                    and deleted when you leave or dissolve the group.
                </li>
            </ul>

            <h3>2b. Microphone</h3>
            <p>
                The microphone is used exclusively for <strong>voice messages</strong> in
                the Pilgrim Finder group chat feature. Audio is only recorded when you
                actively press the record button. Voice messages are transmitted to Firebase
                Storage and are only accessible to members of your Pilgrim group.
            </p>

            <h3>2c. Camera</h3>
            <p>
                The camera is used to <strong>scan QR codes</strong> for joining Pilgrim
                Finder groups. No photos or videos are captured, stored, or transmitted.
            </p>

            <h3>2d. Analytics Data (Firebase Analytics)</h3>
            <p>
                We use <strong>Firebase Analytics</strong> (Google LLC) to collect
                anonymous, aggregated usage data to help us improve the app:
            </p>
            <ul>
                <li>Which features are used (Prayer Times, Quran, Qibla, Duas, etc.)</li>
                <li>App session duration and screen views</li>
                <li>Device type, Android version, and country (region-level only)</li>
                <li>App version and language setting</li>
            </ul>
            <p>
                <strong>No personally identifiable information (PII) is collected.</strong>{' '}
                Analytics data is anonymous and cannot be used to identify you as an individual.
            </p>

            <h3>2e. Crash Reports (Firebase Crashlytics)</h3>
            <p>
                We use <strong>Firebase Crashlytics</strong> (Google LLC) to automatically
                collect crash reports when the app closes unexpectedly. Each report contains:
            </p>
            <ul>
                <li>Device model and Android version</li>
                <li>App version at time of crash</li>
                <li>Technical stack trace (code location of the error)</li>
                <li>Date and time of the crash</li>
            </ul>
            <p>
                Crash reports do <strong>not</strong> contain your personal data, location,
                prayer history, Quran progress, or any content you have entered.
            </p>

            <h3>2f. Push Notifications (Firebase Cloud Messaging)</h3>
            <p>
                If you enable notifications, Firebase Cloud Messaging (FCM) delivers
                Dua reminders, Azan alerts, and Pilgrim group messages to your device.
                FCM uses a temporary device token to route notifications. This token is
                not linked to your personal identity and is not shared with third parties.
            </p>

            <h3>2g. Local Storage (On-Device Only)</h3>
            <p>The following data is stored <strong>only on your device</strong> and
                is never transmitted to any server:</p>
            <ul>
                <li>Quran reading progress and bookmarks</li>
                <li>Daily tracker entries (prayers, fasting, Quran reading)</li>
                <li>Tasbih counter history</li>
                <li>App preferences and settings</li>
                <li>Zakat calculation results</li>
                <li>Downloaded audio recitations</li>
            </ul>
        </section>

        <section className="privacy-section">
            <h2>3. Third-Party Services</h2>
            <p>Rushd integrates the following third-party services:</p>

            <table className="permissions-table">
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Purpose</th>
                        <th>Data Sent</th>
                        <th>Privacy Policy</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Firebase Analytics</td>
                        <td>Anonymous app usage analytics</td>
                        <td>Anonymous events, device type, OS version</td>
                        <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a></td>
                    </tr>
                    <tr>
                        <td>Firebase Crashlytics</td>
                        <td>Crash reporting</td>
                        <td>Device model, OS version, stack trace</td>
                        <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a></td>
                    </tr>
                    <tr>
                        <td>Firebase Cloud Messaging</td>
                        <td>Push notifications</td>
                        <td>Device push token (anonymous)</td>
                        <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a></td>
                    </tr>
                    <tr>
                        <td>Firebase Realtime Database</td>
                        <td>Pilgrim Finder live GPS (opt-in)</td>
                        <td>GPS coordinates (group members only)</td>
                        <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a></td>
                    </tr>
                    <tr>
                        <td>Firebase Authentication</td>
                        <td>Pilgrim group identity</td>
                        <td>Anonymous device ID within group session</td>
                        <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a></td>
                    </tr>
                    <tr>
                        <td>Aladhan API</td>
                        <td>Prayer time calculation</td>
                        <td>GPS coordinates (not stored)</td>
                        <td><a href="https://aladhan.com/privacy-policy" target="_blank" rel="noopener noreferrer">Aladhan</a></td>
                    </tr>
                    <tr>
                        <td>Quran.com API</td>
                        <td>Quran text and audio</td>
                        <td>No personal data</td>
                        <td><a href="https://quran.com/privacy-policy" target="_blank" rel="noopener noreferrer">Quran.com</a></td>
                    </tr>
                    <tr>
                        <td>Google Fonts</td>
                        <td>Arabic typography</td>
                        <td>No personal data</td>
                        <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a></td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section className="privacy-section">
            <h2>4. Data Retention</h2>
            <ul>
                <li><strong>Firebase Analytics &amp; Crashlytics</strong> — data retained by Google for up to 14 months per their standard policy</li>
                <li><strong>Pilgrim Finder location data</strong> — deleted immediately when you leave or dissolve a group</li>
                <li><strong>On-device data</strong> — retained until you clear app data or uninstall the app</li>
            </ul>
        </section>

        <section className="privacy-section">
            <h2>5. How to Opt Out of Analytics</h2>
            <p>You can disable anonymous analytics collection at any time:</p>
            <ul>
                <li><strong>Android:</strong> Go to <em>Settings → Google → Ads → Delete advertising ID</em> or disable "Usage &amp; diagnostics" in Android settings</li>
                <li><strong>Uninstalling</strong> the app stops all data collection immediately</li>
            </ul>
        </section>

        <section className="privacy-section">
            <h2>6. Children's Privacy</h2>
            <p>
                Rushd does not knowingly collect personally identifiable information from
                children under 13. The app contains no child-directed content. If you
                believe a child has provided personal data through the app, contact us at{' '}
                <a href="mailto:support@onesttech.com">support@onesttech.com</a>{' '}
                and we will delete it promptly.
            </p>
        </section>

        <section className="privacy-section">
            <h2>7. Your Rights</h2>
            <p>
                Depending on your location, you may have rights under GDPR (EU/UK),
                CCPA (California), or other applicable data protection laws, including:
            </p>
            <ul>
                <li>The right to know what data is collected about you</li>
                <li>The right to request deletion of your data</li>
                <li>The right to opt out of data collection</li>
                <li>The right to lodge a complaint with a supervisory authority</li>
            </ul>
            <p>
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:support@onesttech.com">support@onesttech.com</a>.
            </p>
        </section>

        <section className="privacy-section">
            <h2>8. Changes to This Policy</h2>
            <p>
                We may update this privacy policy from time to time. When we do, we will
                update the "Last Updated" date at the top. Continued use of the app after
                changes constitutes acceptance of the updated policy.
            </p>
        </section>

        <section className="privacy-section">
            <h2>9. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy or the app's data practices, please contact us at:</p>
            <div className="contact-box">
                <p><strong>Email:</strong> <a href="mailto:support@onesttech.com">support@onesttech.com</a></p>
                <p><strong>Website:</strong> <a href="https://rushd.onesttech.com" target="_blank" rel="noopener noreferrer">https://rushd.onesttech.com</a></p>
            </div>
        </section>
    </>
);

const IOSContent = () => (
    <>
        <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>Welcome to <strong>Rushd</strong>. We are committed to protecting your personal information and your
                right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when
                you use our mobile application.</p>
            <p>By using the App, you agree to the collection and use of information in accordance with this policy.</p>
        </section>

        <section className="privacy-section">
            <h2>2. Data We Collect &amp; Usage</h2>
            <p>We believe in privacy by design. Our app is built to function with minimal data collection.</p>

            <h3>Location Data</h3>
            <p>Rushd may request access to your device's location (GPS). This is strictly used for:</p>
            <ul>
                <li><strong>Prayer Times:</strong> To calculate accurate prayer times based on your local sunrise and sunset.</li>
                <li><strong>Qibla Direction:</strong> To determine the direction of the Qibla (Mecca) from your current position.</li>
            </ul>
            <p><strong>Important:</strong> Your location data is processed <strong>locally on your device</strong>. We
                do not transmit, store, or share your location history with our servers or any third parties.</p>

            <h3>Device Sensors</h3>
            <p>We use your device's compass and accelerometer sensors solely to facilitate the functioning of the Qibla
                compass feature.</p>

            <h3>Personal Progress Data</h3>
            <p>If you use the Daily Tracker or Quran reading features, the app stores your progress (e.g., fasting
                status, daily prayers performed, reading history) locally on your device. This data is for your personal
                tracking only and is not shared.</p>
        </section>

        <section className="privacy-section">
            <h2>3. Local Storage</h2>
            <p>The app uses local storage technologies (such as Shared Preferences and Hive) to save your personal
                preferences on your device, including:</p>
            <ul>
                <li>Settings (e.g., calculation methods, language preferences).</li>
                <li>Daily tracking logs and statistics.</li>
                <li>Saved bookmarks or reading progress in the Quran.</li>
                <li>Downloaded recitations for offline use.</li>
            </ul>
            <p>This data remains on your device and is not synchronized with any external server unless you explicitly
                use a backup feature (if available).</p>
        </section>

        <section className="privacy-section">
            <h2>4. Analytics &amp; Crash Reporting (Firebase)</h2>
            <p>
                Rushd uses <strong>Firebase Analytics</strong> and <strong>Firebase Crashlytics</strong>, services provided by Google LLC,
                to help us understand how the app is used and to diagnose crashes.
            </p>

            <h3>Firebase Analytics</h3>
            <p>Firebase Analytics collects <strong>anonymous, aggregated</strong> usage data including:</p>
            <ul>
                <li>Which features are used (e.g. Prayer Times, Quran, Qibla, Duas)</li>
                <li>App session duration and screen views</li>
                <li>Device type, operating system version, and country (region-level only)</li>
                <li>App version and language preference</li>
            </ul>
            <p>
                <strong>No personally identifiable information (PII) is collected.</strong>{' '}
                We do not collect your name, email, phone number, or any unique identifier
                linked to you personally. Analytics data cannot be used to identify you as
                an individual.
            </p>

            <h3>Firebase Crashlytics</h3>
            <p>Firebase Crashlytics automatically collects crash reports when the app unexpectedly closes. Each report contains:</p>
            <ul>
                <li>Device model and iOS/Android version</li>
                <li>App version at the time of the crash</li>
                <li>A technical stack trace (code location of the error)</li>
                <li>Date and time of the crash</li>
            </ul>
            <p>Crash reports do <strong>not</strong> contain your personal data, location, prayer times, Quran reading history, or any content you have entered in the app.</p>

            <h3>Firebase Cloud Messaging (Push Notifications)</h3>
            <p>
                If you enable notifications, Firebase Cloud Messaging (FCM) is used to
                deliver Dua reminders and Azan alerts. FCM uses a temporary,
                device-generated token to route notifications to your device. This token
                is not linked to your identity and is not shared with third parties.
            </p>

            <h3>Pilgrim Finder — Real-Time Location Sharing</h3>
            <p>
                The Pilgrim Finder feature allows Hajj/Umrah group members to share their
                live GPS location with each other through Firebase Realtime Database. <strong>This is strictly opt-in.</strong> Location data:
            </p>
            <ul>
                <li>Is only shared when you are an active member of a Pilgrim group</li>
                <li>Is only visible to members of your specific group</li>
                <li>Is automatically deleted when you leave or dissolve the group</li>
                <li>Is never used for advertising or sold to any third party</li>
            </ul>

            <h3>Google's Privacy Policy</h3>
            <p>
                Firebase is operated by Google LLC. For details on how Google handles
                data collected via Firebase, see{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.
            </p>
            <p>
                You can opt out of Firebase Analytics data collection by disabling
                "Share iPhone Analytics" in your iOS Settings → Privacy &amp; Security →
                Analytics &amp; Improvements.
            </p>
        </section>

        <section className="privacy-section">
            <h2>5. Data Retention</h2>
            <p>
                Anonymous analytics and crash report data is retained by Firebase for
                up to 14 months, in line with Google's standard retention policy.
                No user-identifiable data is retained by Rushd beyond your device's
                local storage.
            </p>
        </section>

        <section className="privacy-section">
            <h2>6. Your Rights (GDPR / International Users)</h2>
            <p>If you are located in the European Economic Area, UK, or other regions with data protection laws, you have the right to:</p>
            <ul>
                <li>Access information about what anonymous data has been collected</li>
                <li>Request deletion of any data associated with your use of the app</li>
                <li>Opt out of analytics collection at any time via device settings</li>
            </ul>
            <p>
                To exercise these rights, contact us at{' '}
                <a href="mailto:support@onesttech.com">support@onesttech.com</a>.
            </p>
        </section>

        <section className="privacy-section">
            <h2>7. Children's Privacy</h2>
            <p>Our services are safe for all ages. We do not knowingly collect personally identifiable information from
                children under the age of 13. Since we do not collect personal usage data, our app is suitable for
                families.</p>
        </section>

        <section className="privacy-section">
            <h2>8. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. Thus, you are advised to review this page
                periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on
                this page.</p>
        </section>

        <section className="privacy-section">
            <h2>9. Contact Us</h2>
            <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:</p>
            <div className="contact-box">
                <p><a href="mailto:support@onesttech.com">support@onesttech.com</a></p>
            </div>
        </section>
    </>
);

const PrivacyPolicy = () => {
    const [platform, setPlatform] = useState('ios');

    return (
        <div className="privacy-policy-page">
            <div className="privacy-header">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: February 27, 2026</p>
            </div>

            <div className="platform-tabs">
                <button
                    className={`platform-tab ${platform === 'ios' ? 'active' : ''}`}
                    onClick={() => setPlatform('ios')}
                >
                    <Smartphone size={18} />
                    iOS
                </button>
                <button
                    className={`platform-tab ${platform === 'android' ? 'active' : ''}`}
                    onClick={() => setPlatform('android')}
                >
                    <Smartphone size={18} />
                    Android
                </button>
                <button
                    className={`platform-tab ${platform === 'web' ? 'active' : ''}`}
                    onClick={() => setPlatform('web')}
                >
                    <Monitor size={18} />
                    Web
                </button>
            </div>

            {platform === 'android' && <AndroidContent />}
            {platform === 'ios' && <IOSContent />}
            {platform === 'web' && (
                <>
                    <section className="privacy-section">
                        <h2>Web Privacy</h2>
                        <p>The Rushd web application does not collect any personal data. All Quran reading progress, preferences, and settings are stored locally in your browser using localStorage.</p>
                        <p>No cookies, tracking pixels, or third-party analytics are used on the web version. The web app makes API calls to our server for Quran text, Hadith, and audio content — these requests are authenticated via HMAC tokens and do not transmit any personal information.</p>
                        <p>For any questions, contact us at <a href="mailto:support@onesttech.com">support@onesttech.com</a>.</p>
                    </section>
                </>
            )}
        </div>
    );
};

export default PrivacyPolicy;
