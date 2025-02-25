// Legal Document Checker - Application Logic

// DOM Elements
const clientInfoForm = document.getElementById('clientInfoForm');
const clientList = document.getElementById('clientList');
const documentContent = document.getElementById('documentContent');
const documentTitle = document.getElementById('documentTitle');
const documentType = document.getElementById('documentType');
const checkDocumentBtn = document.getElementById('checkDocument');
const saveDocumentBtn = document.getElementById('saveDocument');
const resultsPanel = document.getElementById('resultsPanel');
const resultsContent = document.getElementById('resultsContent');

// Data Storage
let clients = JSON.parse(localStorage.getItem('legalClients')) || [];
let documents = JSON.parse(localStorage.getItem('legalDocuments')) || [];
let currentClientId = null;

// Initialize the application
function initApp() {
    renderClientList();
    
    // Event Listeners
    clientInfoForm.addEventListener('submit', saveClientInfo);
    checkDocumentBtn.addEventListener('click', checkDocumentConsistency);
    saveDocumentBtn.addEventListener('click', saveDocument);
    
    // Add sample data if none exists
    if (clients.length === 0) {
        addSampleData();
    }
    
    // Add test button for demonstration purposes
    addTestButton();
}

// Add a test button to introduce inconsistencies for demonstration
function addTestButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-3';
    
    const testButton = document.createElement('button');
    testButton.className = 'btn btn-secondary';
    testButton.innerHTML = '<i class="fas fa-flask me-2"></i>Introduce Test Inconsistencies';
    testButton.onclick = function() {
        if (!currentClientId || !documentContent.value) {
            alert('Please select a client and load a document first!');
            return;
        }
        
        const client = clients.find(c => c.id === currentClientId);
        if (!client) return;
        
        // Introduce common inconsistencies
        let content = documentContent.value;
        
        // 1. Typo in client name (e.g., John Smith -> Jon Smith)
        if (client.name.includes(' ')) {
            const firstName = client.name.split(' ')[0];
            const typoName = firstName.substring(0, firstName.length-1);
            content = content.replace(new RegExp(firstName, 'g'), typoName);
        }
        
        // 2. Incorrect case number (change last digit)
        if (client.caseNumber) {
            const lastChar = client.caseNumber.charAt(client.caseNumber.length - 1);
            const newChar = isNaN(parseInt(lastChar)) ? 'X' : (parseInt(lastChar) + 1) % 10;
            const incorrectCaseNumber = client.caseNumber.substring(0, client.caseNumber.length - 1) + newChar;
            content = content.replace(client.caseNumber, incorrectCaseNumber);
        }
        
        // 3. Incorrect date (day after filing date)
        if (client.filingDate) {
            const date = new Date(client.filingDate);
            date.setDate(date.getDate() + 1);
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const incorrectDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            
            // Find a date in the content and replace it
            const dateRegex = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/;
            const match = content.match(dateRegex);
            if (match) {
                content = content.replace(match[0], incorrectDate);
            } else {
                // If no date found, add one
                content += `\n\nAdditional filing on ${incorrectDate}.`;
            }
        }
        
        // Update document content
        documentContent.value = content;
        alert('Test inconsistencies introduced! Click "Check Document" to see the results.');
    };
    
    buttonContainer.appendChild(testButton);
    document.querySelector('.card-body:has(#documentContent)').appendChild(buttonContainer);
}

// Add sample data for demonstration
function addSampleData() {
    const sampleClient = {
        id: generateId(),
        name: 'John Smith',
        caseNumber: 'CV-2025-12345',
        caseType: 'civil',
        filingDate: '2025-01-15',
        courtName: 'Superior Court of California, County of Los Angeles',
        opposingParty: 'Acme Corporation'
    };
    
    clients.push(sampleClient);
    localStorage.setItem('legalClients', JSON.stringify(clients));
    
    const sampleDocument = {
        id: generateId(),
        clientId: sampleClient.id,
        title: 'Initial Complaint',
        type: 'complaint',
        content: `SUPERIOR COURT OF CALIFORNIA\nCOUNTY OF LOS ANGELES\n\nJohn Smith,\nPlaintiff,\n\nvs.\n\nAcme Corporation,\nDefendant.\n\nCase No.: CV-2025-12345\n\nCOMPLAINT FOR DAMAGES\n\nPlaintiff John Smith ("Plaintiff") hereby alleges as follows:\n\n1. On January 15, 2025, Plaintiff filed this action against Defendant Acme Corporation.\n\n2. The Court has jurisdiction over this matter pursuant to...\n\n3. Venue is proper in this Court because...\n\nWHEREFORE, Plaintiff prays for judgment against Defendant as follows:\n\n1. For general damages according to proof;\n2. For special damages according to proof;\n3. For costs of suit incurred herein;\n4. For such other and further relief as the Court deems just and proper.\n\nDated: February 1, 2025\n\n______________________\nAttorney for Plaintiff`,
        dateCreated: new Date().toISOString()
    };
    
    documents.push(sampleDocument);
    localStorage.setItem('legalDocuments', JSON.stringify(documents));
    
    renderClientList();
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save client information
function saveClientInfo(e) {
    e.preventDefault();
    
    const clientData = {
        id: currentClientId || generateId(),
        name: document.getElementById('clientName').value,
        caseNumber: document.getElementById('caseNumber').value,
        caseType: document.getElementById('caseType').value,
        filingDate: document.getElementById('filingDate').value,
        courtName: document.getElementById('courtName').value,
        opposingParty: document.getElementById('opposingParty').value
    };
    
    // Update existing or add new
    if (currentClientId) {
        const index = clients.findIndex(client => client.id === currentClientId);
        if (index !== -1) {
            clients[index] = clientData;
        }
    } else {
        clients.push(clientData);
    }
    
    // Save to localStorage
    localStorage.setItem('legalClients', JSON.stringify(clients));
    
    // Reset form and update UI
    clientInfoForm.reset();
    currentClientId = null;
    renderClientList();
    
    // Show success message
    alert('Client information saved successfully!');
}

// Render the client list
function renderClientList() {
    clientList.innerHTML = '';
    
    clients.forEach(client => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = client.name;
        li.dataset.id = client.id;
        
        li.addEventListener('click', () => {
            // Load client data into form
            document.getElementById('clientName').value = client.name;
            document.getElementById('caseNumber').value = client.caseNumber;
            document.getElementById('caseType').value = client.caseType;
            document.getElementById('filingDate').value = client.filingDate;
            document.getElementById('courtName').value = client.courtName;
            document.getElementById('opposingParty').value = client.opposingParty;
            
            currentClientId = client.id;
            
            // Highlight selected client
            document.querySelectorAll('#clientList li').forEach(item => {
                item.classList.remove('active');
            });
            li.classList.add('active');
            
            // Load documents for this client
            loadClientDocuments(client.id);
        });
        
        clientList.appendChild(li);
    });
}

// Load documents for a client
function loadClientDocuments(clientId) {
    const clientDocuments = documents.filter(doc => doc.clientId === clientId);
    
    if (clientDocuments.length > 0) {
        // Load the most recent document
        const latestDoc = clientDocuments.sort((a, b) => 
            new Date(b.dateCreated) - new Date(a.dateCreated))[0];
        
        documentTitle.value = latestDoc.title;
        documentType.value = latestDoc.type;
        documentContent.value = latestDoc.content;
    } else {
        // Clear document editor
        documentTitle.value = '';
        documentType.value = '';
        documentContent.value = '';
    }
    
    // Hide results panel when switching clients
    resultsPanel.classList.add('d-none');
}

// Save document
function saveDocument() {
    if (!currentClientId) {
        alert('Please select a client first!');
        return;
    }
    
    if (!documentTitle.value || !documentType.value || !documentContent.value) {
        alert('Please fill in all document fields!');
        return;
    }
    
    const docData = {
        id: generateId(),
        clientId: currentClientId,
        title: documentTitle.value,
        type: documentType.value,
        content: documentContent.value,
        dateCreated: new Date().toISOString()
    };
    
    documents.push(docData);
    localStorage.setItem('legalDocuments', JSON.stringify(documents));
    
    alert('Document saved successfully!');
}

// Check document for inconsistencies
function checkDocumentConsistency() {
    if (!currentClientId) {
        alert('Please select a client first!');
        return;
    }
    
    if (!documentContent.value) {
        alert('Please enter document content to check!');
        return;
    }
    
    // Get current client data
    const client = clients.find(c => c.id === currentClientId);
    if (!client) return;
    
    // Clear previous results
    resultsContent.innerHTML = '';
    
    // Always show results panel
    resultsPanel.classList.remove('d-none');
    
    // Create an array of key information to check
    const keyInfo = [
        { key: 'name', value: client.name, label: 'Client Name' },
        { key: 'caseNumber', value: client.caseNumber, label: 'Case Number' },
        { key: 'courtName', value: client.courtName, label: 'Court Name' },
        { key: 'opposingParty', value: client.opposingParty, label: 'Opposing Party' },
        { key: 'filingDate', value: formatDate(client.filingDate), label: 'Filing Date' }
    ];
    
    // Get document content
    const content = documentContent.value;
    
    // Track if we found any inconsistencies
    let foundInconsistencies = false;
    
    // Check each key piece of information
    keyInfo.forEach(info => {
        if (!info.value) return; // Skip empty values
        
        // Create variations to check (common typos, etc.)
        const variations = generateVariations(info.value);
        
        // Check for inconsistencies
        variations.forEach(variation => {
            if (variation.text !== info.value && content.includes(variation.text)) {
                foundInconsistencies = true;
                
                // Create result item
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                // Find the context (surrounding text)
                const context = findContext(content, variation.text);
                
                resultItem.innerHTML = `
                    <div class="context">${escapeHtml(context.before)}<span class="inconsistency">${escapeHtml(variation.text)}</span>${escapeHtml(context.after)}</div>
                    <div>
                        <strong>Issue:</strong> Possible incorrect ${info.label.toLowerCase()}
                        <br>
                        <strong>Suggestion:</strong> Replace with <span class="suggestion" data-incorrect="${variation.text}" data-correct="${info.value}">${escapeHtml(info.value)}</span>
                    </div>
                `;
                
                // Add click event for suggestion
                resultItem.querySelector('.suggestion').addEventListener('click', function() {
                    const incorrect = this.dataset.incorrect;
                    const correct = this.dataset.correct;
                    documentContent.value = documentContent.value.replace(
                        new RegExp(escapeRegExp(incorrect), 'g'), 
                        correct
                    );
                    alert('Correction applied!');
                });
                
                resultsContent.appendChild(resultItem);
            }
        });
    });
    
    // Check for date inconsistencies
    checkDateInconsistencies(content, client.filingDate);
    
    // Results panel is already shown at the beginning of the function
    
    if (!foundInconsistencies && resultsContent.children.length === 0) {
        resultsContent.innerHTML = '<div class="alert alert-success">No inconsistencies found!</div>';
    }
}

// Check for date inconsistencies
function checkDateInconsistencies(content, filingDate) {
    if (!filingDate) return;
    
    // Convert to Date object
    const date = new Date(filingDate);
    
    // Different date formats to check
    const formats = [
        { format: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`, label: 'MM/DD/YYYY' },
        { format: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`, label: 'MM-DD-YYYY' },
        { format: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, label: 'DD/MM/YYYY' },
        { format: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`, label: 'DD-MM-YYYY' }
    ];
    
    // Month names
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Add text formats
    formats.push({ 
        format: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
        label: 'Month DD, YYYY'
    });
    formats.push({ 
        format: `${shortMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
        label: 'Mon DD, YYYY'
    });
    
    // Correct format (for suggestion)
    const correctFormat = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    
    // Check for dates that are not the filing date
    const dateRegex = /\b\d{1,2}[-\/]\d{1,2}[-\/]\d{4}\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}\b/g;
    
    let match;
    while ((match = dateRegex.exec(content)) !== null) {
        const foundDate = match[0];
        
        // Skip if it's the correct filing date in any format
        if (formats.some(f => f.format === foundDate)) {
            continue;
        }
        
        // Create result item
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        // Find the context
        const context = findContext(content, foundDate);
        
        resultItem.innerHTML = `
            <div class="context">${escapeHtml(context.before)}<span class="inconsistency">${escapeHtml(foundDate)}</span>${escapeHtml(context.after)}</div>
            <div>
                <strong>Issue:</strong> Possible incorrect date
                <br>
                <strong>Suggestion:</strong> If this should be the filing date, replace with <span class="suggestion" data-incorrect="${foundDate}" data-correct="${correctFormat}">${escapeHtml(correctFormat)}</span>
            </div>
        `;
        
        // Add click event for suggestion
        resultItem.querySelector('.suggestion').addEventListener('click', function() {
            const incorrect = this.dataset.incorrect;
            const correct = this.dataset.correct;
            documentContent.value = documentContent.value.replace(
                new RegExp(escapeRegExp(incorrect), 'g'), 
                correct
            );
            alert('Correction applied!');
        });
        
        resultsContent.appendChild(resultItem);
    }
}

// Generate variations of text (common typos, etc.)
function generateVariations(text) {
    if (!text) return [];
    
    const variations = [];
    
    // Original text
    variations.push({ text, type: 'original' });
    
    // For names, check for first/last name swaps
    if (/\s/.test(text)) {
        const parts = text.split(/\s+/);
        if (parts.length === 2) {
            variations.push({ 
                text: `${parts[1]}, ${parts[0]}`, 
                type: 'name-swap' 
            });
            variations.push({ 
                text: `${parts[1]} ${parts[0]}`, 
                type: 'name-swap' 
            });
        }
    }
    
    // Common typos (transposed letters)
    for (let i = 0; i < text.length - 1; i++) {
        const typo = text.substring(0, i) + 
                    text[i+1] + text[i] + 
                    text.substring(i+2);
        variations.push({ text: typo, type: 'typo' });
    }
    
    // Missing letters
    for (let i = 0; i < text.length; i++) {
        const typo = text.substring(0, i) + text.substring(i+1);
        variations.push({ text: typo, type: 'missing-letter' });
    }
    
    // Extra letters (duplications)
    for (let i = 0; i < text.length; i++) {
        const typo = text.substring(0, i) + text[i] + text[i] + text.substring(i+1);
        variations.push({ text: typo, type: 'extra-letter' });
    }
    
    return variations;
}

// Find context around a string in text
function findContext(text, searchString) {
    const index = text.indexOf(searchString);
    if (index === -1) return { before: '', after: '' };
    
    // Get context (20 chars before and after)
    const startIndex = Math.max(0, index - 20);
    const endIndex = Math.min(text.length, index + searchString.length + 20);
    
    return {
        before: text.substring(startIndex, index),
        after: text.substring(index + searchString.length, endIndex)
    };
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Escape string for use in RegExp
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
