import { Request, Response } from 'express';
import { vehicleService } from './vehicle.service';

export const vehicleController = {
  // Create vehicle
  async createVehicle(req: Request, res: Response) {
    try {
      const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

      if (!vehicle_name || !type || !registration_number || daily_rent_price === undefined || !availability_status) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          errors: 'All fields are required'
        });
      }

      const vehicle = await vehicleService.createVehicle({
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
      });

      res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: vehicle
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Error creating vehicle',
        errors: error.message
      });
    }
  },

  // Get all vehicles
  async getAllVehicles(req: Request, res: Response) {
    try {
      const vehicles = await vehicleService.getAllVehicles();

      if (vehicles.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No vehicles found',
          data: []
        });
      }

      res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: vehicles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving vehicles',
        errors: error.message
      });
    }
  },

  // Get vehicle by ID
  async getVehicleById(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params as { vehicleId: string };
      const vehicle = await vehicleService.getVehicleById(parseInt(vehicleId));

      res.status(200).json({
        success: true,
        message: 'Vehicle retrieved successfully',
        data: vehicle
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found',
        errors: error.message
      });
    }
  },

  // Update vehicle
  async updateVehicle(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params as { vehicleId: string };
      const vehicle = await vehicleService.updateVehicle(parseInt(vehicleId), req.body);

      res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicle
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Error updating vehicle',
        errors: error.message
      });
    }
  },

  // Delete vehicle
  async deleteVehicle(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params as { vehicleId: string };
      await vehicleService.deleteVehicle(parseInt(vehicleId));

      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Error deleting vehicle',
        errors: error.message
      });
    }
  }
};
