//app.js
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
if (!userId) {
    window.location.href = '/login.html';
  }

document.addEventListener('DOMContentLoaded', () => {
    fetchJobs(); // Load all jobs on page load

    document.getElementById('search-bar').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchJobs();
        }
    });
});

// Fetch all jobs or search based on the term
function fetchJobs(searchTerm = '') {
    const url = searchTerm.trim() === '' 
        ? '/jobs' 
        : `/search-secure?q=${encodeURIComponent(searchTerm)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const jobListings = document.getElementById('job-listings');
            jobListings.innerHTML = data.map(job => `
                <div class="job-post" onclick="window.location.href='/job/${job.id}?userId=${userId}'" style="cursor: pointer;">
                    <div class="job-left">
                        <h2>${job.title}</h2>
                        <p><span>Company:</span> ${job.company}</p>
                        <p><span>Location:</span> ${job.location}</p>
                    </div>
                    <div class="job-right">
                        <p><span>CTC:</span> ${job.ctc}</p>
                        <p><span>Status:</span> ${job.vacancy}</p>
                    </div>
                </div>
            `).join('');
        })
        .catch(err => console.error('Error fetching jobs:', err));  // Error handling for fetch
}

// Search function to fetch jobs based on search input
function searchJobs() {
    const query = document.getElementById('search-bar').value;
    fetchJobs(query);
}

function navigateTo(page) {
    alert(`Navigating to ${page} page...`);
}
