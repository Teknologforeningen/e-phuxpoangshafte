import {
  Arg,
  Resolver,
  Query,
  Authorized,
  Mutation,
  Ctx,
  ID,
  InputType,
  Field
} from "type-graphql";
import { Context } from "../common/context";
import { UserService } from "./UserService";
import { User } from "./UserEntity";
import "./enums";
import { accountsPassword } from "./accounts";
import { Role } from "./consts";

@InputType()
class CreateUserInput {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;
}

@InputType()
export class PropertyInput {
  @Field(type => String)
  address: string;

  @Field(type => String)
  placeId: string;

  @Field(type => Number)
  rentAmount: number;
}

@Resolver(User)
export default class UserResolver {
  private readonly service: UserService;

  constructor() {
    this.service = new UserService();
  }

  @Query(returns => User)
  @Authorized()
  async me(@Ctx() ctx: Context) {
    if (ctx.userId) {
      return await this.service.findOneById(ctx.userId);
    }
  }

  // this overrides accounts js `createUser` function
  @Mutation(returns => ID)
  async createUser(
    @Arg("user", returns => CreateUserInput) user: CreateUserInput
  ) {
    const createdUserId = await accountsPassword.createUser({
      ...user,
      roles: [Role.User]
    });

    return createdUserId;
  }
}
