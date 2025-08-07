/**
 * Advanced ROI Calculator for DevOps Automation
 * Calculates comprehensive savings including time, cost, and productivity metrics
 */

class AdvancedROICalculator {
    constructor() {
        this.config = {
            // Default values for calculations
            defaults: {
                teamSize: 5,
                avgSalary: 120000,
                deploymentsPerWeek: 3,
                hoursPerDeployment: 2,
                downtimeHoursPerMonth: 4,
                revenuePerHour: 500,
                developmentVelocity: 70, // percentage of time spent on actual development
                automationEfficiency: 0.8 // 80% time savings with automation
            },
            
            // Industry benchmarks
            benchmarks: {
                avgDowntimeCostPerHour: 5600,
                avgDeploymentFailureRate: 20,
                avgTimeToResolveIncident: 2.5,
                avgProductivityGainWithAutomation: 35
            }
        };
        
        this.results = {};
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.calculateROI(); // Initial calculation
    }
    
    bindEvents() {
        // Bind input change events
        const inputs = document.querySelectorAll('.roi-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculateROI());
            input.addEventListener('change', () => this.calculateROI());
        });
        
        // Bind preset buttons
        const presetButtons = document.querySelectorAll('.company-preset');
        presetButtons.forEach(button => {
            button.addEventListener('click', (e) => this.loadPreset(e.target.dataset.preset));
        });
    }
    
    loadPreset(presetType) {
        const presets = {
            'early-stage': {
                teamSize: 3,
                avgSalary: 110000,
                deploymentsPerWeek: 1,
                hoursPerDeployment: 3,
                downtimeHoursPerMonth: 8,
                revenuePerHour: 200
            },
            'growth-stage': {
                teamSize: 8,
                avgSalary: 130000,
                deploymentsPerWeek: 5,
                hoursPerDeployment: 2,
                downtimeHoursPerMonth: 6,
                revenuePerHour: 800
            },
            'scale-stage': {
                teamSize: 15,
                avgSalary: 140000,
                deploymentsPerWeek: 10,
                hoursPerDeployment: 1.5,
                downtimeHoursPerMonth: 3,
                revenuePerHour: 1500
            }
        };
        
        const preset = presets[presetType];
        if (preset) {
            Object.keys(preset).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = preset[key];
                }
            });
            this.calculateROI();
            
            // Visual feedback
            document.querySelectorAll('.company-preset').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-preset="${presetType}"]`).classList.add('active');
        }
    }
    
    calculateROI() {
        // Get current input values
        const inputs = this.getInputValues();
        
        // Calculate current state costs
        const currentCosts = this.calculateCurrentCosts(inputs);
        
        // Calculate automated state savings
        const automatedSavings = this.calculateAutomatedSavings(inputs, currentCosts);
        
        // Calculate additional benefits
        const additionalBenefits = this.calculateAdditionalBenefits(inputs);
        
        // Calculate total ROI
        const roiMetrics = this.calculateTotalROI(currentCosts, automatedSavings, additionalBenefits);
        
        this.results = {
            inputs,
            currentCosts,
            automatedSavings,
            additionalBenefits,
            roiMetrics
        };
        
        this.updateDisplay();
        this.updateCharts();
    }
    
    getInputValues() {
        return {
            teamSize: parseInt(document.getElementById('teamSize')?.value || this.config.defaults.teamSize),
            avgSalary: parseInt(document.getElementById('avgSalary')?.value || this.config.defaults.avgSalary),
            deploymentsPerWeek: parseInt(document.getElementById('deploymentsPerWeek')?.value || this.config.defaults.deploymentsPerWeek),
            hoursPerDeployment: parseFloat(document.getElementById('hoursPerDeployment')?.value || this.config.defaults.hoursPerDeployment),
            downtimeHoursPerMonth: parseFloat(document.getElementById('downtimeHoursPerMonth')?.value || this.config.defaults.downtimeHoursPerMonth),
            revenuePerHour: parseFloat(document.getElementById('revenuePerHour')?.value || this.config.defaults.revenuePerHour)
        };
    }
    
    calculateCurrentCosts(inputs) {
        const hourlyCost = inputs.avgSalary / 2080; // 2080 working hours per year
        const deploymentCostPerWeek = inputs.deploymentsPerWeek * inputs.hoursPerDeployment * hourlyCost * inputs.teamSize;
        const downtimeCostPerMonth = inputs.downtimeHoursPerMonth * inputs.revenuePerHour;
        const incidentResponseCost = inputs.downtimeHoursPerMonth * this.config.benchmarks.avgTimeToResolveIncident * hourlyCost * inputs.teamSize;
        
        return {
            deploymentCostPerWeek,
            deploymentCostPerMonth: deploymentCostPerWeek * 4.33,
            deploymentCostPerYear: deploymentCostPerWeek * 52,
            downtimeCostPerMonth,
            downtimeCostPerYear: downtimeCostPerMonth * 12,
            incidentResponseCost,
            totalMonthlyCost: deploymentCostPerWeek * 4.33 + downtimeCostPerMonth + incidentResponseCost,
            totalYearlyCost: (deploymentCostPerWeek * 52) + (downtimeCostPerMonth * 12) + (incidentResponseCost * 12)
        };
    }
    
    calculateAutomatedSavings(inputs, currentCosts) {
        const automationEfficiency = this.config.defaults.automationEfficiency;
        const downtimeReduction = 0.9; // 90% downtime reduction
        const incidentReduction = 0.85; // 85% incident reduction
        
        const deploymentTimeSavings = currentCosts.deploymentCostPerYear * automationEfficiency;
        const downtimeSavings = currentCosts.downtimeCostPerYear * downtimeReduction;
        const incidentSavings = currentCosts.incidentResponseCost * 12 * incidentReduction;
        
        const totalAnnualSavings = deploymentTimeSavings + downtimeSavings + incidentSavings;
        
        return {
            deploymentTimeSavings,
            downtimeSavings,
            incidentSavings,
            totalAnnualSavings,
            totalMonthlySavings: totalAnnualSavings / 12,
            totalWeeklySavings: totalAnnualSavings / 52
        };
    }
    
    calculateAdditionalBenefits(inputs) {
        const hourlyCost = inputs.avgSalary / 2080;
        const productivityGain = this.config.benchmarks.avgProductivityGainWithAutomation / 100;
        
        const additionalFeatureVelocity = inputs.teamSize * hourlyCost * 40 * 52 * productivityGain; // 40 hours/week
        const reducedTechnicalDebt = additionalFeatureVelocity * 0.2; // 20% of productivity gain
        const improvedTeamMorale = inputs.teamSize * 5000; // $5k value per developer for retention
        
        return {
            additionalFeatureVelocity,
            reducedTechnicalDebt,
            improvedTeamMorale,
            totalAdditionalBenefits: additionalFeatureVelocity + reducedTechnicalDebt + improvedTeamMorale
        };
    }
    
    calculateTotalROI(currentCosts, automatedSavings, additionalBenefits) {
        const totalAnnualBenefits = automatedSavings.totalAnnualSavings + additionalBenefits.totalAdditionalBenefits;
        const averageProjectCost = 18000; // Average automation project cost
        
        const paybackPeriodMonths = averageProjectCost / automatedSavings.totalMonthlySavings;
        const roiPercentage = ((totalAnnualBenefits - averageProjectCost) / averageProjectCost) * 100;
        const threeYearROI = (totalAnnualBenefits * 3) - averageProjectCost;
        
        return {
            totalAnnualBenefits,
            averageProjectCost,
            paybackPeriodMonths,
            roiPercentage,
            threeYearROI,
            netPresentValue: this.calculateNPV(totalAnnualBenefits, averageProjectCost, 3, 0.1)
        };
    }
    
    calculateNPV(annualBenefit, initialCost, years, discountRate) {
        let npv = -initialCost;
        for (let year = 1; year <= years; year++) {
            npv += annualBenefit / Math.pow(1 + discountRate, year);
        }
        return npv;
    }
    
    updateDisplay() {
        const { automatedSavings, additionalBenefits, roiMetrics } = this.results;
        
        // Update main metrics
        this.updateElement('weekly-time-saved', this.formatHours(automatedSavings.totalWeeklySavings / 58)); // Assuming $58/hour
        this.updateElement('monthly-cost-savings', this.formatCurrency(automatedSavings.totalMonthlySavings));
        this.updateElement('annual-savings', this.formatCurrency(automatedSavings.totalAnnualSavings));
        this.updateElement('payback-period', `${roiMetrics.paybackPeriodMonths.toFixed(1)} months`);
        this.updateElement('roi-percentage', `${roiMetrics.roiPercentage.toFixed(0)}%`);
        this.updateElement('three-year-roi', this.formatCurrency(roiMetrics.threeYearROI));
        
        // Update breakdown
        this.updateElement('deployment-savings', this.formatCurrency(automatedSavings.deploymentTimeSavings));
        this.updateElement('downtime-savings', this.formatCurrency(automatedSavings.downtimeSavings));
        this.updateElement('incident-savings', this.formatCurrency(automatedSavings.incidentSavings));
        this.updateElement('productivity-gains', this.formatCurrency(additionalBenefits.additionalFeatureVelocity));
        
        // Update recommendation
        this.updateRecommendation();
    }
    
    updateRecommendation() {
        const { roiMetrics, inputs } = this.results;
        const recommendationEl = document.getElementById('roi-recommendation');
        
        if (!recommendationEl) return;
        
        let recommendation = '';
        let priority = '';
        
        if (roiMetrics.paybackPeriodMonths < 6) {
            priority = 'high';
            recommendation = `🚀 <strong>High Priority:</strong> With a payback period of just ${roiMetrics.paybackPeriodMonths.toFixed(1)} months and ${roiMetrics.roiPercentage.toFixed(0)}% ROI, automation should be your immediate next step.`;
        } else if (roiMetrics.paybackPeriodMonths < 12) {
            priority = 'medium';
            recommendation = `⚡ <strong>Medium Priority:</strong> Solid ROI of ${roiMetrics.roiPercentage.toFixed(0)}% with ${roiMetrics.paybackPeriodMonths.toFixed(1)}-month payback. Consider automation in your next planning cycle.`;
        } else {
            priority = 'low';
            recommendation = `📊 <strong>Consider Later:</strong> While automation will provide ${roiMetrics.roiPercentage.toFixed(0)}% ROI, the ${roiMetrics.paybackPeriodMonths.toFixed(1)}-month payback suggests focusing on other priorities first.`;
        }
        
        recommendationEl.innerHTML = recommendation;
        recommendationEl.className = `roi-recommendation priority-${priority}`;
    }
    
    updateCharts() {
        this.updateSavingsChart();
        this.updateTimelineChart();
    }
    
    updateSavingsChart() {
        const chartEl = document.getElementById('savings-chart');
        if (!chartEl) return;
        
        const { automatedSavings } = this.results;
        const data = [
            { label: 'Deployment Time', value: automatedSavings.deploymentTimeSavings },
            { label: 'Downtime Costs', value: automatedSavings.downtimeSavings },
            { label: 'Incident Response', value: automatedSavings.incidentSavings }
        ];
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        let chartHTML = '<div class="savings-chart-bars">';
        data.forEach(item => {
            const percentage = (item.value / total * 100);
            chartHTML += `
                <div class="chart-bar">
                    <div class="bar-label">${item.label}</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="bar-value">${this.formatCurrency(item.value)}</div>
                </div>
            `;
        });
        chartHTML += '</div>';
        
        chartEl.innerHTML = chartHTML;
    }
    
    updateTimelineChart() {
        const chartEl = document.getElementById('timeline-chart');
        if (!chartEl) return;
        
        const { roiMetrics, automatedSavings } = this.results;
        const months = Math.min(36, Math.ceil(roiMetrics.paybackPeriodMonths * 2));
        
        let chartHTML = '<div class="timeline-chart-container">';
        let cumulativeSavings = -roiMetrics.averageProjectCost;
        
        for (let month = 0; month <= months; month++) {
            if (month > 0) {
                cumulativeSavings += automatedSavings.totalMonthlySavings;
            }
            
            const isBreakeven = cumulativeSavings >= 0 && (cumulativeSavings - automatedSavings.totalMonthlySavings) < 0;
            const barHeight = Math.max(5, Math.abs(cumulativeSavings) / 1000); // Scale for display
            
            chartHTML += `
                <div class="timeline-bar ${cumulativeSavings >= 0 ? 'positive' : 'negative'} ${isBreakeven ? 'breakeven' : ''}">
                    <div class="bar-fill" style="height: ${Math.min(100, barHeight)}px"></div>
                    ${isBreakeven ? '<div class="breakeven-marker">Break-even</div>' : ''}
                </div>
            `;
        }
        
        chartHTML += '</div>';
        chartEl.innerHTML = chartHTML;
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    formatHours(hours) {
        if (hours < 1) {
            return `${(hours * 60).toFixed(0)} minutes`;
        }
        return `${hours.toFixed(1)} hours`;
    }
    
    exportResults() {
        const { inputs, roiMetrics, automatedSavings } = this.results;
        
        const reportData = {
            timestamp: new Date().toISOString(),
            inputs,
            summary: {
                annualSavings: automatedSavings.totalAnnualSavings,
                paybackMonths: roiMetrics.paybackPeriodMonths,
                roiPercentage: roiMetrics.roiPercentage,
                threeYearROI: roiMetrics.threeYearROI
            },
            recommendation: document.getElementById('roi-recommendation')?.textContent || ''
        };
        
        // Create and download CSV
        this.downloadCSV(reportData);
        
        // Track event for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'roi_calculator_export', {
                event_category: 'engagement',
                event_label: 'roi_calculator',
                value: Math.round(automatedSavings.totalAnnualSavings)
            });
        }
    }
    
    downloadCSV(data) {
        const csv = [
            ['Metric', 'Value'],
            ['Team Size', data.inputs.teamSize],
            ['Annual Savings', this.formatCurrency(data.summary.annualSavings)],
            ['Payback Period (months)', data.summary.paybackMonths.toFixed(1)],
            ['ROI Percentage', `${data.summary.roiPercentage.toFixed(0)}%`],
            ['3-Year ROI', this.formatCurrency(data.summary.threeYearROI)]
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resiliotech-roi-analysis-${Date.now()}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.advanced-roi-calculator')) {
        new AdvancedROICalculator();
    }
});