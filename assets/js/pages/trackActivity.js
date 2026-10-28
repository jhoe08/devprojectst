// const params = new URLSearchParams(window.location.search);
// console.log(params.get("prnumber"));
// console.log(params.get("trackActivity"));


document.addEventListener("DOMContentLoaded", function () {
    const trackActivity = document.getElementById("trackActivity");

    trackActivity.addEventListener("click", async function () {
        const prnumber = params.get("prnumber");
        if (prnumber) {
            try {
                const response = await fetch('/trackActivity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prnumber })
                });

                if (!response.ok) {
                    const error = await response.json();
                    console.error('Error:', error);
                    return;
                }

                const html = await response.text();
                document.getElementById('activityContainer').innerHTML = html;
            } catch (err) {
                console.error('Request failed:', err);
            }
        }
    });
})