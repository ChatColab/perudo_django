actions = document.getElementById("actions");
dudoButton = document.getElementById("dudoButton");
calzaButton = document.getElementById("calzaButton");
validButton = document.getElementById("validButton");
upn1Button = document.getElementById("upn1");
downn1Button = document.getElementById("downn1");
dicePaco = document.getElementById("dicePaco");
dice2 = document.getElementById("dice2");
dice3 = document.getElementById("dice3");
dice4 = document.getElementById("dice4");
dice5 = document.getElementById("dice5");
dice6 = document.getElementById("dice6");
n1val = document.getElementById("n1value");
var connectionString =
  "ws://" + window.location.host + "/ws/game/" + roomCode + "/";
var gameSocket = new WebSocket(connectionString);

n1 = 1;
n2 = 0;
turn = 0;
turn1 = true;
palifico = false;

class Player {
  constructor(name) {
    this.alreadyPalifico = false;
    this.name = name;
    this.dieList = [];
    this.numberOfDie = 5;
  }
  roll() {
    //clear the dieList
    this.dieList = [];

    let data = {
      'event': 'ROLL',
      'user': this.name,
      'game_data': {
        'nb_dice': this.numberOfDie
      }
    };
    gameSocket.send(JSON.stringify(data));
  }
  loseDie() {
    let data = {
      'event': 'LOSE-DICE',
      'user': this.name,
      'game_data': {
        'nb_dice': this.numberOfDie
      }
    };
    gameSocket.send(JSON.stringify(data));
    this.numberOfDie--;
  }
  addDie() {
    if (this.numberOfDie < 5) {
      this.numberOfDie++;
    }
  }
  getDieList() {
    return this.dieList;
  }
  getName() {
    return this.name;
  }
  palifico() {
    if (this.alreadyPalifico == false){
        this.alreadyPalifico = true;
        return true;
    }
    else{
        return false;
    }
  }
}

eliminate = (p) => {
  //print eliminate player
  console.log(p.getName() + " a été éliminé :)");
  playersList.splice(p, 1);
};

countDice = (n) => {
  let count = 0;
  for (let i = 0; i < playersList.length; i++) {
    for (let k = 0; k < playersList[i].getDieList().length; k++) {
      if (playersList[i].getDieList()[k] == n) {
        count++;
      } else if (!palifico && playersList[i].getDieList()[k] == 1) {
        count++;
      }
    }
  }
  console.log("Dés comptés : " + count);
  return count;
};

rollAll = () => {
  for (let i = 0; i < playersList.length; i++) {
    playersList[i].roll();
  }
  console.log("Dés lancés");
};

resetCall = () => {
  //reset all the values
  n1 = 1;
  n2 = 0;
  turn1 = true;
  rollAll();
};

prev = () => {
  //print previous player
  if (turn == 0) {
    return playersList[playersList.length - 1];
  } else {
    return playersList[turn - 1];
  }
};

newTurn = () => {
  n1tmp = n1;
  n1val.innerHTML = n1tmp;
  n2tmp = n2;
  pacoTurn = false;
  numberTurn = false;
  console.log("Nouveau tour");
  if (turn >= playersList.length) {
    turn = 0;
  }
  if (turn < 0) {
    turn = playersList.length - 1;
  }
  //check if there is a looser
  if (playersList[turn].getDieList().length == 0) {
    eliminate(playersList[turn]);
  }
  //check if there is a winner
  if (playersList.length == 1) {
    console.log(playersList[0].getName() + " ganó... SHEEEEEEEEEEEESH !!!");
  } else {
    console.log(playersList[turn].getName() + ", à votre tour");
    console.log("Call actuel : " + n1 + " " + n2);
    console.log("Vos dés : " + playersList[turn].getDieList());
    //check if the player is a palifico
    if (playersList[turn].getDieList().length == 1 && palifico == false) {
      palifico = playersList[turn].palifico();
      if (palifico) {
        console.log("Vous êtes un palifico !");
      }
    }
  }
};

dudoButton.addEventListener("click", () => {
  if (!turn1) {
    console.log("Dudo");
    res = countDice(n2);
    palifico = false;
    if (res >= n1) {
      console.log(playersList[turn].getName() + " perd un dé! GROS CHEH!");
      playersList[turn].loseDie();
      resetCall();
      newTurn();
    } else {
      console.log(prev().getName() + " perd un dé! GROS CHEH!");
      prev().loseDie();
      turn--;
      resetCall();
      newTurn();
    }
  }
});

calzaButton.addEventListener("click", () => {
  if (!turn1) {
    console.log("Calza");
    res = countDice(n2);
    palifico = false;
    if (res == n1) {
      console.log(playersList[turn].getName() + " gagne un dé quel BG wow !");
      playersList[turn].addDie();
      resetCall();
      newTurn();
    } else {
      console.log(playersList[turn].getName() + " perd un dé! GROS CHEH!");
      playersList[turn].loseDie();
      resetCall();
      newTurn();
    }
  }
});

validButton.addEventListener("click", () => {
  if (
    n1tmp > n1 ||
    n2tmp > n2 ||
    (n2 != 1 && n2tmp == 1 && n1tmp != 0 && n2tmp != 0)
  ) {
    turn1 = false;
    turn++;
    n1 = n1tmp;
    n2 = n2tmp;
    console.log("validé (turn++) : " + turn);
    newTurn();
  }
});

upn1Button.addEventListener("click", () => {
  if (turn1) {
    n1tmp++;
    n1val.innerHTML = n1tmp;
  } else {
    if (palifico) {
      n1tmp++;
      n1val.innerHTML = n1tmp;
      console.log("n1 : " + n1tmp);
    } else {
      if (n2tmp == n2 || n2tmp == 1) {
        // on a le droit de changer qu'un seul chiffre
        n1tmp++;
        n1val.innerHTML = n1tmp;
        console.log("n1 : " + n1tmp);
      }
    }
  }
});

downn1Button.addEventListener("click", () => {
  if (turn1 && n1tmp > 1) {
    n1tmp--;
    n1val.innerHTML = n1tmp;
  } else {
    if (palifico) {
      if (n1tmp > n1) {
        n1tmp--;
        n1val.innerHTML = n1tmp;
        console.log("n1 : " + n1tmp);
      }
    } else {
      if (n2tmp == n2 || n2tmp == 1) {
        // on a le droit de changer qu'un seul chiffre
        if (pacoTurn == false) {
          if (n1tmp > 1 && n1tmp > n1) {
            n1tmp--;
            n1val.innerHTML = n1tmp;
            console.log("n1 : " + n1tmp);
          }
        } else {
          if (n1tmp > 1 && n1tmp > Math.ceil(n1 / 2)) {
            n1tmp--;
            n1val.innerHTML = n1tmp;
            console.log("n1 : " + n1tmp);
          }
        }
      }
    }
  }
});

dicePaco.addEventListener("click", () => {
  if (palifico) {
    if (n2 == 0) {
      n2tmp = 1;
      console.log("n2 : " + n2tmp);
    }
  } else {
    if (n2tmp != 1 && !turn1) {
      n2tmp = 1;
      console.log("n2 : paco");
      //n1tmp takes n1/2 round up
      n1tmp = Math.ceil(n1 / 2);
      n1val.innerHTML = n1tmp;
      console.log("n1 : " + n1tmp);
      pacoTurn = true;
    }
  }
});
dice2.addEventListener("click", () => {
  if (palifico) {
    if (n2 == 0) {
      n2tmp = 2;
      console.log("n2 : " + n2tmp);
    }
  } else {
    if (n2 == 1 && numberTurn == false) {
      n1tmp = n1 * 2 + 1;
      n1val.innerHTML = n1tmp;
      console.log("n1 : " + n1tmp);
      numberTurn = true;
    }
    if (n2 <= 2) {
      n2tmp = 2;
      console.log("n2 : 2");
      pacoTurn = false;
      if (numberTurn == false) {
        n1tmp = n1;
        n1val.innerHTML = n1tmp;
        console.log("n1 : " + n1tmp);
      }
    }
  }
});
dice3.addEventListener("click", () => {
  if (palifico) {
    if (n2 == 0) {
      n2tmp = 3;
      console.log("n2 : " + n2tmp);
    }
  } else {
    if (n2 == 1 && numberTurn == false) {
      n1tmp = n1 * 2 + 1;
      n1val.innerHTML = n1tmp;
      console.log("n1 : " + n1tmp);
      numberTurn = true;
    }
    if (n2 <= 3) {
      n2tmp = 3;
      console.log("n2 : 3");
      pacoTurn = false;
      if (numberTurn == false) {
        n1tmp = n1;
        n1val.innerHTML = n1tmp;
        console.log("n1 : " + n1tmp);
      }
    }
  }
});
dice4.addEventListener("click", () => {
  if (palifico) {
    if (n2 == 0) {
      n2tmp = 4;
      console.log("n2 : " + n2tmp);
    }
  } else {
    if (n2 == 1 && numberTurn == false) {
      n1tmp = n1 * 2 + 1;
      n1val.innerHTML = n1tmp;
      console.log("n1 : " + n1tmp);
      numberTurn = true;
    }
    if (n2 <= 4) {
      n2tmp = 4;
      console.log("n2 : 4");
      pacoTurn = false;
      if (numberTurn == false) {
        n1tmp = n1;
        n1val.innerHTML = n1tmp;
        console.log("n1 : " + n1tmp);
      }
    }
  }
});
dice5.addEventListener("click", () => {
  if (palifico) {
    if (n2 == 0) {
      n2tmp = 5;
      console.log("n2 : " + n2tmp);
    }
  } else {
    if (n2 == 1 && numberTurn == false) {
      n1tmp = n1 * 2 + 1;
      n1val.innerHTML = n1tmp;
      console.log("n1 : " + n1tmp);
      numberTurn = true;
    }
    if (n2 <= 5) {
      n2tmp = 5;
      console.log("n2 : 5");
      pacoTurn = false;
      if (numberTurn == false) {
        n1tmp = n1;
        n1val.innerHTML = n1tmp;
        console.log("n1 : " + n1tmp);
      }
    }
  }
});
dice6.addEventListener("click", () => {
  if (palifico) {
    if (n2 == 0) {
      n2tmp = 6;
      console.log("n2 : " + n2tmp);
    }
  } else {
    if (n2 == 1 && numberTurn == false) {
      n1tmp = n1 * 2 + 1;
      n1val.innerHTML = n1tmp;
      console.log("n1 : " + n1tmp);
      numberTurn = true;
    }
    if (n2 <= 6) {
      n2tmp = 6;
      console.log("n2 : 6");
      pacoTurn = false;
      if (numberTurn == false) {
        n1tmp = n1;
        n1val.innerHTML = n1tmp;
        console.log("n1 : " + n1tmp);
      }
    }
  }
});



gameSocket.onmessage = function (e) {
  let data = JSON.parse(e.data);
  data = data["payload"];
  let message = data["message"];
  let event = data["event"];
  switch (event) {
    case "START":
      let nbplayer = message["nb_players"];

      let playersList = message["players"];

      for (let i = 0; i < nbplayer; i++) {
        let name = playersList[i];
        playersList.push(new Player(name));
      }
        rollAll();
        newTurn();
        break;
    
    case "NEWTURN":
      player.numberOfDie = data["numberOfDie"];
      player.dieList = data["dieList"];
      player.palifico = data["palifico"];
    case "END":
      alert(message);
      reset();
      break;
    case "MOVE":
      if (message["player"] != char_choice) {
        make_move(message["index"], message["player"]);
        myturn = true;
        document.getElementById("alert_move").style.display = "inline";
      }
      break;
    default:
      console.log("No event");
  }
};