import { useState, useCallback } from 'react';
import * as vehicleService from '../services/vehicleService';

export const useVehicles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get latest vehicles
  const getLatestVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vehicles = await vehicleService.getLatestVehicles();
      return vehicles;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch latest vehicles';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new vehicle
  const createVehicle = useCallback(async (vehicleData) => {
    setLoading(true);
    setError(null);
    try {
      const newVehicle = await vehicleService.createVehicle(vehicleData);
      return newVehicle;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create vehicle';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get vehicles for the current user
  const getMyVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vehicles = await vehicleService.getMyVehicles();
      return vehicles;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch your vehicles';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing vehicle
  const updateVehicle = useCallback(async (id, vehicleData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 useVehicles: Updating vehicle', id, vehicleData);
      const updatedVehicle = await vehicleService.updateVehicle(id, vehicleData);
      return updatedVehicle;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update vehicle';
      console.error('❌ useVehicles update error:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a vehicle
  const deleteVehicle = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await vehicleService.deleteVehicle(id);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete vehicle';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single vehicle by ID
  const getVehicleById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const vehicle = await vehicleService.getVehicleById(id);
      return vehicle;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch vehicle';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all vehicles with optional filters
  const getAllVehicles = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const vehicles = await vehicleService.getAllVehicles(filters);
      return vehicles;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch vehicles';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    getVehicleById,
    getAllVehicles,
    getMyVehicles,
    getLatestVehicles, // ✅ ADDED: This was missing!
    createVehicle,
    updateVehicle,
    deleteVehicle,
    clearError
  };
};