import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const requireAuth = async (req, res, next) => {
    // verify authentication
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token missing.' });
    }

    const parts = authorization.split(' ');
    const [scheme, token] = parts;
    if (scheme !== 'Bearer' || !token || parts.length !== 2) {
        return res.status(401).json({ error: 'Request not authorized.' });
    }

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id }).select('_id');
        if (!user) {
            return res.status(401).json({ error: 'Request not authorized.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Request not authorized.' });
    }
};

export { requireAuth };
