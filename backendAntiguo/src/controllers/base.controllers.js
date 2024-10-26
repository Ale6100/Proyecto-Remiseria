const base = async (_req, res) => {
    res.status(200).json({ message: `Bienvenido` });
}

export default {
    base
}
