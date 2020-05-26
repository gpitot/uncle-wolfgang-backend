import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import config from 'config';
import cors from 'cors';
import http from 'http';
import SocketIO from 'socket.io';

import deal from './sockets/deal-player';
import generateCards from './dealer';
import { getOddsPostFlop } from './dealer/odds';

const app = express();

const server = http.createServer(app);
const io = SocketIO(server);

//use config module to get the privatekey, if no private key set, end the application
if (!config.get('myprivatekey')) {
  console.error('FATAL ERROR: myprivatekey is not defined.');
  process.exit(1);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
  res.send('hello world');
});

const players = [];
const state = {
  inGame: false,
};
const gameConfig = {
  cardsPerPlayer: 2,
  deck: 'common',
  numDeck: 1,
  rules: [3, 1, 1, 'r'],
};

io.on('connection', (socket) => {
  const playerId = socket.id;

  let cards;
  let cardIndex = 0;
  let board = [];

  players.push({
    id: playerId,
    cards: [],
  });

  socket.on('disconnect', () => {
    for (let i = players.length - 1; i >= 0; i -= 1) {
      if (players[i].id === playerId) {
        players.splice(i, 1);
        if (players.length > 0) {
          socket.broadcast.emit('playerLeft', {
            numPlayers: players.length,
          });
        }

        if (i === 0 && players.length > 0) {
          //create a new host
          console.log('create new host');
          io.to(players[0].id).emit('joined', {
            host: playerId === players[0].id,
            numPlayers: players.length,
          });
        }

        break;
      }
    }
  });

  socket.emit('joined', {
    host: playerId === players[0].id,
    numPlayers: players.length,
  });
  socket.broadcast.emit('playerJoined', {
    numPlayers: players.length,
  });

  socket.on('deal', () => {
    if (playerId === players[0].id) {
      cards = generateCards(gameConfig.deck, gameConfig.numDeck);
      deal({ io, players, state, gameConfig, cards });
    }
  });

  socket.on('cardsWanted', () => {
    if (playerId === players[0].id) {
      if (gameConfig.rules[cardIndex] === 'r') {
        io.emit('clearTable');
        board = [];
        cardIndex = 0;
        return;
      }

      board.push(...cards.slice(0, gameConfig.rules[cardIndex]));
      console.log(board);
      const odds = getOddsPostFlop(players, board);

      players.forEach((player, i) => {
        io.to(player.id).emit('odds', {
          odds: odds[i],
        });
      });

      io.emit('center-pile', {
        centerCards: cards.slice(0, gameConfig.rules[cardIndex]),
      });

      cards.splice(0, gameConfig.rules[cardIndex]);
      cardIndex += 1;
    }
  });
});

export { server };
export default app;
