const axios = require('axios');

const API_URL = 'http://127.0.0.1:8000/api';

async function fetchUnoptimizedArticles() {
    try {
        const response = await axios.get(`${API_URL}/articles?is_optimized=false`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        return [];
    }
}

async function updateArticle(id, data) {
    try {
        const response = await axios.put(`${API_URL}/articles/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating article ${id}:`, error.message);
        throw error;
    }
}

async function publishArticle(data) {
    try {
        const response = await axios.post(`${API_URL}/articles`, data);
        return response.data;
    } catch (error) {
        console.error('Error publishing article:', error.message);
        throw error;
    }
}

module.exports = {
    fetchUnoptimizedArticles,
    updateArticle,
    publishArticle
};
