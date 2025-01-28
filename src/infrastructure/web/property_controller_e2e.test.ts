import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyService } from "../../application/services/property_service";
import { PropertyEntity } from "../persistence/entities/property_entity";
import {PropertyController} from "./property_controller";
import {BookingEntity} from "../persistence/entities/booking_entity";
import {UserEntity} from "../persistence/entities/user_entity";
const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );

  propertyService = new PropertyService(propertyRepository);

  propertyController = new PropertyController(propertyService);

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("PropertyController", () => {
  beforeAll(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);
    const userRepo = dataSource.getRepository(UserEntity);
    const bookingRepo = dataSource.getRepository(BookingEntity);

    await bookingRepo.clear();
    await propertyRepo.clear();
    await userRepo.clear();
  });

  it("deve criar uma propriedade com sucesso", async () => {
    const response = await request(app).post("/properties").send({
      name: "Nice Place",
      description: "A nice place",
      max_guests: 4,
      base_price_per_night: 100,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Property created successfully");
    expect(response.body.property).toHaveProperty("id");
    expect(response.body.property).toHaveProperty("name", "Nice Place");
    expect(response.body.property).toHaveProperty("description", "A nice place");
    expect(response.body.property).toHaveProperty("max_guests", 4);
    expect(response.body.property).toHaveProperty("base_price_per_night", 100);
  });

  it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/properties").send({
      name: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O nome é obrigatório");
  });

  it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
    const response = await request(app).post("/properties").send({
      name: "Nice Place",
      description: "A nice place",
      max_guests: 0,
      base_price_per_night: 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O número máximo de hóspedes deve ser maior que zero");
  });

  it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const response = await request(app).post("/properties").send({
      name: "Nice Place",
      description: "A nice place",
      max_guests: 2,
      base_price_per_night: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O preço base por noite deve ser maior que zero");
  });
});
