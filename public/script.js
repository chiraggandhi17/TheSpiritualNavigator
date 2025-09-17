const form = document.getElementById('vritti-form');
const input = document.getElementById('vritti-input');
const resultsContainer = document.getElementById('results-container');
const loader = document.getElementById('loader');

// This is the core function that talks to our Python backend
async function callBackend(data) {
    loader.classList.remove('hidden');
    resultsContainer.innerHTML = ''; // Clear previous results

    try {
        const response = await fetch('/.netlify/functions/navigator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        return result.data; // We expect the Python function to return a list
        
    } catch (error) {
        console.error('Error calling backend:', error);
        resultsContainer.innerHTML = `<p style="color: red;">An error occurred. Please try again.</p>`;
        return null;
    } finally {
        loader.classList.add('hidden');
    }
}

// Handle the initial form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const vritti = input.value.trim();
    if (!vritti) return;
    
    // Stage 1: Get the lineages
    const lineages = await callBackend({ stage: 'get_lineages', vritti: vritti });

    if (lineages) {
        resultsContainer.innerHTML = `<h2>Choose a path to explore further:</h2>`;
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        lineages.forEach(lineage => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.innerText = lineage;
            // You would add a click event here to go to the next stage (getting masters)
            button.onclick = () => alert(`You clicked ${lineage}! Next step is to build the logic to show the masters.`);
            buttonContainer.appendChild(button);
        });
        resultsContainer.appendChild(buttonContainer);
    }
});