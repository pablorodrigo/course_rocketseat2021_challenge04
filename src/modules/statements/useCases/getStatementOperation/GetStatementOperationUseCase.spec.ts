/**
 * Created by Pablo Silva
 * Date: 2021/07/20
 * Time: 15:09
 */
import { v4 as uuidV4 } from "uuid";

import {ICreateUserDTO} from "../../../users/useCases/createUser/ICreateUserDTO";
import {GetStatementOperationUseCase} from "./GetStatementOperationUseCase";
import {AppError} from "../../../../shared/errors/AppError";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {CreateStatementUseCase} from "../createStatement/CreateStatementUseCase";
import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";


interface IRequest {
  user_id: string;
  statement_id: string;
}

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Create Statements", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get a statement operation", async () => {
    enum OperationType {
      DEPOSIT = "deposit",
      WITHDRAW = "withdraw",
    }
    const userDTO: ICreateUserDTO = {
      name: "user",
      email: "email@test.com",
      password: "12345",
    };

    const user = await createUserUseCase.execute(userDTO);

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: "deposit test",
      amount: 100,
      type: "deposit" as OperationType,
    });

    const iRequestStub = <IRequest>{
      user_id: user.id,
      statement_id: statement.id,
    };

    const result = await getStatementOperationUseCase.execute(iRequestStub);

    expect(result).toEqual(statement);
  });
  it("should not be able to get a statement operation from a non existent user", async () => {
    await expect(async () => {
      enum OperationType {
        DEPOSIT = "deposit",
        WITHDRAW = "withdraw",
      }

      const statement = await createStatementUseCase.execute({
        user_id: uuidV4() as string,
        description: "deposit test",
        amount: 100,
        type: "deposit" as OperationType,
      });

      const iRequestStub = <IRequest>{
        user_id: statement.user_id,
        statement_id: statement.id,
      };

      await getStatementOperationUseCase.execute(iRequestStub);
    }).rejects.toBeInstanceOf(AppError);
  });
  it("should not be able to get a non existing statement operation from a existing user", async () => {
    await expect(async () => {
      enum OperationType {
        DEPOSIT = "deposit",
        WITHDRAW = "withdraw",
      }
      const userDTO: ICreateUserDTO = {
        name: "user",
        email: "email@test.com",
        password: "12345",
      };

      const user = await createUserUseCase.execute(userDTO);

      await createStatementUseCase.execute({
        user_id: user.id as string,
        description: "deposit test",
        amount: 100,
        type: "deposit" as OperationType,
      });

      const iRequestStub = <IRequest>{
        user_id: user.id,
        statement_id: uuidV4(),
      };

      await getStatementOperationUseCase.execute(iRequestStub);
    }).rejects.toBeInstanceOf(AppError);
  });
});
