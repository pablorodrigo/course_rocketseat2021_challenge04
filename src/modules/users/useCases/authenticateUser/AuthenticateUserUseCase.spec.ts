/**
 * Created by Pablo Silva
 * Date: 2021/07/19
 * Time: 13:16
 */
import 'reflect-metadata';
import {AuthenticateUserUseCase} from "./AuthenticateUserUseCase";
import {CreateUserUseCase} from "../createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {ICreateUserDTO} from "../createUser/ICreateUserDTO";
import {IncorrectEmailOrPasswordError} from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository =new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "name",
      email: "email",
      password: "password"
    };

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {

    const user: ICreateUserDTO = {
      name: "name",
      email: "email",
      password: "password"
    };

    await createUserUseCase.execute(user)

    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: "email@fake.com",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });


  it("should not be able to authenticate with incorrect password", async () => {
    await expect(async () => {

      const user: ICreateUserDTO = {
        email: "email@test.com",
        password: "123",
        name: "name password error",
      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "1234",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

});
