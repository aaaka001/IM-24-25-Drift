class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.entriesList = document.getElementById('entriesList');
        this.successMessage = document.getElementById('successMessage');
        this.clearButton = document.getElementById('clearAll');
        this.inputs = Array.from(this.form.elements);
        
        this.initialize();
        this.initializeClearButton();
    }

    initialize() {
        this.setupEventListeners();
        this.loadEntries();
        if (!localStorage.getItem('registrations')) {
            localStorage.setItem('registrations', '[]');
        }
    }

    setupEventListeners() {
        this.inputs.forEach(input => {
            if (input.tagName !== 'BUTTON') {
                input.addEventListener('input', () => this.validateInput(input));
            }
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    initializeClearButton() {
        this.clearButton.addEventListener('click', () => {
            if (confirm('Er du sikker på at du vil slette alle registreringer?')) {
                localStorage.setItem('registrations', '[]');
                this.loadEntries();
            }
        });
    }

    validateInput(input) {
        const group = input.closest('.input-group');
        group.classList.remove('valid', 'invalid');

        if (!input.checkValidity()) {
            group.classList.add('invalid');
            return false;
        }

        if (input.type === 'email' && !this.validateEmail(input.value)) {
            group.classList.add('invalid');
            return false;
        }

        group.classList.add('valid');
        return true;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const allValid = this.inputs
            .filter(input => input.required)
            .every(input => this.validateInput(input));

        if (allValid) {
            this.saveRegistration();
            this.showSuccess();
            this.form.reset();
            this.inputs.forEach(input => {
                input.closest('.input-group')?.classList.remove('valid');
            });
        }
    }

    saveRegistration() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            device: document.getElementById('device').value,
            time: document.getElementById('time').value,
            problem: document.getElementById('problem').value,
            timestamp: new Date().toISOString()
        };

        const existingData = JSON.parse(localStorage.getItem('registrations'));
        existingData.push(formData);
        localStorage.setItem('registrations', JSON.stringify(existingData));
        this.loadEntries();
    }

    showSuccess() {
        this.successMessage.classList.add('show-success');
        setTimeout(() => {
            this.successMessage.classList.remove('show-success');
        }, 3000);
    }

    loadEntries() {
        const entries = JSON.parse(localStorage.getItem('registrations') || '[]');
        
        if (entries.length === 0) {
            this.entriesList.innerHTML = `
                <div class="empty-state">
                    Ingen registreringer å vise
                </div>
            `;
            return;
        }

        this.entriesList.innerHTML = entries.map(entry => `
            <div class="entry-card">
                <div class="entry-header">
                    <span class="entry-device">${entry.device.split(' ')[0]}</span>
                    <div>
                        <h3>${entry.name}</h3>
                        <small>${new Date(entry.timestamp).toLocaleString('no-NO')}</small>
                    </div>
                </div>
                <p><strong>Problem:</strong> ${entry.problem || 'Ikke spesifisert'}</p>
                <div class="entry-details">
                    <span>📧 ${entry.email}</span>
                    <span>⏰ ${entry.time}</span>
                </div>
            </div>
        `).join('');
    }
}

new RegistrationForm();