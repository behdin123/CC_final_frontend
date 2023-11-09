import axios from 'axios';

export default {


// Register a new user
register: async (data) => {
    try {
        
      console.log("Request body:", data);
      const response = await axios.post(`http://localhost:3000/auth/register`, data);  
     
      return response;

    } catch (error) {
      throw error;
    }
  },

  // Login a user
  login: async (data) => {
    try {
        
      console.log("Request body:", data);
      const response = await axios.post(`http://localhost:3000/auth/login`, data, { withCredentials: true });
     
      return response;
    } catch (error) {
      throw error;
    }
  },


}