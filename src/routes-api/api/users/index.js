import express from "express";
import { addUser, updateUser, getUser } from "../../../queries/users";
import { authenticateUser } from "../../../middleware/auth";

const router = express.Router();

router.get("/me", authenticateUser, async (req, res) => {
  const { user } = req;
  getUser(user).then(({ photo, firstname, lastname, id, role }) => {
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
  });
});

router.get("/refresh", authenticateUser, async (req, res) => {
  const { user } = req;
  getUser(user)
    .then(() => {
      //update user
      updateUser({ user })
        .then(() => res.send({ success: true }))
        .catch(() => {
          res.send({ success: false });
        });
    })
    .catch(() => {
      //create user
      addUser({ user })
        .then(() => res.send({ success: true }))
        .catch(() => res.send({ success: false }));
    });
});

export default router;
