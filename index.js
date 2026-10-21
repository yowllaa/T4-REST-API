import express from "express";
import { apps } from "./src/data/apps.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route utama: memastikan server aktif.
app.get("/", (req, res) => {
  res
    .status(200)
    .type("text")
    .send("Selamat datang di REST API Aplikasi Favorit.");
});

// GET semua aplikasi.
app.get("/apps", (req, res) => {
  return res.status(200).json({
    data: apps
  });
});

// GET satu aplikasi berdasarkan ID.
app.get("/apps/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({
      error: {
        pesan: "Aplikasi tidak ditemukan.",
        kode: 404
      }
    });
  }

  const appDitemukan = apps.find((item) => item.id === id);

  if (!appDitemukan) {
    return res.status(404).json({
      error: {
        pesan: `Aplikasi dengan id ${id} tidak ditemukan.`,
        kode: 404
      }
    });
  }

  return res.status(200).json({
    data: appDitemukan
  });
});

// BONUS: DELETE aplikasi berdasarkan ID.
// Data disimpan di memori, sehingga kembali ke kondisi awal setelah server restart.
app.delete("/apps/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({
      error: {
        pesan: "Aplikasi tidak ditemukan.",
        kode: 404
      }
    });
  }

  const index = apps.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: {
        pesan: `Aplikasi dengan id ${id} tidak ditemukan.`,
        kode: 404
      }
    });
  }

  apps.splice(index, 1);
  return res.status(204).end();
});

// Penanganan route yang tidak tersedia.
app.use((req, res) => {
  return res.status(404).json({
    error: {
      pesan: "Endpoint tidak ditemukan.",
      kode: 404
    }
  });
});

app.listen(PORT, () => {
  console.log(`REST API Aplikasi Favorit berjalan di http://localhost:${PORT}`);
});
