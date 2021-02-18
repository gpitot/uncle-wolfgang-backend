import express from "express";
import { getUser } from "../../../queries/users";

const router = express.Router();

router.get("/me", async (req, res) => {
  const { user } = req;
  if (user === undefined) return res.send({ success: false });
  getUser(user)
    .then(({ photo, firstname, lastname, id, role }) => {
      res.send({
        success: true,
        user: {
          photo,
          firstname,
          lastname,
          id,
          role,
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
