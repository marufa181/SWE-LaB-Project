import API from './api';

export const getAllVehicles = async (filters = {}) => {
  try {
    const response = await API.get('/vehicles', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error in getAllVehicles service:', error);
    throw error;
  }
};

export const getVehicleById = async (id) => {
  try {
    const response = await API.get(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in getVehicleById service:', error);
    throw error;
  }
};

export const getVehicle = async (id) => {
  try {
    const response = await API.get(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in getVehicle service:', error);
    throw error;
  }
};

export const getMyVehicles = async () => {
  try {
    const response = await API.get('/vehicles/my-vehicles');
    return response.data;
  } catch (error) {
    console.error('Error in getMyVehicles service:', error);
    throw error;
  }
};

export const getMyVehiclesByEmail = async (userEmail) => {
  try {
    const response = await API.get(`/vehicles/user/${userEmail}`);
    return response.data;
  } catch (error) {
    console.error('Error in getMyVehiclesByEmail service:', error);
    throw error;
  }
};

export const getLatestVehicles = async () => {
  try {
    const response = await API.get('/vehicles/latest');
    return response.data;
  } catch (error) {
    console.error('Error in getLatestVehicles service:', error);
    throw error;
  }
};

export const createVehicle = async (vehicleData) => {
  try {
    const response = await API.post('/vehicles', vehicleData);
    return response.data;
  } catch (error) {
    console.error('Error in createVehicle service:', error);
    throw error;
  }
};

export const updateVehicle = async (id, vehicleData) => {
  try {
    console.log('🔄 Updating vehicle in service:', id, vehicleData);
    const response = await API.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  } catch (error) {
    console.error('❌ Error in updateVehicle service:', error);
    if (error.response) {
      const enhancedError = new Error(error.response.data.message || 'Failed to update vehicle');
      enhancedError.status = error.response.status;
      throw enhancedError;
    }
    throw error;
  }
};

export const deleteVehicle = async (id) => {
  try {
    const response = await API.delete(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteVehicle service:', error);
    throw error;
  }
};