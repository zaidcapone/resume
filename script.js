// Global data storage
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
let jobDescription = '';

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
    
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
        showMessage('Please upload a PDF or Word document.', 'error');
        return;
    }
    
    showMessage('📁 Processing your resume...', 'success');
    
    // Simulate resume parsing (in real app, use a resume parsing API)
    setTimeout(() => {
        autoFillFromResume();
        showMessage('✅ Resume processed! Profile auto-filled.', 'success');
    }, 2000);
}

// Auto-fill form from resume data
function autoFillFromResume() {
    // This would be filled by actual resume parsing in a real application
    // For now, we'll use the data from your uploaded resume
    document.getElementById('name').value = "Al-Shami Zaid";
    document.getElementById('email').value = "zaid_shami@hotmail.com";
    document.getElementById('phone').value = "+96279 0423332";
    document.getElementById('location').value = "Tlaa Al Ali, Amman";
    document.getElementById('currentRole').value = "Corporate Social Responsibility Manager & Communications";
    document.getElementById('experience').value = "12";
    document.getElementById('targetRole').value = "Project & CSR Management";
    document.getElementById('linkedin').value = "https://www.linkedin.com/in/zaid-shami-1818a352";
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
    showMessage('✅ Profile saved successfully!', 'success');
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
    jobDescription = document.getElementById('jobDescription').value;
    
    if (!jobDescription.trim()) {
        showMessage('Please paste a job description first.', 'error');
        return;
    }
    
    if (!userProfile.name) {
        showMessage('Please complete your profile first.', 'error');
        return;
    }
    
    const resumeContent = document.querySelector('#customizedResume .resume-content');
    resumeContent.innerHTML = '<p>Customizing your resume...</p>';
    document.getElementById('customizedResume').classList.remove('hidden');
    
    setTimeout(() => {
        const customizedResume = generateCustomizedResume();
        resumeContent.innerHTML = customizedResume;
        showMessage('✅ Resume customized successfully!', 'success');
    }, 1500);
}

// Generate customized resume content (using your format)
function generateCustomizedResume() {
    const keywords = extractKeywords(jobDescription);
    
    return `
        <div class="resume-template">
            <div class="resume-header">
                <h2>${userProfile.name}</h2>
                <p>${userProfile.currentRole}</p>
                <p>${userProfile.location} | ${userProfile.phone} | ${userProfile.email}</p>
                <p>LinkedIn: ${userProfile.linkedin}</p>
            </div>
            
            <div class="resume-section">
                <h3>Professional Summary</h3>
                <p>${userProfile.summary}</p>
            </div>
            
            <div class="resume-section">
                <h3>Core Skills</h3>
                <p>${highlightRelevantSkills(userProfile.skills, keywords)}</p>
            </div>
            
            <div class="resume-section">
                <h3>Work Experience</h3>
                <div>${formatExperience(userProfile.experienceText)}</div>
            </div>
            
            <div class="resume-section">
                <h3>Education</h3>
                <p>${userProfile.education.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div class="resume-section">
                <h3>Certifications</h3>
                <p>${userProfile.certificates.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div class="resume-section">
                <h3>Languages</h3>
                <p>${userProfile.languages.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    `;
}

// Format experience with bullet points
function formatExperience(experienceText) {
    return experienceText.split('\n').map(line => {
        if (line.trim().startsWith('-')) {
            return `<div class="bullet-point">${line}</div>`;
        } else {
            return `<div class="experience-role">${line}</div>`;
        }
    }).join('');
}

// Download as PDF
function downloadResumePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const resumeContent = document.querySelector('#customizedResume .resume-content').textContent;
    
    doc.setFontSize(16);
    doc.text(userProfile.name, 20, 20);
    doc.setFontSize(12);
    
    const splitText = doc.splitTextToSize(resumeContent, 170);
    doc.text(splitText, 20, 40);
    
    doc.save(`${userProfile.name}-Resume.pdf`);
    showMessage('✅ PDF downloaded successfully!', 'success');
}

// Download as Word
function downloadResumeDOCX() {
    const resumeContent = document.querySelector('#customizedResume .resume-content').textContent;
    const blob = new Blob([resumeContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userProfile.name}-Resume.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('✅ Word document downloaded!', 'success');
}

// [Keep all your existing helper functions like extractKeywords, generateSummary, etc.]

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    // Auto-fill with your resume data
    autoFillFromResume();
});
