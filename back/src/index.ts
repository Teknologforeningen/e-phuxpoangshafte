import express from 'express';
// rest of the code remains same
import cors from 'cors';
const app: express.Application = express();
const port = 8000;

app.use(cors());

app.get('/', async(req, res)=> {
    res.send({
        status: true,
        message: 'Stuff happened',
      });
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});