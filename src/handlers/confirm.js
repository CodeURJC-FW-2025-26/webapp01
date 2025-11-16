export const getConfirmation = async (req, res) => {
  const isGame = req.type && req.type === "game";
  const formData = req.data;

  const keyValues = Object.keys(formData).map(key => ({
    key,
    value: formData[key]
  }));

  res.render("confirm", { isGame, keyValues });
};