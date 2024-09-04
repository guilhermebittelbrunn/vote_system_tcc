const tokenConfig = {
    secret: process.env.JWT_SECRET || '',
    expiresIn: 15780000, // 6 meses
};

export default tokenConfig;
