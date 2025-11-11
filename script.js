// Global data storage
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
let jobDescription = '';

// Tab navigation
function openTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab and activate button
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Save profile
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    userProfile = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        currentRole: document.getElementById('currentRole').value,
        experience: document.getElementById('experience').value,
        targetRole: document.getElementById('targetRole').value,
        skills: document.getElementById('skills').value,
        experienceText: document.getElementById('experienceText').value,
        education: document.getElementById('education').value,
        certificates: document.getElementById('certificates').value,
        lastUpdated: new Date().toLocaleString()
    };
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Show success message
    showMessage('✅ Profile saved successfully!', 'success');
    
    // Auto-fill job tab if we have target role
    if (userProfile.targetRole) {
        document.getElementById('jobDescription').placeholder = `Paste ${userProfile.targetRole} job description here...`;
    }
});

// Load saved profile
function loadProfile() {
    if (userProfile.name) {
        document.getElementById('name').value = userProfile.name || '';
        document.getElementById('email').value = userProfile.email || '';
        document.getElementById('phone').value = userProfile.phone || '';
        document.getElementById('currentRole').value = userProfile.currentRole || '';
        document.getElementById('experience').value = userProfile.experience || '';
        document.getElementById('targetRole').value = userProfile.targetRole || '';
        document.getElementById('skills').value = userProfile.skills || '';
        document.getElementById('experienceText').value = userProfile.experienceText || '';
        document.getElementById('education').value = userProfile.education || '';
        document.getElementById('certificates').value = userProfile.certificates || '';
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
    
    // Show loading
    const resumeContent = document.querySelector('#customizedResume .resume-content');
    resumeContent.innerHTML = '<p>Customizing your resume...</p>';
    document.getElementById('customizedResume').classList.remove('hidden');
    
    // Simulate AI processing (in real app, this would call an API)
    setTimeout(() => {
        const customizedResume = generateCustomizedResume();
        resumeContent.innerHTML = customizedResume;
        showMessage('✅ Resume customized successfully!', 'success');
    }, 1500);
}

// Generate customized resume content
function generateCustomizedResume() {
    const keywords = extractKeywords(jobDescription);
    
    return `
        <div class="resume-header">
            <h2>${userProfile.name}</h2>
            <p>${userProfile.email} | ${userProfile.phone} | ${userProfile.currentRole}</p>
        </div>
        
        <div class="resume-section">
            <h3>Professional Summary</h3>
            <p>${generateSummary(keywords)}</p>
        </div>
        
        <div class="resume-section">
            <h3>Skills</h3>
            <p>${highlightRelevantSkills(userProfile.skills, keywords)}</p>
        </div>
        
        <div class="resume-section">
            <h3>Experience</h3>
            <p>${userProfile.experienceText}</p>
        </div>
        
        <div class="resume-section">
            <h3>Education</h3>
            <p>${userProfile.education}</p>
        </div>
        
        <div class="resume-section">
            <h3>Certifications</h3>
            <p>${userProfile.certificates}</p>
        </div>
        
        <div class="resume-note">
            <em>Customized for position matching: ${keywords.slice(0, 5).join(', ')}</em>
        </div>
    `;
}

// Extract keywords from job description
function extractKeywords(text) {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word));
    
    return [...new Set(words)]; // Remove duplicates
}

// Generate professional summary
function generateSummary(keywords) {
    const years = userProfile.experience ? `${userProfile.experience}+ years` : 'Several years';
    const skills = userProfile.skills ? userProfile.skills.split('\n').slice(0, 3).join(', ') : 'relevant skills';
    
    return `${years} of experience in ${userProfile.currentRole || 'the field'} with expertise in ${skills}. 
            Seeking to leverage ${keywords.slice(0, 2).join(' and ')} experience in a challenging ${userProfile.targetRole || 'new'} role.`;
}

// Highlight relevant skills
function highlightRelevantSkills(skillsText, keywords) {
    if (!skillsText) return 'No skills listed';
    
    const skills = skillsText.split('\n');
    const highlighted = skills.map(skill => {
        const lowerSkill = skill.toLowerCase();
        const isRelevant = keywords.some(keyword => lowerSkill.includes(keyword.toLowerCase()));
        return isRelevant ? `<strong>${skill}</strong>` : skill;
    });
    
    return highlighted.join('<br>');
}

// Generate exports
function generateExports() {
    const coverLetterChecked = document.getElementById('coverLetter').checked;
    const emailChecked = document.getElementById('draftEmail').checked;
    
    if (!coverLetterChecked && !emailChecked) {
        showMessage('Please select at least one export option.', 'error');
        return;
    }
    
    document.getElementById('exportResults').classList.remove('hidden');
    
    if (coverLetterChecked) {
        generateCoverLetter();
    }
    
    if (emailChecked) {
        generateDraftEmail();
    }
}

// Generate cover letter
function generateCoverLetter() {
    const coverLetterOutput = document.querySelector('#coverLetterOutput .content');
    coverLetterOutput.innerHTML = `
        <p>Dear Hiring Manager,</p>
        
        <p>I am writing to express my interest in the position. With ${userProfile.experience || 'several'} years of experience 
        as a ${userProfile.currentRole || 'professional'}, I have developed strong skills in ${userProfile.skills ? userProfile.skills.split('\n')[0] : 'my field'} 
        that align well with your requirements.</p>
        
        <p>My background in ${userProfile.experienceText ? userProfile.experienceText.split('\n')[0] : 'relevant experience'} 
        has prepared me to contribute effectively to your team. I am particularly excited about the opportunity to 
        apply my expertise in a challenging new role.</p>
        
        <p>Thank you for considering my application. I look forward to discussing how my skills and experience 
        can benefit your organization.</p>
        
        <p>Sincerely,<br>${userProfile.name}</p>
    `;
    document.getElementById('coverLetterOutput').classList.remove('hidden');
}

// Generate draft email
function generateDraftEmail() {
    const emailOutput = document.querySelector('#emailOutput .content');
    emailOutput.innerHTML = `
        <p><strong>Subject:</strong> Application for Position - ${userProfile.name}</p>
        <p><strong>To:</strong> [Hiring Manager Email]</p>
        <p><strong>Body:</strong></p>
        <p>Dear Hiring Manager,</p>
        <p>I am excited to submit my application for the position. Please find my resume attached.</p>
        <p>Best regards,<br>${userProfile.name}<br>${userProfile.phone}<br>${userProfile.email}</p>
    `;
    document.getElementById('emailOutput').classList.remove('hidden');
}

// Download resume as text file
function downloadResume() {
    const resumeContent = document.querySelector('#customizedResume .resume-content').textContent;
    downloadFile(resumeContent, `${userProfile.name}-Resume.txt`, 'text/plain');
}

// Download cover letter
function downloadCoverLetter() {
    const content = document.querySelector('#coverLetterOutput .content').textContent;
    downloadFile(content, `${userProfile.name}-Cover-Letter.txt`, 'text/plain');
}

// Copy email to clipboard
function copyEmail() {
    const emailContent = document.querySelector('#emailOutput .content').textContent;
    navigator.clipboard.writeText(emailContent).then(() => {
        showMessage('✅ Email draft copied to clipboard!', 'success');
    });
}

// Helper function to download files
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
});
