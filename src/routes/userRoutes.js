import express from 'express';
import Host from '../models/Host';

// This will handle all the routes related to users
const userRouter = express.Router();

userRouter.get('/user/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await Host.findOne({ email });

        // User found with the email
        if(email) {
            res.status(200).json(user);
        }
        
        // User is not found
        res.status(404).json(user);
    } catch(e) {
        res.status(500).json(e);
    }
});

export default userRouter;