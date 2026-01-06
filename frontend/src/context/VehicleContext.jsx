import { useState, useEffect, useContext, createContext } from "react";
import {
  getAllVehicles,
  getVehicle,
  getMyVehicles,
  getLatestVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../pages/services/vehicleService";

const VehicleContext = createContext();

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle must be used within a VehicleProvider");
  }
  return context;
};

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const fetchAllVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllVehicles();
      setVehicles(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vehicles");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicle = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVehicle(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyVehicles = async (userEmail) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyVehicles(userEmail);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch your vehicles");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLatestVehicles();
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch latest vehicles"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createVehicle(vehicleData);
      setVehicles((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editVehicle = async (id, vehicleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateVehicle(id, vehicleData);
      setVehicles((prev) =>
        prev.map((vehicle) => (vehicle._id === id ? response.data : vehicle))
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeVehicle = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((vehicle) => vehicle._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    vehicles,
    loading,
    error,
    clearError,
    fetchAllVehicles,
    fetchVehicle,
    fetchMyVehicles,
    fetchLatestVehicles,
    addVehicle,
    editVehicle,
    removeVehicle,
  };

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
};
