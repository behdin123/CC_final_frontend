import axios from 'axios';

export default {
  
  // Create Catalog
  createCatalog: async (data) => {
    try {
      const response = await axios.post('https://cc-final-backend.onrender.com/catalog/create', data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error('Failed to create catalog:', error);
      throw error;
    }
  },

  // Get All Catalogs
  getAllCatalogs: async () => {
    try {
      const response = await axios.get('https://cc-final-backend.onrender.com/catalog/list', { withCredentials: true });
      console.log("Received data from backend:", response.data);
      return response.data.catalogs;
    } catch (error) {
      console.error('Failed to fetch catalogs:', error);
      throw error;
    }
  },

  // Get Catalog by ID
  getCatalogById: async (catalogId) => {
    try {
      const response = await axios.get(`https://cc-final-backend.onrender.com/catalog/${catalogId}`, { withCredentials: true });
      return response.data.catalog;
    } catch (error) {
      console.error('Failed to fetch catalog:', error);
      throw error;
    }
  },

  // Update Catalog
  updateCatalog: async (catalogId, updatedCatalog) => {
    try {
      const response = await axios.put(`https://cc-final-backend.onrender.com/catalog/edit/${catalogId}`, updatedCatalog, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update catalog:', error);
      throw error;
    }
  },

  // Remove Catalog
  removeCatalog: async (catalogId) => {
    try {
      const response = await axios.delete(`https://cc-final-backend.onrender.com/catalog/remove/${catalogId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Failed to remove catalog:', error);
      throw error;
    }
  },
};