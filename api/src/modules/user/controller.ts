import { Request, Response } from 'express'

import userService from './service';


export const getUser = async (req: Request, res: Response) => {
  const result = await userService.getUsers();

  res.json(result)
}

export const createUser = async (req: Request, res: Response) => {
  const {
    firstName, lastName, email, phone
  } = req.body;

  const result = await userService.createUser({
    firstName, lastName, email, phone
  });

  res.json({ id: result });
}

export const removeUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  await userService.removeUser(parseInt(userId, 10));

  res.json({});
}

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const {
    firstName, lastName, email, phone
  } = req.body;

  const result = await userService.updateUser(parseInt(userId, 10), {
    firstName, lastName, email, phone
  });

  res.json({ id: result });
}

export const assignUserRole = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { roleIds } = req.body;

  await userService.assignUserRole(parseInt(userId, 10), roleIds);

  res.json({});
}
