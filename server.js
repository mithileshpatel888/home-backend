import express from 'express';
import cors from 'cors';
import "dotenv/config";

const app = express();
const PORT = process.env.port || 5001;

// midlleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  return res.json('Server is running');
});

// routes
import Routes from './routes/index.js';
app.use(Routes);

app.listen(PORT, () => console.log(`server is ruuning on port ${PORT}`));
