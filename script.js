// ===========================================
// FINBYTES FOUNDERS FUEL - FRONTEND SCRIPT
// Complete Integration with Backend API
// ===========================================

// =================== CONFIGURATION ===================
const API_BASE_URL = 'http://localhost:5000/api';

// =================== TOKEN MANAGEMENT ===================
const getAuthToken = () => localStorage.getItem('authToken');
const setAuthToken = (token) => localStorage.setItem('authToken', token);
const removeAuthToken = () => localStorage.removeItem('authToken');
const isLoggedIn = () => !!getAuthToken();

// =================== AUTHENTICATION APIS ===================

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (data.success) {
            setAuthToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            setAuthToken(data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

function logoutUser() {
    removeAuthToken();
    localStorage.removeItem('user');
    window.location.reload();
}

async function getCurrentUser() {
    try {
        const token = getAuthToken();
        if (!token) return { success: false, message: 'Not authenticated' };

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, message: 'Network error' };
    }
}

// =================== APPLICATION APIS ===================

async function submitApplicationToBackend(formData) {
    try {
        const token = getAuthToken();
        
        if (!token) {
            alert('Please login first to submit an application');
            return { success: false, message: 'Not authenticated' };
        }

        const response = await fetch(`${API_BASE_URL}/application/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Application submitted successfully!');
            console.log('📧 Admin has been notified via email');
            return { success: true, application: data.application };
        } else {
            console.error('❌ Application submission failed:', data.message);
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('❌ Application submission error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

async function getMyApplications() {
    try {
        const token = getAuthToken();
        if (!token) return { success: false, message: 'Not authenticated' };

        const response = await fetch(`${API_BASE_URL}/application/my-applications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, applications: data.applications };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error fetching applications:', error);
        return { success: false, message: 'Network error' };
    }
}

async function updatePaymentStatus(applicationId, paymentId) {
    try {
        const token = getAuthToken();
        if (!token) return { success: false, message: 'Not authenticated' };

        const response = await fetch(`${API_BASE_URL}/application/${applicationId}/payment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                paymentId: paymentId,
                paymentStatus: 'completed'
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Payment status updated!');
            return { success: true, application: data.application };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        return { success: false, message: 'Network error' };
    }
}

// =================== FORM HANDLING ===================

let currentStep = 1;
const totalSteps = 5;

function openApplicationForm() {
    if (!isLoggedIn()) {
        alert('Please login or register first to submit an application');
        showAuthModal();
        return;
    }
    
    document.getElementById('applicationModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    currentStep = 1;
    showStep(currentStep);
}

function closeApplicationForm() {
    document.getElementById('applicationModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showStep(step) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(s => s.classList.remove('active'));
    
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    updateProgressBar(step);
    
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

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

function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// =================== AUTH MODAL ===================

function showAuthModal() {
    let authModal = document.getElementById('authModal');
    
    if (!authModal) {
        authModal = document.createElement('div');
        authModal.id = 'authModal';
        authModal.className = 'modal';
        authModal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <span class="close-btn" onclick="closeAuthModal()">&times;</span>
                <h2 style="text-align: center; margin-bottom: 30px;">Login / Register</h2>
                
                <div id="authTabs" style="display: flex; gap: 20px; margin-bottom: 30px; justify-content: center;">
                    <button class="auth-tab active" onclick="showAuthTab('login')">Login</button>
                    <button class="auth-tab" onclick="showAuthTab('register')">Register</button>
                </div>
                
                <form id="loginForm" style="display: block;">
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="loginEmail" required placeholder="your.email@example.com">
                    </div>
                    <div class="form-group">
                        <label>Password *</label>
                        <input type="password" id="loginPassword" required placeholder="Enter password">
                    </div>
                    <button type="submit" class="submit-button" style="width: 100%; margin-top: 20px;">Login</button>
                </form>
                
                <form id="registerForm" style="display: none;">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" id="regFullName" required placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="regEmail" required placeholder="your.email@example.com">
                    </div>
                    <div class="form-group">
                        <label>Password *</label>
                        <input type="password" id="regPassword" required placeholder="Minimum 6 characters">
                    </div>
                    <div class="form-group">
                        <label>Phone *</label>
                        <input type="tel" id="regPhone" required placeholder="+91 XXXXX XXXXX">
                    </div>
                    <div class="form-group">
                        <label>Location *</label>
                        <input type="text" id="regLocation" required placeholder="City, State">
                    </div>
                    <button type="submit" class="submit-button" style="width: 100%; margin-top: 20px;">Register</button>
                </form>
            </div>
        `;
        document.body.appendChild(authModal);
        
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }
    
    authModal.classList.add('active');
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('active');
    }
}

function showAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = await loginUser(email, password);
    
    if (result.success) {
        alert('✅ Login successful! Welcome back, ' + result.user.fullName);
        closeAuthModal();
        updateUIForLoggedInUser(result.user);
    } else {
        alert('❌ Login failed: ' + result.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const userData = {
        fullName: document.getElementById('regFullName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        phone: document.getElementById('regPhone').value,
        location: document.getElementById('regLocation').value
    };
    
    const result = await registerUser(userData);
    
    if (result.success) {
        alert('✅ Registration successful! Welcome, ' + result.user.fullName);
        closeAuthModal();
        updateUIForLoggedInUser(result.user);
    } else {
        alert('❌ Registration failed: ' + result.message);
    }
}

function updateUIForLoggedInUser(user) {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        btn.textContent = 'Submit Application';
    });
    console.log('✅ User logged in:', user.fullName);
}

function checkAuthenticationStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        updateUIForLoggedInUser(userData);
        console.log('✅ User is logged in:', userData.fullName);
    }
}

// =================== FORM SUBMISSION ===================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('foundersFuelForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                const submitButton = form.querySelector('.submit-button');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;
                
                const formData = new FormData(form);
                
                const applicationData = {
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    age: parseInt(formData.get('age')),
                    location: formData.get('location'),
                    linkedin: formData.get('linkedin'),
                    coFounders: formData.get('coFounders'),
                    teamSize: parseInt(formData.get('teamSize')),
                    startupName: formData.get('startupName') || '',
                    website: formData.get('website') || '',
                    sector: formData.get('sector'),
                    oneLiner: formData.get('oneLiner'),
                    problemStatement: formData.get('problemStatement'),
                    solution: formData.get('solution'),
                    targetUsers: formData.get('targetUsers'),
                    impact: formData.get('impact'),
                    stage: formData.get('stage'),
                    funding: formData.get('funding'),
                    pitchLink: formData.get('pitchLink'),
                    commitment1: formData.get('commitment1') === 'on',
                    commitment2: formData.get('commitment2') === 'on',
                    commitment3: formData.get('commitment3') === 'on',
                    additionalInfo: formData.get('additionalInfo') || ''
                };
                
                const result = await submitApplicationToBackend(applicationData);
                
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                if (result.success) {
                    alert('✅ Application submitted successfully!\n\n📧 Admin has been notified!\n\nYou will be redirected to complete the ₹999 registration fee.');
                    
                    const applicationId = result.application.id;
                    const paymentId = 'pay_demo_' + Date.now();
                    
                    await updatePaymentStatus(applicationId, paymentId);
                    
                    closeApplicationForm();
                    form.reset();
                    currentStep = 1;
                    showStep(currentStep);
                    
                    alert('🎉 Thank you! Your application has been submitted and payment recorded.\n\nYou will receive a confirmation email shortly.');
                } else {
                    alert('❌ Error submitting application:\n\n' + result.message);
                }
            }
        });
    }
    
    window.onclick = function(event) {
        const modal = document.getElementById('applicationModal');
        if (event.target === modal) {
            closeApplicationForm();
        }
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeApplicationForm();
        }
    });
    
    checkAuthenticationStatus();
});
