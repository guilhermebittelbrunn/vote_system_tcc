import app from './app';

app.listen(process.env.PORT, () => {
    console.info(`HTTP server listening on port ${process.env.PORT}`);
});
