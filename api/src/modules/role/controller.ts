import { Request, Response } from 'express'

import roleService from './service';

export const listRoles = async (req: Request, res: Response) => {
  const result = await roleService.getRoles();

  res.json(result)
}

export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;

  const result = await roleService.createRole({
    name
  });

  res.json({ id: result });
}

export const removeRole = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  await roleService.removeRole(id);

  res.json({});
}

export const assignRightToRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.id, 10);
  const { rightIds } = req.body;

  await roleService.assignRightToRole(roleId, rightIds);

  res.json({});
}

