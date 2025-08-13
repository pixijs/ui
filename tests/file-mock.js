// Jest transformer for static assets (images, assets, etc.)
module.exports = {
    process()
    {
        return { code: 'module.exports = "test-file-stub";' };
    },
};
