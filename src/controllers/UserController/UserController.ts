import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../models/User/User";

import { IUser } from "../../models/User/types";

import {
  TSigninInput,
  TSignupInput,
  TSignResponse,
  TGetUsersResponse,
  TUserDataResponse,
  TGetUserByTokenInput,
  TGetUserByIdInput,
  TUpdateUserInput,
} from "./types";

class UserController {
  public async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body as TSignupInput;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: "E-mail already registered" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user: IUser = new User({
          name,
          email,
          password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ name, email }, process.env.JWT_SECRET || "", {
          expiresIn: "1d",
        });

        return res.status(201).json({ user: { name, email, id: user._id }, token }) as Response<TUserDataResponse>;
      }
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async signin(req: Request, res: Response) {
    try {
      const { email: bodyEmail, password } = req.body as TSigninInput;

      if (!bodyEmail || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await User.findOne({ email: bodyEmail }).select("+password");

      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const { name, email, _id: id } = user;

      const token = jwt.sign({ id, name, email }, process.env.JWT_SECRET || "", {
        expiresIn: "30d",
      });

      return res.json({
        user: {
          name,
          email,
          id,
        },
        token,
      }) as Response<TSignResponse>;
    } catch (err) {
      console.error("Error logging in:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find({});

      return res.json({ users: users.map(({ _id, name, email }) => ({ id: _id, name, email })) }) as Response<
        TGetUsersResponse[]
      >;
    } catch (err) {
      console.error("Error getting all users:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getUserByToken(req: Request, res: Response) {
    try {
      const { token } = req.params as TGetUserByTokenInput;

      if (!token) {
        return res.status(400).json({ message: "Token not provided" });
      }

      const { email: tokenMail } = jwt.verify(token as string, process.env.JWT_SECRET || "") as IUser;

      const user = await User.findOne({ email: tokenMail }, { password: 0 });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { name, id, email } = user;

      res.json({ user: { name, id, email } }) as Response<TUserDataResponse>;
    } catch (err) {
      console.error("Error getting user by ID:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params as TGetUserByIdInput;

      const user = await User.findById(id, { password: 0 });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { name, email } = user;

      return res.json({ user: { name, id, email } }) as Response<TUserDataResponse>;
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const { name, email, id } = req.body as TUpdateUserInput;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();

      res.json({ user: name, email, id }) as Response<TUserDataResponse>;
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default UserController;
