let currentStep = 1;
const totalSteps = 5;

// Open application form modal
function openApplicationForm() {
    document.getElementById('applicationModal').classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    currentStep = 1;
    showStep(currentStep);
}

// Close application form modal
function closeApplicationForm() {
    document.getElementById('applicationModal').classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Show specific step
function showStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(s => s.classList.remove('active'));
    
    // Show current step
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Update progress bar
    updateProgressBar(step);
    
    // Scroll to top of modal
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

// Update progress bar
function updateProgressBar(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach((progressStep, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < step) {
            progressStep.classList.add('completed');
            progressStep.classList.remove('active');
        } else if (stepNumber === step) {
            progressStep.classList.add('active');
            progressStep.classList.remove('completed');
        } else {
            progressStep.classList.remove('active', 'completed');
        }
    });
}

// Validate current step
function validateStep(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim() && field.type !== 'checkbox') {
            isValid = false;
            field.style.borderColor = '#ef4444';
        } else if (field.type === 'checkbox' && !field.checked) {
            isValid = false;
            field.style.outline = '2px solid #ef4444';
        } else {
            field.style.borderColor = '#e0e0e0';
            field.style.outline = 'none';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields before proceeding.');
    }
    
    return isValid;
}

// Next step
function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

// Previous step
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('foundersFuelForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                // Show confirmation message
                alert('Thank you for your application! You will be redirected to the payment gateway to complete the ₹999 registration fee.');
                
                // Collect form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                console.log('Form submitted with data:', data);
                
                // Here you would typically:
                // 1. Send data to backend/database
                // 2. Redirect to payment gateway
                
                // Example: Redirect to payment
                // window.location.href = 'payment-gateway-url';
                
                // Close modal after submission
                closeApplicationForm();
                
                // Reset form
                form.reset();
                currentStep = 1;
                showStep(currentStep);
            }
        });
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('applicationModal');
        if (event.target === modal) {
            closeApplicationForm();
        }
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeApplicationForm();
        }
    });
});