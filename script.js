// Adjust this to your deployed Flask backend URL:
const BACKEND_URL = 'https://your-backend-domain.com/upload';

document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('csvFile');
    if (!fileInput.files.length) {
        alert('Please select a CSV file to upload.');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            alert('Error: ' + (err.error || response.statusText));
            return;
        }

        const data = await response.json();
        console.log('Predictions:', data.predictions);

        // Display predictions on page
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '<h3>Predictions:</h3><ul>' +
            data.predictions.map(p => `<li>${p}</li>`).join('') +
            '</ul>';

    } catch (error) {
        alert('Upload failed: ' + error.message);
    }
});
