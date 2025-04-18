document.addEventListener('DOMContentLoaded', fetchJobs);

function fetchJobs() {
    fetch('/jobs')
        .then(response => response.json())
        .then(data => {
            const jobListings = document.getElementById('job-listings');
            jobListings.innerHTML = data.map(job => `
                <div class="job-post" onclick="window.location.href='/job/${job.id}'">
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
        });
}


document.getElementById('search-bar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchJobs();
    }
});

function searchJobs() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const jobPosts = document.querySelectorAll('.job-post');

    jobPosts.forEach(post => {
        if (post.textContent.toLowerCase().includes(query)) {
            post.parentElement.style.display = 'block'; // Show parent <a>
        } else {
            post.parentElement.style.display = 'none'; // Hide parent <a>
        }
    });
}

function navigateTo(page) {
    alert(`Navigating to ${page} page...`);
}


// function searchJobs() {
//     const query = document.getElementById('search-bar').value.toLowerCase();
//     const jobPosts = document.querySelectorAll('.job-post');
//     jobPosts.forEach(post => {
//         if (post.textContent.toLowerCase().includes(query)) {
//             post.style.visibility = 'visible'; // Keep the tile in the layout
//             post.style.height = 'auto'; // Reset height
//             post.style.opacity = 1; // Ensure it's fully visible
//         } else {
//             post.style.visibility = 'hidden'; // Hide the tile
//             post.style.height = 0; // Minimize height
//             post.style.opacity = 0; // Fade out for smooth effect
//         }
//     });
// }


function navigateTo(page) {
    alert(`Navigating to ${page} page...`);
}
