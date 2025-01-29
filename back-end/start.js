const app = require("./server");
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});

// 🔍 Vérifier quelles routes sont bien enregistrées
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ Route enregistrée : ${r.route.path}`);
  }
});
