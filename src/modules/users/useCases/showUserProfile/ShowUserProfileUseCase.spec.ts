/**
 * Created by Pablo Silva
 * Date: 2021/07/20
 * Time: 14:14
 */
import { v4 as uuidV4 } from "uuid";

import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserUseCase} from "../createUser/CreateUserUseCase";
import {ShowUserProfileUseCase} from "./ShowUserProfileUseCase";
import {ICreateUserDTO} from "../createUser/ICreateUserDTO";
import {AppError} from "../../../../shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

interface ICreateUserDTOTest {
  id?: string;
  name: string;
  email: string;
  password: string;
}

describe("Show Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });
  it("should be able to show user profile", async () => {
    const userDTO: ICreateUserDTO = {
      name: "user",
      email: "email@test.com",
      password: "password",
    };

    const userCreated = await createUserUseCase.execute(userDTO);

    const result = await showUserProfileUseCase.execute(
      userCreated.id as string
    );

    expect(userCreated).toEqual(result);
  });
  it("should not be able to show user profile of a nonexistence user", async () => {
    const nonUser: ICreateUserDTOTest = {
      id: uuidV4(),
      name: "user",
      email: "email@test.com",
      password: "password",
    };

    await expect(async () => {
      await showUserProfileUseCase.execute(nonUser.id as string);
    }).rejects.toBeInstanceOf(AppError);
  });
});
