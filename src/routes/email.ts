import { Router, Request, Response } from 'express';
import sendEmail from '../services/email';

const router = Router();

router.post('/send-email', (req: Request, res: Response) => {
    sendEmail();
    
    res.send({  });
});

export default router;