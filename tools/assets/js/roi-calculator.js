/**
 * Enhanced ROI Calculator with Multi-step Wizard
 * Provides comprehensive DevOps automation ROI analysis
 */

class ROICalculator {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.results = {};
        
        // Industry benchmarks for more accurate calculations
        this.benchmarks = {
            'pre-seed': { deploymentFreq: 0.5, automationAdoption: 0.2, failureRate: 0.25 },
            'seed': { deploymentFreq: 1, automationAdoption: 0.4, failureRate: 0.2 },
            'series-a': { deploymentFreq: 2, automationAdoption: 0.6, failureRate: 0.15 },
            'series-b': { deploymentFreq: 3, automationAdoption: 0.8, failureRate: 0.1 },
            'established': { deploymentFreq: 5, automationAdoption: 0.9, failureRate: 0.05 }
        };
        
        this.industryMultipliers = {
            'saas': 1.2,
            'fintech': 1.4,
            'ecommerce': 1.1,
            'healthcare': 1.3,
            'marketplace': 1.15,
            'gaming': 1.0,
            'other': 1.0
        };
        
        this.painPointImpacts = {
            'slow-deployments': { timeReduction: 0.7, priorityBoost: 1.2 },
            'frequent-failures': { reliabilityBoost: 0.8, priorityBoost: 1.3 },
            'manual-processes': { timeReduction: 0.6, priorityBoost: 1.1 },
            'poor-monitoring': { debugTimeReduction: 0.5, priorityBoost: 1.1 },
            'scaling-issues': { scalabilityBoost: 0.4, priorityBoost: 1.2 },
            'security-concerns': { securityBoost: 0.3, priorityBoost: 1.1 }
        };
        
        this.bindEvents();
    }

    init() {
        this.updateProgressBar();
        this.setupFormValidation();
        this.initializeAnalytics();
        console.log('ROI Calculator initialized');
    }

    bindEvents() {
        // Form submission prevention
        document.getElementById('roi-calculator-form').addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Input change tracking for analytics
        document.addEventListener('change', (e) => {
            if (e.target.form?.id === 'roi-calculator-form') {
                this.trackInputChange(e.target);
            }
        });

        // Auto-save form data
        document.addEventListener('input', (e) => {
            if (e.target.form?.id === 'roi-calculator-form') {
                this.saveFormData();
            }
        });

        // Load saved data on page load
        this.loadSavedData();
    }

    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }

        this.saveFormData();
        
        if (this.currentStep < this.totalSteps) {
            this.hideStep(this.currentStep);
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgressBar();
            
            // Track step progression
            this.trackStepProgression();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.hideStep(this.currentStep);
            this.currentStep--;
            this.showStep(this.currentStep, 'previous');
            this.updateProgressBar();
        }
    }

    hideStep(stepNumber) {
        const step = document.getElementById(`step-${stepNumber}`);
        if (step) {
            step.classList.remove('active');
        }
        
        // Update progress step
        const progressStep = document.querySelector(`.progress-step[data-step="${stepNumber}"]`);
        if (progressStep) {
            progressStep.classList.remove('active');
            progressStep.classList.add('completed');
        }
    }

    showStep(stepNumber, direction = 'next') {
        const step = document.getElementById(`step-${stepNumber}`);
        if (step) {
            step.classList.add('active');
            if (direction === 'previous') {
                step.classList.add('previous');
                setTimeout(() => step.classList.remove('previous'), 300);
            }
        }
        
        // Update progress step
        const progressStep = document.querySelector(`.progress-step[data-step="${stepNumber}"]`);
        if (progressStep) {
            progressStep.classList.add('active');
            progressStep.classList.remove('completed');
        }
        
        // Update progress connectors
        const connectors = document.querySelectorAll('.progress-connector');
        connectors.forEach((connector, index) => {
            if (index < stepNumber - 1) {
                connector.classList.add('completed');
            } else {
                connector.classList.remove('completed');
            }
        });
        
        // Scroll to top of calculator
        document.querySelector('.calculator-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        let isValid = true;
        let firstInvalidField = null;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            } else {
                this.clearFieldError(field);
            }
        });

        // Custom validation for specific fields
        if (this.currentStep === 1) {
            const teamSize = document.getElementById('team-size');
            if (teamSize.value && (parseInt(teamSize.value) < 1 || parseInt(teamSize.value) > 500)) {
                this.showFieldError(teamSize, 'Team size must be between 1 and 500');
                isValid = false;
            }
        }

        if (this.currentStep === 2) {
            const deploymentTime = document.getElementById('deployment-time');
            if (deploymentTime.value && (parseFloat(deploymentTime.value) < 0.25 || parseFloat(deploymentTime.value) > 40)) {
                this.showFieldError(deploymentTime, 'Deployment time must be between 0.25 and 40 hours');
                isValid = false;
            }
        }

        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: 0.8rem;
            margin-top: 0.5rem;
            display: block;
        `;
        
        field.style.borderColor = 'var(--color-error)';
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    calculateResults() {
        if (!this.validateCurrentStep()) {
            return;
        }

        this.saveFormData();
        this.collectFormData();
        this.performCalculations();
        this.displayResults();
        this.nextStep();
        this.trackCalculationCompletion();
    }

    collectFormData() {
        const form = document.getElementById('roi-calculator-form');
        const formData = new FormData(form);
        
        // Convert form data to object
        this.formData = {};
        for (let [key, value] of formData.entries()) {
            if (this.formData[key]) {
                // Handle multiple values (checkboxes)
                if (Array.isArray(this.formData[key])) {
                    this.formData[key].push(value);
                } else {
                    this.formData[key] = [this.formData[key], value];
                }
            } else {
                this.formData[key] = value;
            }
        }
        
        // Ensure pain-points is always an array
        if (!this.formData['pain-points']) {
            this.formData['pain-points'] = [];
        } else if (!Array.isArray(this.formData['pain-points'])) {
            this.formData['pain-points'] = [this.formData['pain-points']];
        }
    }

    performCalculations() {
        const data = this.formData;
        
        // Use the advanced ROI calculator for more comprehensive calculations
        if (typeof AdvancedROICalculator !== 'undefined') {
            this.advancedCalculator = new AdvancedROICalculator();
            
            // Transform form data to match advanced calculator inputs
            const transformedInputs = this.transformFormDataToAdvancedInputs(data);
            
            // Set input values programmatically
            Object.keys(transformedInputs).forEach(key => {
                const element = document.createElement('input');
                element.id = key;
                element.value = transformedInputs[key];
                // Temporarily add to DOM for calculator to read
                document.body.appendChild(element);
            });
            
            // Run advanced calculations
            this.advancedCalculator.calculateROI();
            const advancedResults = this.advancedCalculator.results;
            
            // Clean up temporary elements
            Object.keys(transformedInputs).forEach(key => {
                const element = document.getElementById(key);
                if (element) element.remove();
            });
            
            // Convert advanced results to our format and enhance with form context
            this.results = this.convertAdvancedResults(advancedResults, data);
        } else {
            // Fallback to basic calculations if advanced calculator not available
            this.performBasicCalculations(data);
        }
    }
    
    transformFormDataToAdvancedInputs(data) {
        const teamSize = parseInt(data['team-size']) || 3;
        const avgSalary = parseInt(data['avg-salary']) || 120000;
        const deploymentTime = parseFloat(data['deployment-time']) || 2;
        
        // Frequency conversion
        const frequencyMap = {
            'daily': 5,
            'few-per-week': 3,
            'weekly': 1,
            'bi-weekly': 0.5,
            'monthly': 0.25
        };
        const deploymentsPerWeek = frequencyMap[data['deployments-frequency']] || 1;
        
        // Revenue estimation based on company stage and monthly revenue
        const revenueEstimates = {
            '0-10k': 200,
            '10k-50k': 500,
            '50k-100k': 1000,
            '100k-500k': 2000,
            '500k-1m': 4000,
            '1m+': 8000
        };
        const revenuePerHour = revenueEstimates[data['monthly-revenue']] || 500;
        
        // Estimate downtime based on rollback frequency
        const downtimeMap = {
            'rarely': 1,
            'sometimes': 3,
            'often': 6,
            'frequently': 12
        };
        const downtimeHoursPerMonth = downtimeMap[data['rollback-frequency']] || 4;
        
        return {
            teamSize: teamSize,
            avgSalary: avgSalary,
            deploymentsPerWeek: deploymentsPerWeek,
            hoursPerDeployment: deploymentTime,
            downtimeHoursPerMonth: downtimeHoursPerMonth,
            revenuePerHour: revenuePerHour
        };
    }
    
    convertAdvancedResults(advancedResults, formData) {
        if (!advancedResults || !advancedResults.automatedSavings) {
            return this.performBasicCalculations(formData);
        }
        
        const automated = advancedResults.automatedSavings;
        const additional = advancedResults.additionalBenefits;
        const roi = advancedResults.roiMetrics;
        
        // Apply form-specific adjustments
        const painPoints = formData['pain-points'] || [];
        const stage = formData['company-stage'];
        const industry = formData['industry'];
        
        // Adjustment factors based on form context
        let contextMultiplier = 1.0;
        
        // Stage-based adjustments
        const stageMultipliers = {
            'pre-seed': 0.8,
            'seed': 0.9,
            'series-a': 1.0,
            'series-b': 1.1,
            'established': 1.2
        };
        contextMultiplier *= stageMultipliers[stage] || 1.0;
        
        // Industry adjustments  
        contextMultiplier *= this.industryMultipliers[industry] || 1.0;
        
        // Pain point urgency boost
        const urgentPainPoints = ['frequent-failures', 'slow-deployments', 'scaling-issues'];
        const hasUrgentPains = painPoints.some(pain => urgentPainPoints.includes(pain));
        if (hasUrgentPains) {
            contextMultiplier *= 1.15;
        }
        
        const adjustedAnnualSavings = Math.round(automated.totalAnnualSavings * contextMultiplier);
        const timeReductionPercentage = Math.min(95, Math.round(70 + (painPoints.length * 5))); // 70-95% based on pain points
        
        return {
            annualSavings: adjustedAnnualSavings,
            weeklySavings: Math.round(adjustedAnnualSavings / 52),
            timeReduction: timeReductionPercentage,
            productivityGain: Math.round((additional.additionalFeatureVelocity / automated.totalAnnualSavings) * 100),
            roiPercentage: Math.round(Math.max(roi.roiPercentage * contextMultiplier, 0)),
            breakdown: {
                deploymentSavings: Math.round(automated.deploymentTimeSavings * contextMultiplier),
                failureSavings: Math.round(automated.downtimeSavings * contextMultiplier),
                productivitySavings: Math.round(additional.additionalFeatureVelocity * contextMultiplier)
            },
            implementationCost: roi.averageProjectCost,
            paybackMonths: Math.max(1, Math.round(roi.paybackPeriodMonths)),
            threeYearROI: Math.round(roi.threeYearROI * contextMultiplier),
            netPresentValue: Math.round(roi.netPresentValue * contextMultiplier)
        };
    }
    
    performBasicCalculations(data) {
        // Original basic calculation logic as fallback
        const teamSize = parseInt(data['team-size']) || 3;
        const avgSalary = parseInt(data['avg-salary']) || 120000;
        const deploymentTime = parseFloat(data['deployment-time']) || 2;
        const hourlyRate = avgSalary / (52 * 40);
        
        const frequencyMap = {
            'daily': 5,
            'few-per-week': 3,
            'weekly': 1,
            'bi-weekly': 0.5,
            'monthly': 0.25
        };
        const deploymentsPerWeek = frequencyMap[data['deployments-frequency']] || 1;
        
        const rollbackMap = {
            'rarely': 0.05,
            'sometimes': 0.1,
            'often': 0.2,
            'frequently': 0.3
        };
        const rollbackRate = rollbackMap[data['rollback-frequency']] || 0.1;
        
        const stage = data['company-stage'];
        const industry = data['industry'];
        const stageMultiplier = this.benchmarks[stage]?.automationAdoption || 0.5;
        const industryMultiplier = this.industryMultipliers[industry] || 1.0;
        
        const weeklyDeploymentTime = deploymentsPerWeek * deploymentTime * teamSize;
        const weeklyRollbackTime = weeklyDeploymentTime * rollbackRate * 2;
        const totalWeeklyTime = weeklyDeploymentTime + weeklyRollbackTime;
        
        const painPoints = data['pain-points'] || [];
        let timeReductionFactor = 0.6;
        let reliabilityImprovement = 0.7;
        let productivityBoost = 0.3;
        
        painPoints.forEach(pain => {
            const impact = this.painPointImpacts[pain];
            if (impact) {
                if (impact.timeReduction) {
                    timeReductionFactor = Math.max(timeReductionFactor, impact.timeReduction);
                }
                if (impact.reliabilityBoost) {
                    reliabilityImprovement = Math.max(reliabilityImprovement, impact.reliabilityBoost);
                }
            }
        });
        
        timeReductionFactor *= industryMultiplier * (0.8 + stageMultiplier * 0.4);
        reliabilityImprovement *= industryMultiplier * (0.8 + stageMultiplier * 0.4);
        productivityBoost *= industryMultiplier * (0.7 + stageMultiplier * 0.6);
        
        const deploymentTimeSavings = weeklyDeploymentTime * timeReductionFactor * hourlyRate;
        const failureReductionSavings = weeklyRollbackTime * reliabilityImprovement * hourlyRate;
        const productivitySavings = (teamSize * 40 * hourlyRate) * productivityBoost * 0.2;
        
        const totalWeeklySavings = deploymentTimeSavings + failureReductionSavings + productivitySavings;
        const annualSavings = totalWeeklySavings * 52;
        
        const implementationCost = teamSize * 5000;
        const firstYearROI = ((annualSavings - implementationCost) / implementationCost) * 100;
        
        this.results = {
            annualSavings: Math.round(annualSavings),
            weeklySavings: Math.round(totalWeeklySavings),
            timeReduction: Math.round(timeReductionFactor * 100),
            productivityGain: Math.round(productivityBoost * 100),
            roiPercentage: Math.round(Math.max(firstYearROI, 0)),
            breakdown: {
                deploymentSavings: Math.round(deploymentTimeSavings * 52),
                failureSavings: Math.round(failureReductionSavings * 52),
                productivitySavings: Math.round(productivitySavings * 52)
            },
            implementationCost: implementationCost,
            paybackMonths: Math.max(1, Math.round(implementationCost / (totalWeeklySavings * 4.33)))
        };
    }

    displayResults() {
        const results = this.results;
        
        // Update summary cards
        document.getElementById('annual-savings').textContent = `$${results.annualSavings.toLocaleString()}`;
        document.getElementById('time-savings').textContent = `${results.timeReduction}%`;
        document.getElementById('productivity-gain').textContent = `${results.productivityGain}%`;
        document.getElementById('roi-percentage').textContent = `${results.roiPercentage}%`;
        
        // Update additional metrics if available
        if (document.getElementById('payback-period')) {
            const paybackText = results.paybackMonths === 1 ? '1 month' : `${results.paybackMonths} months`;
            document.getElementById('payback-period').textContent = paybackText;
        }
        
        if (document.getElementById('three-year-roi') && results.threeYearROI) {
            document.getElementById('three-year-roi').textContent = `$${results.threeYearROI.toLocaleString()}`;
        }
        
        // Update breakdown chart
        const maxSaving = Math.max(results.breakdown.deploymentSavings, results.breakdown.failureSavings, results.breakdown.productivitySavings);
        
        this.updateChartBar('deployment-savings', results.breakdown.deploymentSavings, maxSaving);
        this.updateChartBar('failure-savings', results.breakdown.failureSavings, maxSaving);
        this.updateChartBar('productivity-savings', results.breakdown.productivitySavings, maxSaving);
        
        // Generate timeline and recommendations
        this.generateImplementationTimeline();
        this.generateRecommendations();
        
        // Add personalized ROI recommendation
        this.displayPersonalizedRecommendation();
    }
    
    displayPersonalizedRecommendation() {
        const results = this.results;
        const data = this.formData;
        
        // Create or update recommendation element
        let recommendationEl = document.getElementById('personalized-recommendation');
        if (!recommendationEl) {
            recommendationEl = document.createElement('div');
            recommendationEl.id = 'personalized-recommendation';
            recommendationEl.className = 'roi-recommendation-enhanced';
            
            // Insert after results summary
            const resultsSummary = document.querySelector('.results-summary');
            if (resultsSummary && resultsSummary.parentNode) {
                resultsSummary.parentNode.insertBefore(recommendationEl, resultsSummary.nextSibling);
            }
        }
        
        let recommendation = '';
        let priority = '';
        
        if (results.paybackMonths <= 6) {
            priority = 'high';
            recommendation = `🚀 <strong>Immediate Action Recommended:</strong> With a payback period of just ${results.paybackMonths} months and ${results.roiPercentage}% first-year ROI, DevOps automation should be your top priority. You'll save $${Math.round(results.annualSavings / 12).toLocaleString()} per month once implemented.`;
        } else if (results.paybackMonths <= 12) {
            priority = 'medium';
            recommendation = `⚡ <strong>Strong Business Case:</strong> A ${results.paybackMonths}-month payback period delivers ${results.roiPercentage}% ROI in year one. Plan automation into your next quarterly roadmap to start realizing $${results.annualSavings.toLocaleString()} in annual savings.`;
        } else {
            priority = 'low';
            recommendation = `📊 <strong>Long-term Value:</strong> While the ${results.paybackMonths}-month payback requires patience, you'll still achieve ${results.roiPercentage}% ROI and significant operational improvements. Consider starting with high-impact, low-effort automation wins.`;
        }
        
        // Add industry-specific insights
        const industry = data['industry'];
        const industryInsights = {
            'fintech': 'Financial services companies typically see faster ROI due to regulatory compliance automation and critical uptime requirements.',
            'saas': 'SaaS businesses benefit most from deployment velocity improvements and reliability gains that directly impact customer retention.',
            'ecommerce': 'E-commerce platforms see immediate value from automated scaling during traffic spikes and reduced downtime costs.',
            'healthcare': 'Healthcare applications require high reliability and compliance automation, making DevOps investment particularly valuable.'
        };
        
        if (industryInsights[industry]) {
            recommendation += `<br><br><strong>Industry Insight:</strong> ${industryInsights[industry]}`;
        }
        
        recommendationEl.innerHTML = recommendation;
        recommendationEl.className = `roi-recommendation-enhanced priority-${priority}`;
        
        // Add some basic styling if not already present
        if (!document.querySelector('#enhanced-recommendation-styles')) {
            const style = document.createElement('style');
            style.id = 'enhanced-recommendation-styles';
            style.textContent = `
                .roi-recommendation-enhanced {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 1.5rem 0;
                    border-left: 4px solid #10b981;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .roi-recommendation-enhanced.priority-high {
                    border-left-color: #059669;
                    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
                }
                .roi-recommendation-enhanced.priority-medium {
                    border-left-color: #d97706;
                    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
                }
                .roi-recommendation-enhanced.priority-low {
                    border-left-color: #6b7280;
                    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                }
            `;
            document.head.appendChild(style);
        }
    }

    updateChartBar(id, value, maxValue) {
        const bar = document.getElementById(`${id}-bar`);
        const valueElement = document.getElementById(id);
        
        if (bar && valueElement) {
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            setTimeout(() => {
                bar.style.width = `${percentage}%`;
            }, 300);
            valueElement.textContent = `$${value.toLocaleString()}`;
        }
    }

    generateImplementationTimeline() {
        const timeline = document.getElementById('implementation-timeline');
        if (!timeline) return;
        
        const data = this.formData;
        const stage = data['company-stage'];
        const teamSize = parseInt(data['team-size']) || 3;
        
        // Timeline varies by company stage and complexity
        const timelineItems = [
            { week: 1, title: 'Assessment & Planning', description: 'Current state analysis and automation roadmap' },
            { week: 3, title: 'CI/CD Pipeline Setup', description: 'Automated build, test, and deployment pipeline' },
            { week: 5, title: 'Monitoring & Alerting', description: 'Observability stack and incident response' },
            { week: 8, title: 'Infrastructure as Code', description: 'Automated infrastructure provisioning' },
            { week: 12, title: 'Security & Compliance', description: 'Automated security scanning and compliance checks' }
        ];
        
        // Adjust timeline based on team size and stage
        const complexityMultiplier = stage === 'pre-seed' ? 0.8 : stage === 'established' ? 1.2 : 1.0;
        const teamMultiplier = teamSize < 5 ? 0.9 : teamSize > 15 ? 1.1 : 1.0;
        
        timeline.innerHTML = timelineItems.map(item => {
            const adjustedWeek = Math.round(item.week * complexityMultiplier * teamMultiplier);
            return `
                <div class="timeline-item">
                    <div class="timeline-marker">${adjustedWeek}</div>
                    <div class="timeline-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    generateRecommendations() {
        const recommendations = document.getElementById('recommendations-list');
        if (!recommendations) return;
        
        const data = this.formData;
        const painPoints = data['pain-points'] || [];
        const priorityGoal = data['priority-goal'];
        
        const allRecommendations = [
            {
                id: 'ci-cd',
                title: 'Implement CI/CD Pipeline',
                description: 'Automate your build, test, and deployment process for faster and more reliable releases.',
                impact: ['75% faster deployments', 'Reduced manual errors'],
                priority: 'high',
                triggers: ['slow-deployments', 'manual-processes'],
                goals: ['faster-delivery', 'team-productivity']
            },
            {
                id: 'monitoring',
                title: 'Set Up Comprehensive Monitoring',
                description: 'Implement observability stack with metrics, logs, and distributed tracing.',
                impact: ['50% faster debugging', 'Proactive issue detection'],
                priority: 'high',
                triggers: ['poor-monitoring', 'frequent-failures'],
                goals: ['better-reliability', 'team-productivity']
            },
            {
                id: 'iac',
                title: 'Infrastructure as Code',
                description: 'Manage infrastructure through code for consistency and scalability.',
                impact: ['Consistent environments', 'Easy scaling'],
                priority: 'medium',
                triggers: ['scaling-issues', 'manual-processes'],
                goals: ['scale-preparation', 'cost-reduction']
            },
            {
                id: 'security',
                title: 'Automated Security Scanning',
                description: 'Integrate security checks into your development pipeline.',
                impact: ['Early vulnerability detection', 'Compliance automation'],
                priority: 'medium',
                triggers: ['security-concerns'],
                goals: ['security-compliance']
            }
        ];
        
        // Score recommendations based on pain points and goals
        const scoredRecommendations = allRecommendations.map(rec => {
            let score = 0;
            
            // Check pain point alignment
            rec.triggers.forEach(trigger => {
                if (painPoints.includes(trigger)) {
                    score += rec.priority === 'high' ? 3 : 2;
                }
            });
            
            // Check goal alignment
            if (rec.goals.includes(priorityGoal)) {
                score += 2;
            }
            
            return { ...rec, score };
        });
        
        // Sort by score and take top 3
        const topRecommendations = scoredRecommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        
        recommendations.innerHTML = topRecommendations.map(rec => `
            <div class="recommendation-card">
                <div class="recommendation-priority">${rec.priority}</div>
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
                <div class="recommendation-impact">
                    ${rec.impact.map(impact => `
                        <div class="impact-item">
                            <span class="impact-dot"></span>
                            ${impact}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    downloadReport() {
        this.trackAction('download_report');
        
        // Show contact form for lead generation
        this.showContactForm();
    }

    bookConsultation() {
        this.trackAction('book_consultation');
        
        // Redirect to booking page or show contact form
        window.open('https://calendly.com/resiliotech/consultation', '_blank');
    }

    shareResults() {
        this.trackAction('share_results');
        
        const results = this.results;
        const shareText = `I could save $${results.annualSavings.toLocaleString()} annually with DevOps automation! Calculate your savings: ${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'DevOps ROI Calculator Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback to copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Results copied to clipboard!');
            });
        }
    }

    showContactForm() {
        const contactStep = document.getElementById('step-contact');
        const resultsStep = document.getElementById('step-4');
        
        if (contactStep && resultsStep) {
            resultsStep.style.display = 'none';
            contactStep.style.display = 'block';
        }
    }

    backToResults() {
        const contactStep = document.getElementById('step-contact');
        const resultsStep = document.getElementById('step-4');
        
        if (contactStep && resultsStep) {
            contactStep.style.display = 'none';
            resultsStep.style.display = 'block';
        }
    }

    submitCalculator() {
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const company = document.getElementById('contact-company').value;
        const role = document.getElementById('contact-role').value;
        const consultationInterest = document.getElementById('consultation-interest').checked;
        
        if (!name || !email || !company || !role) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Prepare submission data
        const submissionData = {
            ...this.formData,
            contact: { name, email, company, role, consultationInterest },
            results: this.results,
            timestamp: new Date().toISOString(),
            source: 'roi-calculator'
        };
        
        // Submit to backend (if available) or trigger lead magnet
        this.submitToBackend(submissionData);
        
        // Track conversion
        this.trackConversion(submissionData);
        
        // Show success state
        this.showSuccessState();
    }

    submitToBackend(data) {
        // This would integrate with your CRM/email system
        // For now, we'll use local storage and analytics
        
        fetch('/api/roi-calculator-submission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(error => {
            console.log('Backend submission failed, using fallback');
            localStorage.setItem('roi-calculator-lead', JSON.stringify(data));
        });
    }

    showSuccessState() {
        const contactStep = document.getElementById('step-contact');
        if (contactStep) {
            contactStep.innerHTML = `
                <div class="success-state">
                    <div class="success-icon">✅</div>
                    <h2>Thank you!</h2>
                    <p>Your personalized ROI report is being generated and will be sent to your email within 5 minutes.</p>
                    <div class="success-actions">
                        <a href="/resources/gated-resources" class="btn btn-primary">Browse More Resources</a>
                        <a href="/" class="btn btn-outline">Back to Home</a>
                    </div>
                </div>
            `;
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--color-error)' : 'var(--color-success)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    saveFormData() {
        const form = document.getElementById('roi-calculator-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('roi-calculator-progress', JSON.stringify({
            currentStep: this.currentStep,
            formData: data
        }));
    }

    loadSavedData() {
        const saved = localStorage.getItem('roi-calculator-progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                // Restore form values
                Object.entries(data.formData).forEach(([key, value]) => {
                    const field = document.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = true;
                        } else {
                            field.value = value;
                        }
                    }
                });
                
                // Don't restore step progress to avoid confusion
                console.log('Form data restored from previous session');
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }

    setupFormValidation() {
        // Real-time validation feedback
        const inputs = document.querySelectorAll('#roi-calculator-form input, #roi-calculator-form select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.required && !input.value.trim()) {
                    this.showFieldError(input, 'This field is required');
                } else {
                    this.clearFieldError(input);
                }
            });
        });
    }

    initializeAnalytics() {
        // Track calculator start
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('roi_calculator_started', {
                timestamp: new Date().toISOString(),
                source: document.referrer || 'direct'
            });
        }
    }

    trackInputChange(field) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('calculator_input_change', {
                field: field.name,
                step: this.currentStep,
                timestamp: new Date().toISOString()
            });
        }
    }

    trackStepProgression() {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('calculator_step_completed', {
                step: this.currentStep - 1,
                nextStep: this.currentStep,
                timestamp: new Date().toISOString()
            });
        }
    }

    trackCalculationCompletion() {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('calculator_completed', {
                results: this.results,
                formData: this.formData,
                timestamp: new Date().toISOString()
            });
        }
    }

    trackAction(action) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(`calculator_${action}`, {
                results: this.results,
                timestamp: new Date().toISOString()
            });
        }
    }

    trackConversion(data) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('calculator_conversion', {
                contact: data.contact,
                results: data.results,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Global functions for HTML onclick handlers
function nextStep() {
    if (window.roiCalculator) {
        window.roiCalculator.nextStep();
    }
}

function previousStep() {
    if (window.roiCalculator) {
        window.roiCalculator.previousStep();
    }
}

function calculateResults() {
    if (window.roiCalculator) {
        window.roiCalculator.calculateResults();
    }
}

function downloadReport() {
    if (window.roiCalculator) {
        window.roiCalculator.downloadReport();
    }
}

function bookConsultation() {
    if (window.roiCalculator) {
        window.roiCalculator.bookConsultation();
    }
}

function shareResults() {
    if (window.roiCalculator) {
        window.roiCalculator.shareResults();
    }
}

function backToResults() {
    if (window.roiCalculator) {
        window.roiCalculator.backToResults();
    }
}

function submitCalculator() {
    if (window.roiCalculator) {
        window.roiCalculator.submitCalculator();
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.roiCalculator = new ROICalculator();
    window.roiCalculator.init();
});