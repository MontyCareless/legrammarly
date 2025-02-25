# Legal Document Checker

A web application for lawyers to ensure consistency across legal documents. This tool helps identify inconsistencies in client names, case numbers, dates, and other critical information across legal documents.

## Features

- **Client Information Management**: Store and manage client details including names, case numbers, filing dates, and more.
- **Document Editor**: Create and edit legal documents with a simple text editor.
- **Consistency Checking**: Automatically detect inconsistencies between stored client information and document content.
- **Smart Suggestions**: Get suggestions for corrections when inconsistencies are found.
- **Highlighting**: Inconsistencies are highlighted in red for easy identification.
- **Local Storage**: All data is stored locally in your browser for privacy.

## How to Use

1. **Add Client Information**:
   - Fill out the client information form on the left side of the application.
   - Click "Save Client Information" to store the client details.

2. **Create or Edit Documents**:
   - Select a client from the list to work with their documents.
   - Enter a document title and select a document type.
   - Type or paste your document content in the editor.
   - Click "Save Document" to store the document.

3. **Check for Inconsistencies**:
   - With a document open, click "Check Document" to analyze for inconsistencies.
   - The system will compare the document content with the stored client information.
   - Any inconsistencies will be highlighted and displayed in the results panel.

4. **Apply Corrections**:
   - Click on the suggested corrections to automatically apply them to your document.
   - Save the document again to store the corrected version.

## Types of Inconsistencies Detected

- **Name Variations**: Detects typos, misspellings, or incorrect formats of client names.
- **Case Number Errors**: Identifies incorrect or inconsistent case numbers.
- **Date Inconsistencies**: Finds dates that don't match the filing date or are in incorrect formats.
- **Court Name Variations**: Catches inconsistencies in court names.
- **Opposing Party Errors**: Detects mistakes in opposing party names.

## Technical Details

- Built with HTML, CSS, and JavaScript
- Uses Bootstrap for responsive design
- Stores data in browser's localStorage
- No server-side processing - all checks happen in the browser

## Getting Started

Simply open the `index.html` file in your web browser to start using the application. No installation or internet connection required.
