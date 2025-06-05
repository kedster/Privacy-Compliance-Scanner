        class PrivacyScanner {
            constructor() {
                this.regulations = {
                    gdpr: 'General Data Protection Regulation',
                    ccpa: 'California Consumer Privacy Act',
                    coppa: 'Children\'s Online Privacy Protection Act',
                    pipeda: 'Personal Information Protection and Electronic Documents Act'
                };
                
                this.violations = [];
                this.currentFilter = 'all';
                this.init();
            }

            init() {
                this.createFloatingParticles();
                this.bindEvents();
            }

            createFloatingParticles() {
                const container = document.getElementById('particles');
                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 6 + 's';
                    particle.style.animationDuration = (6 + Math.random() * 4) + 's';
                    container.appendChild(particle);
                }
            }

            bindEvents() {
                document.getElementById('scanBtn').addEventListener('click', () => this.scanWebsite());
                document.getElementById('urlInput').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.scanWebsite();
                });

                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
                });
            }

            setFilter(filter) {
                this.currentFilter = filter;
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
                this.renderViolations();
            }

            async scanWebsite() {
                const url = document.getElementById('urlInput').value.trim();
                if (!this.isValidUrl(url)) {
                    alert('Please enter a valid URL (e.g., https://example.com)');
                    return;
                }

                this.showLoading();
                
                // Simulate scanning delay
                await this.sleep(2000);
                
                this.violations = this.generateMockViolations(url);
                this.displayResults();
            }

            isValidUrl(string) {
                try {
                    new URL(string);
                    return true;
                } catch (_) {
                    return false;
                }
            }

            showLoading() {
                document.getElementById('loading').classList.add('active');
                document.getElementById('results').classList.remove('active');
            }

            hideLoading() {
                document.getElementById('loading').classList.remove('active');
            }

            sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            generateMockViolations(url) {
                const domain = new URL(url).hostname;
                
                const possibleViolations = [
                    {
                        title: 'Missing Cookie Consent Banner',
                        description: 'No explicit cookie consent mechanism detected. Users must be informed about cookie usage.',
                        severity: 'critical',
                        regulation: 'gdpr',
                        recommendation: 'Implement a clear cookie consent banner before setting any non-essential cookies.'
                    },
                    {
                        title: 'Privacy Policy Not Found',
                        description: 'No privacy policy link found in footer or header. Required for data collection.',
                        severity: 'critical',
                        regulation: 'gdpr',
                        recommendation: 'Add a comprehensive privacy policy that details data collection and usage practices.'
                    },
                    {
                        title: 'Third-party Tracking Scripts',
                        description: 'Multiple analytics and tracking scripts detected without explicit user consent.',
                        severity: 'warning',
                        regulation: 'gdpr',
                        recommendation: 'Require consent before loading tracking scripts or use privacy-friendly alternatives.'
                    },
                    {
                        title: 'Google Analytics Without Anonymization',
                        description: 'Google Analytics detected without IP anonymization enabled.',
                        severity: 'warning',
                        regulation: 'gdpr',
                        recommendation: 'Enable IP anonymization in Google Analytics or use cookieless tracking.'
                    },
                    {
                        title: 'Social Media Widgets',
                        description: 'Social media buttons that track users without consent detected.',
                        severity: 'warning',
                        regulation: 'gdpr',
                        recommendation: 'Use privacy-friendly social sharing buttons or load them only after consent.'
                    },
                    {
                        title: 'No Data Deletion Option',
                        description: 'No mechanism found for users to request data deletion.',
                        severity: 'critical',
                        regulation: 'ccpa',
                        recommendation: 'Implement a "Do Not Sell My Personal Information" link and data deletion process.'
                    },
                    {
                        title: 'Missing Age Verification',
                        description: 'Site appears to target minors but lacks age verification mechanisms.',
                        severity: 'critical',
                        regulation: 'coppa',
                        recommendation: 'Implement age verification if collecting data from users under 13.'
                    },
                    {
                        title: 'Insecure Data Transmission',
                        description: 'Some forms detected that may not use HTTPS encryption.',
                        severity: 'critical',
                        regulation: 'pipeda',
                        recommendation: 'Ensure all data collection forms use HTTPS encryption.'
                    },
                    {
                        title: 'Unclear Data Retention Policy',
                        description: 'Data retention periods not clearly specified in privacy documentation.',
                        severity: 'warning',
                        regulation: 'gdpr',
                        recommendation: 'Specify clear data retention periods and automatic deletion schedules.'
                    },
                    {
                        title: 'No Opt-out Mechanism',
                        description: 'Users cannot easily opt out of data collection and marketing.',
                        severity: 'warning',
                        regulation: 'ccpa',
                        recommendation: 'Provide clear opt-out options for data collection and sale.'
                    }
                ];

                // Randomly select 4-8 violations
                const numViolations = Math.floor(Math.random() * 5) + 4;
                const selectedViolations = [];
                
                while (selectedViolations.length < numViolations) {
                    const violation = possibleViolations[Math.floor(Math.random() * possibleViolations.length)];
                    if (!selectedViolations.find(v => v.title === violation.title)) {
                        selectedViolations.push(violation);
                    }
                }

                return selectedViolations;
            }

            calculateScore() {
                const critical = this.violations.filter(v => v.severity === 'critical').length;
                const warnings = this.violations.filter(v => v.severity === 'warning').length;
                
                let score = 100 - (critical * 20) - (warnings * 10);
                score = Math.max(score, 0);
                
                return {
                    score,
                    label: score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Needs Work' : 'Critical',
                    class: score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'warning' : 'critical'
                };
            }

            displayResults() {
                this.hideLoading();
                
                const scoreData = this.calculateScore();
                const scoreCard = document.getElementById('scoreCard');
                
                document.getElementById('scoreNumber').textContent = scoreData.score;
                document.getElementById('scoreLabel').textContent = `${scoreData.label} Privacy Score`;
                
                scoreCard.className = `score-card score-${scoreData.class}`;
                
                // Update stats
                const critical = this.violations.filter(v => v.severity === 'critical').length;
                const warnings = this.violations.filter(v => v.severity === 'warning').length;
                
                document.getElementById('criticalCount').textContent = critical;
                document.getElementById('warningCount').textContent = warnings;
                document.getElementById('cookiesCount').textContent = Math.floor(Math.random() * 15) + 5;
                document.getElementById('scriptsCount').textContent = Math.floor(Math.random() * 10) + 3;
                
                this.renderViolations();
                document.getElementById('results').classList.add('active');
            }

            renderViolations() {
                const grid = document.getElementById('violationsGrid');
                grid.innerHTML = '';
                
                const filteredViolations = this.currentFilter === 'all' 
                    ? this.violations 
                    : this.violations.filter(v => v.regulation === this.currentFilter);
                
                filteredViolations.forEach(violation => {
                    const card = document.createElement('div');
                    card.className = `violation-card violation-${violation.severity}`;
                    
                    card.innerHTML = `
                        <div class="violation-regulation">${this.regulations[violation.regulation]}</div>
                        <div class="violation-title">${violation.title}</div>
                        <div class="violation-desc">${violation.description}</div>
                        <div class="recommendation">
                            <div class="recommendation-title">💡 Recommendation</div>
                            <div>${violation.recommendation}</div>
                        </div>
                    `;
                    
                    grid.appendChild(card);
                });
                
                if (filteredViolations.length === 0) {
                    grid.innerHTML = '<div style="text-align: center; color: #888; grid-column: 1 / -1;">No violations found for the selected regulation.</div>';
                }
            }
        }

        // Initialize the scanner when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new PrivacyScanner();
        });