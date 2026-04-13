// request.js
export async function postData(url, data) {
    try {
        console.log('POSTing to', url, 'with data:', data);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) // Ensure data is properly stringified
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        // console.error("POST failed:", error);
        notifyCustom(
            'exclamation',
            'POST failed',
            error,
            'danger'
        );
        throw error;
    }
}

export async function deleteData(url) {
    try {
        const response = await fetch(url, { method: 'DELETE' });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        // console.error("DELETE failed:", error);
        notifyCustom(
            'exclamation',
            'DELETE failed',
            error,
            'danger'
        );
        throw error;
    }
}

export async function getData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        // console.error("GET failed:", error);
        notifyCustom(
            'exclamation',
            'GET failed',
            error,
            'danger'
        );
        throw error;
    }
}

export async function updateData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'PUT', // or 'PATCH' if your API supports partial updates
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        // console.error("UPDATE failed:", error);
        notifyCustom(
            'exclamation',
            'UPDATE failed',
            error,
            'danger'
        );
        throw error;
    }
}
