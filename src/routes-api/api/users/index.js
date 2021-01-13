import express from "express";
import { addUser, updateUser, getUser } from "../../../queries/users";
import { authenticateUser } from "../../../middleware/auth";

const router = express.Router();

router.get("/me", authenticateUser, async (req, res) => {
  const { user } = req;
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

router.get("/refresh", async (req, res) => {
  const { user } = req;
  if (!user) return res.send({ success: false });
  getUser(user)
    .then(() => {
      //update user
      console.log("updating a user");
      updateUser({ user })
        .then(() => res.send({ success: true }))
        .catch(() => {
          res.send({ success: false });
        });
    })
    .catch(() => {
      //create user
      console.log("adding a user");
      addUser({ user })
        .then(() => res.send({ success: true }))
        .catch(() => res.send({ success: false }));
    });
});

export default router;
