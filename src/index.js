import app from "./app.js";
import { dbConnect } from "./config/db-connect.js";

const main = async () => {
  const port = process.env.PORT || 8080;

  try {
    await dbConnect();

    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  } catch (err) {
    throw err;
  }
};

main().catch((err) => {
  console.log(err.message);
  process.exit(1); // to kill the node.js process
});
