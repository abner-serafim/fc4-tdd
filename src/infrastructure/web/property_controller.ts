import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";
import { PropertyService } from "../../application/services/property_service";
import { Request, Response } from "express";

export class PropertyController {
  private propertyService: PropertyService;

  constructor(propertyService: PropertyService) {
    this.propertyService = propertyService;
  }

  async createProperty(req: Request, res: Response): Promise<Response> {
    try {
      const dto: CreatePropertyDTO = {
        name: req.body.name || "",
        description: req.body.description || "",
        max_guests: req.body.max_guests || 0,
        base_price_per_night: req.body.base_price_per_night || 0,
      };

      const property = await this.propertyService.createProperty(dto);

      return res.status(201).json({
        message: "Property created successfully",
        property: {
          id: property.getId(),
          name: property.getName(),
          description: property.getDescription(),
          max_guests: property.getMaxGuests(),
          base_price_per_night: property.getBasePricePerNight(),
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occurred" });
    }
  }
}
