// Global data storage
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};

// Tab navigation
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Handle resume upload
function handleResumeUpload(file) {
    if (!file) return;
    
    showMessage('Processing your resume...', 'success');
    // Simulate processing
    setTimeout(() => {
        showMessage('Resume processed! Please review and update the information below.', 'success');
    }, 1500);
}

// Save profile
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    userProfile = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        currentRole: document.getElementById('currentRole').value,
        experience: document.getElementById('experience').value,
        targetRole: document.getElementById('targetRole').value,
        linkedin: document.getElementById('linkedin').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        experienceText: document.getElementById('experienceText').value,
        education: document.getElementById('education').value,
        certificates: document.getElementById('certificates').value,
        languages: document.getElementById('languages').value,
        lastUpdated: new Date().toLocaleString()
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    showMessage('Profile saved successfully!', 'success');
});

// Load saved profile
function loadProfile() {
    if (userProfile.name) {
        document.getElementById('name').value = userProfile.name || '';
        document.getElementById('email').value = userProfile.email || '';
        document.getElementById('phone').value = userProfile.phone || '';
        document.getElementById('location').value = userProfile.location || '';
        document.getElementById('currentRole').value = userProfile.currentRole || '';
        document.getElementById('experience').value = userProfile.experience || '';
        document.getElementById('targetRole').value = userProfile.targetRole || '';
        document.getElementById('linkedin').value = userProfile.linkedin || '';
        document.getElementById('summary').value = userProfile.summary || '';
        document.getElementById('skills').value = userProfile.skills || '';
        document.getElementById('experienceText').value = userProfile.experienceText || '';
        document.getElementById('education').value = userProfile.education || '';
        document.getElementById('certificates').value = userProfile.certificates || '';
        document.getElementById('languages').value = userProfile.languages || '';
    }
}

// Customize resume for job
function customizeResume() {
    const jobDescription = document.getElementById('jobDescription').value;
    
    if (!jobDescription.trim()) {
        showMessage('Please paste a job description first.', 'error');
        return;
    }
    
    if (!userProfile.name) {
        showMessage('Please complete your profile first.', 'error');
        return;
    }
    
    const resumeContent = document.querySelector('#customizedResume .resume-content');
    resumeContent.innerHTML = '<p>Analyzing job description and customizing your resume...</p>';
    document.getElementById('customizedResume').classList.remove('hidden');
    
    setTimeout(() => {
        const customizedResume = generateCustomizedResume();
        resumeContent.innerHTML = customizedResume;
        showMessage('Resume customized successfully!', 'success');
    }, 2000);
}

// Generate resume in your template format
function generateCustomizedResume() {
    return `
        <div class="resume-template">
            <div class="resume-header">
                <h2>${userProfile.name || 'Your Name'}</h2>
                <p>${userProfile.currentRole || 'Professional Title'} | ${userProfile.location || 'Location'}</p>
                <p>${userProfile.phone || 'Phone'} | ${userProfile.email || 'Email'} | ${userProfile.linkedin || 'LinkedIn'}</p>
            </div>
            
            <div class="resume-section">
                <h3>PROFESSIONAL SUMMARY</h3>
                <p>${userProfile.summary || 'Professional summary highlighting key experience and skills.'}</p>
            </div>
            
            <div class="resume-section">
                <h3>CORE SKILLS & EXPERTISE</h3>
                <div class="skills-grid">
                    ${userProfile.skills ? userProfile.skills.split('\n').map(skill => 
                        `<div class="skill-item">${skill.trim()}</div>`
                    ).join('') : 'Your skills will appear here'}
                </div>
            </div>
            
            <div class="resume-section">
                <h3>PROFESSIONAL EXPERIENCE</h3>
                ${formatExperience(userProfile.experienceText)}
            </div>
            
            <div class="resume-section">
                <h3>EDUCATION</h3>
                ${userProfile.education ? userProfile.education.split('\n').map(edu => 
                    `<p>${edu.trim()}</p>`
                ).join('') : '<p>Your education details</p>'}
            </div>
            
            <div class="resume-section">
                <h3>CERTIFICATIONS</h3>
                ${userProfile.certificates ? userProfile.certificates.split('\n').map(cert => 
                    `<p>${cert.trim()}</p>`
                ).join('') : '<p>Your certifications</p>'}
            </div>
            
            <div class="resume-section">
                <h3>LANGUAGES</h3>
                <p>${userProfile.languages || 'Languages you speak'}</p>
            </div>
        </div>
    `;
}

// Format experience with proper structure
function formatExperience(experienceText) {
    if (!experienceText) return '<p>Your work experience</p>';
    
    return experienceText.split('\n\n').map(job => {
        const lines = job.split('\n');
        const titleLine = lines[0];
        const bulletPoints = lines.slice(1).filter(line => line.trim().startsWith('-'));
        
        return `
            <div class="job-entry">
                <div class="job-title">${titleLine}</div>
                ${bulletPoints.map(point => `<div class="job-bullet">${point}</div>`).join('')}
            </div>
        `;
    }).join('');
}

// Download as PDF
function downloadResumePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add content in your resume format
    doc.setFontSize(16);
    doc.text(userProfile.name || 'Your Name', 20, 20);
    doc.setFontSize(12);
    doc.text(userProfile.currentRole || 'Professional Title', 20, 30);
    doc.text(`${userProfile.phone || ''} | ${userProfile.email || ''}`, 20, 40);
    
    // Add other sections...
    let yPosition = 60;
    
    if (userProfile.summary) {
        doc.text('PROFESSIONAL SUMMARY', 20, yPosition);
        yPosition += 10;
        const summaryLines = doc.splitTextToSize(userProfile.summary, 170);
        doc.text(summaryLines, 20, yPosition);
        yPosition += summaryLines.length * 7 + 10;
    }
    
    doc.save(`${userProfile.name || 'resume'}.pdf`);
    showMessage('PDF downloaded successfully!', 'success');
}

// Download as Word
function downloadResumeDOCX() {
    const resumeContent = document.querySelector('#customizedResume .resume-content').textContent;
    const blob = new Blob([resumeContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userProfile.name || 'resume'}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('Word document downloaded!', 'success');
}

// Show message
function showMessage(message, type) {
    alert(message); // Simple alert for now
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    // Setup file upload
    document.getElementById('resumeUpload').addEventListener('change', function(e) {
        handleResumeUpload(e.target.files[0]);
    });
});
