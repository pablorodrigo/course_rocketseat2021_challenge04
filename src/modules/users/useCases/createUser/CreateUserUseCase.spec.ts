/**
 * Created by Pablo Silva
 * Date: 2021/07/14
 * Time: 19:33
 */
import {CreateUserUseCase} from "./CreateUserUseCase";
import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserError} from "./CreateUserError";

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Created a user - UseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "name user",
      email: "email@example.com",
      password: "password"
    })

    // console.log(user);

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user if already exists", async () => {

    await expect(async () => {
      await createUserUseCase.execute({
        name: "name user1",
        email: "email@example.com",
        password: "password"
      })

      await createUserUseCase.execute({
        name: "name user2",
        email: "email@example.com",
        password: "password"
      })


    }).rejects.toBeInstanceOf(CreateUserError);

  });


});
