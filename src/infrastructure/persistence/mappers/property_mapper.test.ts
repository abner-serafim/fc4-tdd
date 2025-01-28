import {BookingEntity} from "../entities/booking_entity";
import {PropertyEntity} from "../entities/property_entity";
import {UserEntity} from "../entities/user_entity";
import {BookingMapper} from "./booking_mapper";
import {Booking} from "../../../domain/entities/booking";
import {DateRange} from "../../../domain/value_objects/date_range";
import {Property} from "../../../domain/entities/property";
import {User} from "../../../domain/entities/user";
import {PropertyMapper} from "./property_mapper";

describe("BookingMapper", () => {
  it("deve converter PropertyEntity em Property corretamente", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Property Name";
    propertyEntity.description = "Property Description";
    propertyEntity.maxGuests = 2;
    propertyEntity.basePricePerNight = 50;

    const property = PropertyMapper.toDomain(propertyEntity);
    expect(property).not.toBeNull();
    expect(property).not.toBeUndefined();
    expect(property).toBeInstanceOf(Property);
    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Property Name");
    expect(property.getDescription()).toBe("Property Description");
    expect(property.getMaxGuests()).toBe(2);
    expect(property.getBasePricePerNight()).toBe(50);
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      2,
      50
    );

    const propertyEntity = PropertyMapper.toPersistence(property);
    expect(propertyEntity).not.toBeNull();
    expect(propertyEntity).not.toBeUndefined();
    expect(propertyEntity).toBeInstanceOf(PropertyEntity);
    expect(propertyEntity.id).toBe("1");
    expect(propertyEntity.name).toBe("Property Name");
    expect(propertyEntity.description).toBe("Property Description");
    expect(propertyEntity.maxGuests).toBe(2);
    expect(propertyEntity.basePricePerNight).toBe(50);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    expect(() => {
      const propertyEntity = new PropertyEntity();
      propertyEntity.id = "1";
      propertyEntity.name = "";
      propertyEntity.description = "Property Description";
      propertyEntity.maxGuests = 5;
      propertyEntity.basePricePerNight = 50;
      PropertyMapper.toDomain(propertyEntity);
    }).toThrow("O nome é obrigatório");

    expect(() => {
      const propertyEntity = new PropertyEntity();
      propertyEntity.id = "1";
      propertyEntity.name = "Property Name";
      propertyEntity.description = "Property Description";
      propertyEntity.maxGuests = 0;
      propertyEntity.basePricePerNight = 50;
      PropertyMapper.toDomain(propertyEntity);
    }).toThrow("O número máximo de hóspedes deve ser maior que zero");
  });
});
