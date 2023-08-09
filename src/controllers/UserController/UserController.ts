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
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(400).json({ error: "E-mail already registered" });
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

        res.status(201).json({ user: { name, email, id: user._id }, token }) as Response<TUserDataResponse>;
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
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const user = await User.findOne({ email: bodyEmail }).select("+password");

      if (!user) {
        res.status(401).json({ message: "Authentication failed" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Authentication failed" });
        return;
      }

      const { name, email, _id: id } = user;

      const token = jwt.sign({ id, name, email }, process.env.JWT_SECRET || "", {
        expiresIn: "30d",
      });

      res.json({
        user: {
          name,
          email,
          id,
        },
        token,
      }) as Response<TSignResponse>;
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find({});

      res.json({ users: users.map(({ name, id }) => ({ name, id })) }) as Response<TGetUsersResponse[]>;
    } catch (err) {
      console.error("Error getting all users:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async getUserByToken(req: Request, res: Response) {
    try {
      const { token } = req.params as TGetUserByTokenInput;

      if (!token) {
        res.status(400).json({ message: "Token not provided" });
        return;
      }

      const { email: tokenMail } = jwt.verify(token as string, process.env.JWT_SECRET || "") as IUser;

      const user = await User.findOne({ email: tokenMail }, { password: 0 });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
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
        res.status(404).json({ message: "User not found" });
        return;
      }

      const { name, email } = user;

      return res.json({ user: { name, id, email } }) as Response<TUserDataResponse>;
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const { name, email, id } = req.body as TUpdateUserInput;

      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
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
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default UserController;
