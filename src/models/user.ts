import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import client from "../db.ts";
import {
  create,
  getNumericDate,
  verify,
} from "https://deno.land/x/djwt@v2.7/mod.ts";
import { secret } from "../settings.ts";

interface IUser {
  id: number;
  nickname: string;
  email: string;
  password?: string;
}

class User implements IUser {
  id: number;
  nickname: string;
  email: string;
  password?: string;

  constructor(user: IUser) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.email = user.email;
    this.password = user.password;
  }

  output() {
    const user = new User({
      id: this.id,
      nickname: this.nickname,
      email: this.email,
    });
    return user;
  }

  async generateJWT(): Promise<string> {
    const payload = {
      id: this.id,
      nickname: this.nickname,
      email: this.email,
      exp: getNumericDate(60 * 60),
    };

    const token = await create(
      { alg: "HS256", typ: "JWT" },
      payload,
      secret,
    );

    return token;
  }

  static async validateJWT(
    token: string,
  ): Promise<[User | null, Error | null]> {
    try {
      const payload = await verify(token, secret);
      const id = payload.id;
      if (typeof id != "number") {
        return [null, new Error("jwt payload is invalid")];
      }

      const user = await this.getUserById(id);
      return user;
    } catch (error) {
      return [null, error];
    }
  }

  static async createUser(
    nickname: string,
    email: string,
    password: string,
  ): Promise<Error | null> {
    const salt = await bcrypt.genSalt(8);
    const hashed_password = await bcrypt.hash(password, salt);

    try {
      await client.queryArray(
        "INSERT INTO users (nickname, email, password) VALUES ($NICKNAME, $EMAIL, $HASHED_PASSWORD)",
        { nickname, email, hashed_password },
      );

      return null;
    } catch (error) {
      return error;
    }
  }

  static async getUserById(
    id: number,
  ): Promise<[User | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IUser>(
        "SELECT id, nickname, email, password FROM users WHERE id = $ID",
        { id },
      );

      if (rows.length == 0) {
        return [null, new Error("User not found")];
      }

      const user = new User(rows[0]);

      return [user, null];
    } catch (error) {
      return [null, error];
    }
  }

  static async getUserByEmail(
    email: string,
  ): Promise<[User | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IUser>(
        "SELECT id, nickname, email, password FROM users WHERE email = $EMAIL",
        { email },
      );

      if (rows.length == 0) {
        return [null, new Error("User not found")];
      }

      const user = new User(rows[0]);

      return [user, null];
    } catch (error) {
      return [null, error];
    }
  }

  static async checkPassword(password: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);
    return match;
  }
}

export default User;
