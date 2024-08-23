import { Router } from 'express';
import { assignRightToRole, createRole, removeRole, listRoles } from './controller';


const router = Router();

router.get('/', listRoles);
router.post('/', createRole);
router.delete('/:id', removeRole);
router.put('/:id/right', assignRightToRole);


export default router;
