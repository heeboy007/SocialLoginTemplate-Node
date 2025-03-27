const errorHandler = (block) => async (req, res) => {
    try {
        await block(req, res);
    } catch(e) {
        console.log("FATAL FAILURE : " + e);
        res.status(500).json({ error: "unknown error had occured." });
    }
}

const wrapWithErrorHandler = (obj) => {
    Object.keys(obj).forEach((key) => {
        obj[key] = errorHandler(obj[key]);
    });
    return obj;
}

export {
    wrapWithErrorHandler 
};