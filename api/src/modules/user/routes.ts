import { Router } from 'express';
import { assignUserRole, createUser, getUser, removeUser, updateUser } from './controller';


const router = Router();

router.get('/', getUser);
router.post('/', createUser);
router.delete('/:id', removeUser);
router.put('/:id', updateUser);
router.put('/:id/role', assignUserRole);


export default router;
