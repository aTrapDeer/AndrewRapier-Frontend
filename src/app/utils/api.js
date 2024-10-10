const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export async function fetchData(resource, options = {}) {
    console.log(`Fetching data for ${resource}`);
    const res = await fetch(`${API_BASE_URL}/${resource}`, {
        next: { revalidate: 3600 },
        ...options
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch ${resource}`);
    }
    const data = await res.json();
    console.log(`Fetched data for ${resource}:`, data);
    return data;
}

export const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
    }
    const data = await res.json();
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authToken', data.token); // Assuming the backend returns a token
    return data;
};

export const fetchUser = async () => {
    const res = await fetch(`${API_BASE_URL}/user`);
    if (!res.ok){
        throw new Error("Failed to fetch user");
    }
    return res.json();
};

export const createUser = async (user) => {
    const res = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    if (!res.ok){
        throw new Error("Failed to create user");
    }
    return res.json();
};

// Create new website post, music post, contribution post, skills or education post
export const fetchResource = async (resource) => {
    let endpoint;
    switch(resource) {
        case 'websites':
            endpoint = 'websites';
            break;
        case 'music':
            endpoint = 'music';
            break;
        case 'contributions':
            endpoint = 'contributions';
            break;
        case 'skills':
            endpoint = 'skills';
            break;
        case 'education':
            endpoint = 'education';
            break;
        default:
            throw new Error(`Unknown resource: ${resource}`);
    }
    console.log(`Fetching from endpoint: ${API_BASE_URL}/${endpoint}`);
    const token = localStorage.getItem('authToken');
    console.log(`Using token: ${token}`);
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    console.log(`Response status: ${res.status}`);
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`Failed to fetch ${resource}: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`Fetched data:`, data);
    return data;
};

export const createResource = async (resource, data) => {
    try {
        console.log(`Sending POST request to: ${API_BASE_URL}/${resource}`);
        console.log('Request data:', data);
        const res = await fetch(`${API_BASE_URL}/${resource}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(data),
        });
        console.log('Response status:', res.status);
        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.error || `Failed to create ${resource}`);
        }
        const responseData = await res.json();
        console.log('Response data:', responseData);
        return responseData;
    } catch (error) {
        console.error(`Error creating ${resource}:`, error);
        throw error;
    }
};

export const fetchWebsites = () => fetchResource('websites');
export const createWebsite = (data) => createResource('websites', data);

export const fetchMusicWorks = () => fetchResource('music-works');
export const createMusicWork = (data) => createResource('music-works', data);

export const fetchContributions = () => fetchResource('contributions');
export const createContribution = (data) => createResource('contributions', data);

export const fetchSkills = () => fetchResource('skills');
export const createSkill = (data) => createResource('skills', data);

export const fetchEducation = () => fetchResource('education');
export const createEducation = (data) => createResource('education', data);

export const deleteResource = async (resource, id) => {
    console.log(`Deleting ${resource} with id:`, id); // Add this log
    const res = await fetch(`${API_BASE_URL}/${resource}?id=${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
        },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to delete ${resource}`);
    }
    return res.json();
};

export const fetchResourceById = async (resource, id) => {
    if (!resource || !id) {
        console.error('Resource or ID is undefined:', { resource, id });
        throw new Error('Resource or ID is undefined');
    }
    console.log(`Fetching ${resource} with id: ${id}`);
    try {
        const response = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch ${resource}: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`Fetched data for ${resource}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching ${resource}:`, error);
        throw error;
    }
};

export const updateResource = async (resource, id, data) => {
    console.log(`Updating ${resource} with id: ${id}`, data);
    try {
        const response = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Failed to update ${resource}: ${response.status} ${response.statusText}`);
        }
        const updatedData = await response.json();
        console.log(`Updated data for ${resource}:`, updatedData);
        return updatedData;
    } catch (error) {
        console.error(`Error updating ${resource}:`, error);
        throw error;
    }
};