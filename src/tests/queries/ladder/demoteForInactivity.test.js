import { iterateRanksAndUsersAndDemote } from "../../../queries/ladder";
import * as Query from "../../../queries/query";

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

describe("iterateRanksAndUsersAndDemote", () => {
  const querySpy = jest
    .spyOn(Query, "query")
    .mockImplementation((query, params) => {
      console.log(query, params);
      return Promise.resolve();
    });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("player who has been inactive gets demoted to above next inactive player ", async () => {
    const users = new Set();
    users.add(2);
    users.add(3);
    users.add(6);
    const ranks = [
      {
        id: 1,
        rank: 100,
        last_demoted: 0,
      },
      {
        id: 2,
        rank: 80,
        last_demoted: 0,
      },
      {
        id: 3,
        rank: 60,
        last_demoted: 0,
      },
      {
        id: 4,
        rank: 50,
        last_demoted: Date.now() - 5000, //recently demoted
      },
      {
        id: 5,
        rank: 40,
        last_demoted: 0,
      },
      {
        id: 6,
        rank: 30,
        last_demoted: 0,
      },
    ];
    await iterateRanksAndUsersAndDemote(1, users, ranks);
    expect(querySpy).toHaveBeenCalledTimes(6);
    expect(querySpy).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      [100, 1, 2]
    );
    expect(querySpy).toHaveBeenNthCalledWith(2, expect.any(String), [
      80,
      1,
      1,
      expect.any(Number),
    ]);

    expect(querySpy).toHaveBeenNthCalledWith(3, expect.any(String), [80, 1, 3]);
    expect(querySpy).toHaveBeenNthCalledWith(4, expect.any(String), [
      60,
      1,
      1,
      expect.any(Number),
    ]);

    expect(querySpy).toHaveBeenNthCalledWith(5, expect.any(String), [40, 1, 6]);
    expect(querySpy).toHaveBeenNthCalledWith(6, expect.any(String), [
      30,
      1,
      5,
      expect.any(Number),
    ]);
  });

  it.only("inactive player does not get demoted beneath another inactive player", async () => {
    //1 4 2 3
    const users = new Set();
    users.add(1);
    users.add(4);

    const ranks = [
      {
        id: 1,
        rank: 100,
        last_demoted: 0,
      },
      {
        id: 2,
        rank: 80,
        last_demoted: 0,
      },
      {
        id: 3,
        rank: 60,
        last_demoted: Date.now() - 5000,
      },
      {
        id: 4,
        rank: 50,
        last_demoted: 0, //recently demoted
      },
    ];
    await iterateRanksAndUsersAndDemote(1, users, ranks);
  });

  it("player who has been active does not get demoted", () => {});

  it("player who has been inactive but demoted recently is not changed", () => {});

  it("player who is promoted has rank of previous player above, not demoted original player", () => {});
});
