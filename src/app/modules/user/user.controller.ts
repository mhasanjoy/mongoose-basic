import { NextFunction, Request, Response } from "express";
import { createUserToDB, getAdminUsersFromDB, getUserByIdFromDB, getUsersFromDB } from "./user.service";

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const users = await getUsersFromDB();

  res.status(200).json({
    status: "success",
    data: users,
  });
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const user = await getUserByIdFromDB(id);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const getAdminUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const admins = await getAdminUsersFromDB();

  res.status(200).json({
    status: "success",
    data: admins,
  });
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const data = req.body;
  const user = await createUserToDB(data);

  res.status(200).json({
    status: "success",
    data: user,
  });
};
