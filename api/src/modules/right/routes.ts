import { Router } from 'express';
import { createRight, getRight, removeRight, listRights, updateRight } from './controller';


const router = Router();

router.get('/', listRights);
router.post('/', createRight);
router.get('/:id', getRight);
router.put('/:id', updateRight);
router.delete('/:id', removeRight);


export default router;
