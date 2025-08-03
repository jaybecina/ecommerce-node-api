import express, { json, urlencoded, Request } from "express";
import routes from "./routes";

import serverless from "serverless-http";

const port = 3001;
const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(
  json({
    verify: (req: Request, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/api", routes);

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export const handler = serverless(app);
