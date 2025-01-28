import {BookingEntity} from "../entities/booking_entity";
import {PropertyEntity} from "../entities/property_entity";
import {UserEntity} from "../entities/user_entity";
import {BookingMapper} from "./booking_mapper";
import {Booking} from "../../../domain/entities/booking";
import {DateRange} from "../../../domain/value_objects/date_range";
import {Property} from "../../../domain/entities/property";
import {User} from "../../../domain/entities/user";

describe("BookingMapper", () => {
  it("deve converter BookingEntity em Booking corretamente", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Property Name";
    propertyEntity.description = "Property Description";
    propertyEntity.maxGuests = 2;
    propertyEntity.basePricePerNight = 50;

    const userEntity = new UserEntity();
    userEntity.id = "1";
    userEntity.name = "User Name";

    const bookingEntity = new BookingEntity();
    bookingEntity.id = "1";
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = new Date(`2025-02-01`);
    bookingEntity.endDate = new Date(`2025-02-03`);
    bookingEntity.guestCount = 2;
    bookingEntity.totalPrice = 100;
    bookingEntity.status = "CONFIRMED";

    const booking = BookingMapper.toDomain(bookingEntity);
    expect(booking).not.toBeNull();
    expect(booking).not.toBeUndefined();
    expect(booking).toBeInstanceOf(Booking);
    expect(booking.getId()).toBe("1");
    expect(booking.getProperty().getId()).toBe("1");
    expect(booking.getGuest().getId()).toBe("1");
    expect(booking.getDateRange().getStartDate()).toStrictEqual(new Date(`2025-02-01`));
    expect(booking.getDateRange().getEndDate()).toStrictEqual(new Date(`2025-02-03`));
    expect(booking.getGuestCount()).toBe(2);
    expect(booking.getTotalPrice()).toBe(100);
    expect(booking.getStatus()).toBe("CONFIRMED");
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const property = new Property(
      "1",
      "Property Name",
      "Property Description",
      2,
      50
    );

    const user = new User(
      "1",
      "User Name"
    );

    const dataRagne = new DateRange(
      new Date(`2025-02-01`),
      new Date(`2025-02-03`)
    );

    const booking = new Booking(
      "1",
      property,
      user,
      dataRagne,
      2
    );

    const bookingEntity = BookingMapper.toPersistence(booking);
    expect(bookingEntity).not.toBeNull();
    expect(bookingEntity).not.toBeUndefined();
    expect(bookingEntity).toBeInstanceOf(BookingEntity);
    expect(bookingEntity.id).toBe("1");
    expect(bookingEntity.property.id).toBe("1");
    expect(bookingEntity.guest.id).toBe("1");
    expect(bookingEntity.startDate).toStrictEqual(new Date(`2025-02-01`));
    expect(bookingEntity.endDate).toStrictEqual(new Date(`2025-02-03`));
    expect(bookingEntity.guestCount).toBe(2);
    expect(bookingEntity.totalPrice).toBe(100);
    expect(bookingEntity.status).toBe("CONFIRMED");
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Property Name";
    propertyEntity.description = "Property Description";
    propertyEntity.maxGuests = 2;
    propertyEntity.basePricePerNight = 50;

    const userEntity = new UserEntity();
    userEntity.id = "1";
    userEntity.name = "User Name";

    expect(() => {
      const bookingEntity = new BookingEntity();
      BookingMapper.toDomain(bookingEntity);
    }).toThrow("Property não pode ser nulo");

    expect(() => {
      const bookingEntity = new BookingEntity();
      bookingEntity.property = propertyEntity;
      BookingMapper.toDomain(bookingEntity);
    }).toThrow("Guest não pode ser nulo");

    expect(() => {
      const bookingEntity = new BookingEntity();
      bookingEntity.id = "1";
      bookingEntity.property = propertyEntity;
      bookingEntity.guest = userEntity;
      bookingEntity.startDate = new Date(`2025-02-01`);
      bookingEntity.endDate = new Date(`2025-02-03`);
      bookingEntity.guestCount = 0;
      bookingEntity.totalPrice = 100;
      bookingEntity.status = "CONFIRMED";
      BookingMapper.toDomain(bookingEntity);
    }).toThrow("O número de hóspedes deve ser maior que zero.");

    expect(() => {
      let data = new Date();
      const bookingEntity = new BookingEntity();
      bookingEntity.id = "1";
      bookingEntity.property = propertyEntity;
      bookingEntity.guest = userEntity;
      bookingEntity.startDate = data;
      bookingEntity.endDate = data;
      bookingEntity.guestCount = 2;
      bookingEntity.totalPrice = 100;
      bookingEntity.status = "CONFIRMED";
      BookingMapper.toDomain(bookingEntity);
    }).toThrow("A data de início e término não podem ser iguais.");
  });
});
