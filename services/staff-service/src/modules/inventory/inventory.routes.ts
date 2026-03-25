import { Router } from 'express';
import { InventoryController } from './inventory.controller';

const router = Router();
const controller = new InventoryController();

router.get('/items', controller.getItems.bind(controller));
router.post('/items', controller.createItem.bind(controller));
router.post('/stock', controller.addStock.bind(controller));
router.post('/use', controller.useItem.bind(controller));
router.get('/transactions', controller.getTransactions.bind(controller));

export default router;
