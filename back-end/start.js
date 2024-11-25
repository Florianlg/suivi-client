const app = require("./server");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
