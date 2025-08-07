/**
 * Advanced Consultation Booking System
 * Handles multi-step booking flow with calendar integration and real-time availability
 */

class ConsultationBooking {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.formData = {};
        this.selectedDate = null;
        this.selectedTime = null;
        this.currentMonth = new Date();
        this.availabilityData = {};
        
        // Configuration
        this.config = {
            businessHours: {
                start: 9, // 9 AM
                end: 17,  // 5 PM
                timezone: 'America/New_York',
                excludeWeekends: true,
                excludeHolidays: true
            },
            sessionDuration: 30, // minutes
            bufferTime: 15, // minutes between sessions
            bookingWindow: {
                minDays: 1, // minimum days in advance
                maxDays: 60 // maximum days in advance
            },
            unavailableDates: [
                // Add specific unavailable dates
                '2024-12-25', // Christmas
                '2024-01-01'  // New Year
            ]
        };
        
        this.bindEvents();
        this.generateAvailabilityData();
    }
    
    init() {
        this.initializeCalendar();
        this.updateTimezoneInfo();
        this.trackBookingStart();
        console.log('Consultation booking system initialized');
    }
    
    bindEvents() {
        // Calendar navigation
        document.getElementById('prev-month')?.addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('next-month')?.addEventListener('click', () => this.navigateMonth(1));
        
        // Form input validation
        document.addEventListener('input', (e) => {
            if (e.target.closest('#consultation-booking-form')) {
                this.validateCurrentStep();
            }
        });
        
        // Prevent form submission
        document.getElementById('consultation-booking-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
    
    generateAvailabilityData() {
        // Generate availability for the next 60 days
        const today = new Date();
        const maxDate = new Date(today.getTime() + (this.config.bookingWindow.maxDays * 24 * 60 * 60 * 1000));
        
        for (let date = new Date(today); date <= maxDate; date.setDate(date.getDate() + 1)) {
            const dateStr = this.formatDateForStorage(date);
            this.availabilityData[dateStr] = this.generateDayAvailability(date);
        }
    }
    
    generateDayAvailability(date) {
        const dayOfWeek = date.getDay();
        const dateStr = this.formatDateForStorage(date);
        
        // Check if date is unavailable
        if (this.config.unavailableDates.includes(dateStr)) {
            return { available: false, slots: [] };
        }
        
        // Check if weekend and weekends are excluded
        if (this.config.businessHours.excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
            return { available: false, slots: [] };
        }
        
        // Check if date is too soon or too far
        const today = new Date();
        const minDate = new Date(today.getTime() + (this.config.bookingWindow.minDays * 24 * 60 * 60 * 1000));
        if (date < minDate) {
            return { available: false, slots: [] };
        }
        
        // Generate time slots for the day
        const slots = [];
        const startHour = this.config.businessHours.start;
        const endHour = this.config.businessHours.end;
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += this.config.sessionDuration) {
                const slotTime = new Date(date);
                slotTime.setHours(hour, minute, 0, 0);
                
                // Add some randomness to simulate real booking patterns
                const isBooked = Math.random() < 0.2; // 20% chance of being booked
                
                slots.push({
                    time: slotTime,
                    available: !isBooked,
                    type: isBooked ? 'booked' : 'available'
                });
            }
        }
        
        return {
            available: slots.some(slot => slot.available),
            slots: slots
        };
    }
    
    initializeCalendar() {
        this.renderCalendar();
    }
    
    renderCalendar() {
        const monthElement = document.getElementById('current-month');
        const calendarGrid = document.getElementById('calendar-grid');
        
        if (!monthElement || !calendarGrid) return;
        
        // Update month display
        monthElement.textContent = this.currentMonth.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        // Clear calendar grid
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Generate calendar days
        for (let i = 0; i < 42; i++) { // 6 weeks max
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();
            
            // Add classes based on date status
            const today = new Date();
            const dateStr = this.formatDateForStorage(currentDate);
            const dayAvailability = this.availabilityData[dateStr];
            
            if (currentDate.getMonth() !== this.currentMonth.getMonth()) {
                dayElement.classList.add('other-month');
            } else if (this.isSameDate(currentDate, today)) {
                dayElement.classList.add('today');
            }
            
            if (dayAvailability && dayAvailability.available) {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => this.selectDate(currentDate));
            } else {
                dayElement.classList.add('unavailable');
            }
            
            if (this.selectedDate && this.isSameDate(currentDate, this.selectedDate)) {
                dayElement.classList.add('selected');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    navigateMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.renderCalendar();
    }
    
    selectDate(date) {
        this.selectedDate = new Date(date);
        this.renderCalendar();
        this.renderTimeSlots();
        this.updateNextButtonState('date-next-btn', true);
        
        // Track date selection
        this.trackEvent('consultation_date_selected', {
            selected_date: this.formatDateForStorage(date),
            day_of_week: date.getDay()
        });
    }
    
    renderTimeSlots() {
        const timeSlotsGrid = document.getElementById('time-slots-grid');
        if (!timeSlotsGrid || !this.selectedDate) return;
        
        const dateStr = this.formatDateForStorage(this.selectedDate);
        const dayAvailability = this.availabilityData[dateStr];
        
        if (!dayAvailability || !dayAvailability.available) {
            timeSlotsGrid.innerHTML = '<p>No available time slots for this date.</p>';
            return;
        }
        
        timeSlotsGrid.innerHTML = '';
        
        dayAvailability.slots.forEach(slot => {
            if (!slot.available) return;
            
            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot';
            
            const timeString = slot.time.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            
            slotElement.innerHTML = `
                <div class="time-slot-time">${timeString}</div>
                <div class="time-slot-availability">Available</div>
            `;
            
            slotElement.addEventListener('click', () => this.selectTimeSlot(slot.time, slotElement));
            timeSlotsGrid.appendChild(slotElement);
        });
    }
    
    selectTimeSlot(time, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked element
        element.classList.add('selected');
        this.selectedTime = new Date(time);
        
        this.updateNextButtonState('time-next-btn', true);
        
        // Track time selection
        this.trackEvent('consultation_time_selected', {
            selected_time: time.toISOString(),
            hour: time.getHours()
        });
    }
    
    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.saveCurrentStepData();
        
        if (this.currentStep < this.totalSteps - 1) {
            this.showStep(this.currentStep + 1);
            
            // Special handling for confirmation step
            if (this.currentStep === 4) {
                this.populateConfirmationSummary();
            }
        }
        
        this.trackStepProgression();
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    showStep(stepNumber) {
        // Hide current step
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.remove('active');
        });
        
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) < stepNumber) {
                step.classList.add('completed');
            } else {
                step.classList.remove('completed');
            }
        });
        
        // Show new step
        const newStep = document.querySelector(`.step-content[data-step="${stepNumber}"]`);
        const newFormStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        
        if (newStep) {
            newStep.classList.add('active');
        }
        
        if (newFormStep) {
            newFormStep.classList.add('active');
        }
        
        this.currentStep = stepNumber;
        
        // Scroll to top of form
        document.querySelector('.booking-form-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateContactInfo();
            case 2:
                return this.selectedDate !== null;
            case 3:
                return this.selectedTime !== null;
            case 4:
                return true;
            default:
                return true;
        }
    }
    
    validateContactInfo() {
        const requiredFields = ['firstName', 'lastName', 'email', 'company', 'role', 'currentChallenges'];
        let isValid = true;
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field) {
                this.clearFieldError(field);
            }
        });
        
        // Email validation
        const emailField = document.getElementById('email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.75rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    updateNextButtonState(buttonId, enabled) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = !enabled;
        }
    }
    
    saveCurrentStepData() {
        if (this.currentStep === 1) {
            const form = document.getElementById('consultation-booking-form');
            const formData = new FormData(form);
            
            for (let [key, value] of formData.entries()) {
                this.formData[key] = value;
            }
        }
    }
    
    populateConfirmationSummary() {
        if (!this.selectedDate || !this.selectedTime) return;
        
        const summaryDate = document.getElementById('summary-date');
        const summaryTime = document.getElementById('summary-time');
        
        if (summaryDate) {
            summaryDate.textContent = this.selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        if (summaryTime) {
            summaryTime.textContent = this.selectedTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZoneName: 'short'
            });
        }
    }
    
    async confirmBooking() {
        this.showLoading(true);
        
        try {
            // Prepare booking data
            const bookingData = {
                ...this.formData,
                selectedDate: this.selectedDate.toISOString(),
                selectedTime: this.selectedTime.toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timestamp: new Date().toISOString(),
                source: 'website_booking_form'
            };
            
            // Submit booking (simulate API call)
            const success = await this.submitBooking(bookingData);
            
            if (success) {
                this.showStep(5);
                this.populateFinalConfirmation();
                this.trackBookingCompletion(bookingData);
            } else {
                throw new Error('Booking submission failed');
            }
        } catch (error) {
            console.error('Booking confirmation failed:', error);
            this.showError('Failed to confirm booking. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }
    
    async submitBooking(bookingData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // In real implementation, this would send to your booking API
                console.log('Booking submitted:', bookingData);
                
                // Store in localStorage as fallback
                localStorage.setItem('consultation_booking', JSON.stringify(bookingData));
                
                resolve(true);
            }, 2000);
        });
    }
    
    populateFinalConfirmation() {
        const finalDetails = document.getElementById('final-confirmation-details');
        if (!finalDetails) return;
        
        finalDetails.innerHTML = `
            <div class="summary-item">
                <span class="summary-label"><strong>Contact:</strong></span>
                <span class="summary-value">${this.formData.firstName} ${this.formData.lastName}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label"><strong>Email:</strong></span>
                <span class="summary-value">${this.formData.email}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label"><strong>Company:</strong></span>
                <span class="summary-value">${this.formData.company}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label"><strong>Date & Time:</strong></span>
                <span class="summary-value">
                    ${this.selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })} at ${this.selectedTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    })}
                </span>
            </div>
        `;
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }
    
    showError(message) {
        // Simple error display - could be enhanced with a modal or toast
        alert(message);
    }
    
    updateTimezoneInfo() {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneElements = document.querySelectorAll('[id^="timezone-info"]');
        
        timezoneElements.forEach(element => {
            element.textContent = `All times shown in ${timezone}`;
        });
    }
    
    // Utility methods
    formatDateForStorage(date) {
        return date.toISOString().split('T')[0];
    }
    
    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    // Analytics methods
    trackBookingStart() {
        this.trackEvent('consultation_booking_started', {
            timestamp: new Date().toISOString(),
            source: document.referrer || 'direct'
        });
    }
    
    trackStepProgression() {
        this.trackEvent('consultation_booking_step_completed', {
            step: this.currentStep - 1,
            next_step: this.currentStep,
            timestamp: new Date().toISOString()
        });
    }
    
    trackBookingCompletion(bookingData) {
        this.trackEvent('consultation_booking_completed', {
            contact: {
                company: bookingData.company,
                role: bookingData.role,
                team_size: bookingData.teamSize
            },
            scheduled_date: bookingData.selectedDate,
            scheduled_time: bookingData.selectedTime,
            timestamp: new Date().toISOString()
        });
        
        // Track conversion event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: 'G-P2YM46QZCK/consultation_booking',
                value: 500, // Estimated value of a consultation lead
                currency: 'USD'
            });
        }
    }
    
    trackEvent(eventName, eventData) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(eventName, eventData);
        }
        
        console.log('Booking Event:', eventName, eventData);
    }
}

// Global functions for HTML onclick handlers
function nextStep() {
    if (window.consultationBooking) {
        window.consultationBooking.nextStep();
    }
}

function previousStep() {
    if (window.consultationBooking) {
        window.consultationBooking.previousStep();
    }
}

function confirmBooking() {
    if (window.consultationBooking) {
        window.consultationBooking.confirmBooking();
    }
}

// Initialize booking system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.consultationBooking = new ConsultationBooking();
});