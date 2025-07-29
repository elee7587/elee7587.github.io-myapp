// Adjust this to your deployed Flask backend URL:
const BACKEND_URL = 'http://127.0.0.1:5000/upload';

let predictionsGlobal = [];  // store all predictions globally for search & stats

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
        predictionsGlobal = data.predictions;  // save for later

        // Show summary stats
        displaySummaryStats(predictionsGlobal);

        // Show all predictions (optional)
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `<p>Predictions loaded: ${predictionsGlobal.length} restaurants. Use the search box below.</p>`;

    } catch (error) {
        alert('Upload failed: ' + error.message);
    }
});

function displaySummaryStats(predictions) {
    const total = predictions.length;
    const passCount = predictions.filter(p => p.predicted_label === 1).length;
    const failCount = total - passCount;
    const passPercent = ((passCount / total) * 100).toFixed(1);
    const failPercent = ((failCount / total) * 100).toFixed(1);

    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `
        <p>Number of restaurants that will pass: ${passCount}</p>
        <p>Number of restaurants that will fail: ${failCount}</p>
        <p>Percentage of restaurants that will pass: ${passPercent}%</p>
        <p>Percentage of restaurants that will fail: ${failPercent}%</p>
    `;
}

// Search functionality:
document.getElementById('searchButton').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const outputDiv = document.getElementById('searchResult');

    if (!searchInput) {
        outputDiv.textContent = 'Please enter a restaurant name to search.';
        return;
    }

    // Find matching restaurant (case-insensitive)
    const found = predictionsGlobal.find(p => p.restaurant.toLowerCase() === searchInput);

    if (found) {
        const status = found.predicted_label === 1 ? 'will pass the health inspection.' : 'will fail the health inspection.';
        outputDiv.textContent = `${found.restaurant} ${status}`;

    } else {
        outputDiv.textContent = `Restaurant "${searchInput}" not found in predictions.`;
    }
});
