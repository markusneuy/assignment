import { Request, Response } from 'express'

import rightService from './service';

export const listRights = async (req: Request, res: Response) => {
  const result = await rightService.getRights();

  res.json(result)
}

export const getRight = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  const result = await rightService.getRight(id);

  res.json(result)
}

export const createRight = async (req: Request, res: Response) => {
  const { name } = req.body;

  const result = await rightService.createRight({
    name
  });

  res.json({ id: result });
}

export const removeRight = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  await rightService.removeRight(id);

  res.json({});
}

export const updateRight = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;

  const result = await rightService.updateRight(id, { name });

  res.json({ id: result });
}

