import { demoteUsersWhoAreInactive } from "../../../queries/ladder";
import * as Query from "../../../queries/query";

jest.mock("../../../twilio-api");

/* players
1 = inactive
2 = active
3 = active
4 = inactive (recently demoted)
5 = inactive
6 = active

result should be
2, 3, 1, 4, 6, 5

 */
//
// jest
//     .spyOn(Twilio, "sendMessage")
//     .mockImplementation((body, number, id) => {
//         console.log(body, number, id);
//         return Promise.resolve();
//     });

describe("demoteUsersWhoAreInactive", () => {
  const querySpy = jest
    .spyOn(Query, "query")
    .mockImplementation((query, params) => {
      console.log(query, params);
      return Promise.resolve();
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inactive player gets demoted to below active player", async () => {
    const users = new Set();
    users.add(2);
    const ranks = [
      {
        id: 1,
        firstname: "1",
        rank: 100,
        last_demoted: 0,
      },
      {
        id: 2,
        firstname: "2",
        rank: 80,
        last_demoted: 0,
      },
    ];

    await demoteUsersWhoAreInactive(1, users, ranks);

    expect(querySpy).toHaveBeenCalledTimes(1);
    expect(querySpy).toHaveBeenNthCalledWith(1, expect.any(String), [
      79,
      1,
      1,
      expect.any(Number),
    ]);
  });

  it("inactive player gets demoted to correct rank, half or higher rank", async () => {
    const users = new Set();
    users.add(2);
    const ranks = [
      {
        id: 1,
        firstname: "1",
        rank: 0.5,
        last_demoted: 0,
      },
      {
        id: 2,
        firstname: "2",
        rank: 0.4,
        last_demoted: 0,
      },
    ];

    await demoteUsersWhoAreInactive(1, users, ranks);

    expect(querySpy).toHaveBeenCalledTimes(1);
    expect(querySpy).toHaveBeenNthCalledWith(1, expect.any(String), [
      0.2,
      1,
      1,
      expect.any(Number),
    ]);
  });

  it("user should not be demoted past another inactive player", async () => {
    const users = new Set();
    users.add(2);
    const ranks = [
      {
        id: 1,
        firstname: "1",
        rank: 100,
        last_demoted: 0,
      },
      {
        id: 2,
        firstname: "2",
        rank: 80,
        last_demoted: 0,
      },
      {
        id: 3,
        firstname: "3",
        rank: 70,
        last_demoted: 0,
      },
    ];

    await demoteUsersWhoAreInactive(1, users, ranks);

    expect(querySpy).toHaveBeenCalledTimes(1);
    expect(querySpy).toHaveBeenNthCalledWith(1, expect.any(String), [
      75,
      1,
      1,
      expect.any(Number),
    ]);
  });

  it("should demote multiple users", async () => {
    const users = new Set();
    users.add(2);
    users.add(4);
    users.add(5);
    const ranks = [
      {
        id: 1,
        firstname: "1",
        rank: 100,
        last_demoted: 0,
      },
      {
        id: 2,
        firstname: "2",
        rank: 80,
        last_demoted: 0,
      },
      {
        id: 3,
        firstname: "3",
        rank: 70,
        last_demoted: 0,
      },
      {
        id: 4,
        firstname: "4",
        rank: 60,
        last_demoted: 0,
      },
      {
        id: 5,
        firstname: "5",
        rank: 20,
        last_demoted: 0,
      },
    ];

    await demoteUsersWhoAreInactive(1, users, ranks);
    expect(querySpy).toHaveBeenCalledTimes(2);
    expect(querySpy).toHaveBeenNthCalledWith(1, expect.any(String), [
      75,
      1,
      1,
      expect.any(Number),
    ]);
    expect(querySpy).toHaveBeenNthCalledWith(2, expect.any(String), [
      19,
      1,
      3,
      expect.any(Number),
    ]);
  });

  it("doesnt demote an inactive user who has been recently demoted", async () => {
    const users = new Set();
    users.add(2);
    const ranks = [
      {
        id: 1,
        firstname: "1",
        rank: 100,
        last_demoted: Date.now() - 100,
      },
      {
        id: 2,
        firstname: "2",
        rank: 80,
        last_demoted: 0,
      },
    ];

    await demoteUsersWhoAreInactive(1, users, ranks);

    expect(querySpy).toHaveBeenCalledTimes(0);
  });

  it("should not demote user if two inactive users in a row", async () => {
    const users = new Set();
    const ranks = [
      {
        id: 1,
        firstname: "1",
        rank: 100,
        last_demoted: 0,
      },
      {
        id: 2,
        firstname: "2",
        rank: 80,
        last_demoted: 0,
      },
    ];

    await demoteUsersWhoAreInactive(1, users, ranks);

    expect(querySpy).toHaveBeenCalledTimes(0);
  });

  it("should not demote user if multiple inactive users in a row", async () => {
    const users = new Set();
    const ranks = [
      {
        id: 1,
        firstname: "1",
        rank: 100,
        last_demoted: 0,
      },
      {
        id: 2,
        firstname: "2",
        rank: 80,
        last_demoted: 0,
      },
      {
        id: 3,
        firstname: "3",
        rank: 60,
        last_demoted: 0,
      },
    ];

    await demoteUsersWhoAreInactive(1, users, ranks);

    expect(querySpy).toHaveBeenCalledTimes(0);
  });
});
