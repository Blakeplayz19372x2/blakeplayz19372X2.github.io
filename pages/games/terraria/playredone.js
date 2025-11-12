var termy, terms, num = -1, c, ctx, img, i, I, mouseX, mouseY, rightClck, leftClck, arrowUp, arrowDown, arrowLeft, arrowRight, keyNum = "1", viewX = 0, viewY = 0, velocityY = 0, velocityX = 0, canvasX = 0, canvasY = 0;

var placementX, placementY, newSrcX, newSrcY;
var up, dwn, left, right;
var upLeft, upRight, dwnRight, dwnLeft;
var dirtUp, dirtDwn, dirtLeft, dirtRight;
var overUp, overDwn, overLeft, overRight;

var map = [], loaded = [], override = [], blockData = [];
var rows = 2400, clms = 8400, ammount = rows*clms, camSpeed = 256, accel = 16;
//var rows = 100, clms = 100, ammount = rows*clms, camSpeed = 16, accel = 2;

function startGame() {
  blockData[blockData.length] = null;
  imgLoad("./images/TitleBackground.png", "background");
  imgLoad("./images/Cursor_0.png", "cursor");
  imgLoad("./images/0.png", "1");
  blockData[blockData.length] = [false, "1", "2", "3"];
  imgLoad("./images/3.png", "2");
  blockData[blockData.length] = [true, "1", "2"];
  imgLoad("./images/4.png", "3");
  blockData[blockData.length] = [true, "1", "3"];
  var interval = setInterval (checkImg, 20);
  function checkImg () {
    if (terms[terms.length-1].complete) {
      clearInterval(interval);
      setTimeout(start, 100);
    }
  }
}
function imgLoad (src, id) {
  termy = new Image();
  termy.src = src;
  termy.hidden = true;
  termy.id = id;
  document.body.appendChild(termy);
  terms = document.getElementsByTagName("img");
}
function overrideMatrix (frst, scnd, value) {
  if (override[frst] === undefined) {
    override[frst] = [];
  }
  if (value === "delete") {
    delete override[frst][scnd];
  } else {
    override[frst][scnd] = value;
  }
  if (override[frst].length === 0) {
    delete override[frst];
  }
}
function start () {
  for (i = 0; i < ammount; i++) {
    map[i] = Math.round(Math.round(Math.random()*6)/4+1).toString();
    //map[i] = "1";
  }
  for (i = -2; i < 49; i++) {
    for (I = -2; I < 87; I++) {
      blockRedraw (I + Math.round(viewX/16) + i*clms + Math.round(viewY/16)*clms);
    }
  }
  render.simple("background", "canvasBack", 0, 0);
  setInterval (thingy, 20);
  setInterval (update.general, 20);
}
function blockRedraw (redrawn) {
  if (redrawn < 0 || redrawn > ammount-1) {
    return;
  }
  placementX = (redrawn - Math.floor(redrawn/clms)*clms)*16;
  placementY = Math.floor(redrawn/clms)*16;
  if (placementX < viewX-48 || placementX > viewX+1349+32 || placementY < viewY-48 || placementY > viewY+745+32) {
    return;
  }
  if (map[redrawn] === "0") {
    clear.block (placementX, placementY);
    return;
  }
  newSrcX = 0; newSrcY = 0;
  up = map[redrawn-clms] !== "0"; dwn = map[redrawn+clms] !== "0"; left = map[redrawn-1] !== "0"; right = map[redrawn+1] !== "0";
  upLeft = map[redrawn-clms-1] !== "0"; upRight = map[redrawn-clms+1] !== "0"; dwnRight = map[redrawn+clms+1] !== "0"; dwnLeft = map[redrawn+clms-1] !== "0";
  overUp = false; overDwn = false; overLeft = false; overRight = false;
  
  if (override[redrawn] !== undefined) {
    if (override[redrawn][0] !== undefined) {
      up = override[redrawn][0];
    }
    if (override[redrawn][1] !== undefined) {
      dwn = override[redrawn][1];
    }
    if (override[redrawn][2] !== undefined) {
      left = override[redrawn][2];
    }
    if (override[redrawn][3] !== undefined) {
      right = override[redrawn][3];
    }
  }
  
  data = blockData[map[redrawn]];
  
  if (data[0]) {
    dirtUp = map[redrawn-clms] === "1"; dirtDwn = map[redrawn+clms] === "1"; dirtLeft = map[redrawn-1] === "1"; dirtRight = map[redrawn+1] === "1";
  } else {
    dirtUp = false; dirtDwn = false; dirtLeft = false; dirtRight = false;
  }
  
  if (redrawn-clms >= 0 && up && data.includes(map[redrawn-clms])) {
    newSrcX = newSrcX + 1;
  }
  if (redrawn+clms < ammount && dwn && data.includes(map[redrawn+clms])) {
    newSrcX = newSrcX + 2;
  }
  if (redrawn/clms != Math.floor(redrawn/clms) && left && data.includes(map[redrawn-1])) {
    newSrcY = newSrcY + 1;
  }
  if ((redrawn+1)/clms != Math.floor((redrawn+1)/clms) && right && data.includes(map[redrawn+1])) {
    newSrcY = newSrcY + 2;
  }
  if (newSrcX === 1 && newSrcY === 0 && dirtUp) {
    newSrcX = 0;
    newSrcY = 5;
  } else if (newSrcX === 0 && newSrcY === 2 && dirtRight) {
    newSrcX = 1;
    newSrcY = 5;
  } else if (newSrcX === 2 && newSrcY === 0 && dirtDwn) {
    newSrcX = 2;
    newSrcY = 5;
  } else if (newSrcX === 0 && newSrcY === 1 && dirtLeft) {
    newSrcX = 3;
    newSrcY = 5;
  }
  if (newSrcX === 3 && newSrcY === 0) {
    if (dirtUp || dirtDwn) {
      newSrcX = 0;
      newSrcY = 6;
    }
    if (dirtUp) {
      newSrcX = newSrcX + 1;
    }
    if (dirtDwn) {
      newSrcX = newSrcX + 2;
    }
  }
  if (newSrcX === 0 && newSrcY === 3) {
    if (dirtLeft || dirtRight) {
      newSrcX = 0;
      newSrcY = 7;
    }
    if (dirtRight) {
      newSrcX = newSrcX + 1;
    }
    if (dirtLeft) {
      newSrcX = newSrcX + 2;
    }
  }
  if (newSrcX === 2 && newSrcY === 3) {
    if (dirtRight && dirtDwn || dirtDwn && dirtLeft || dirtLeft && dirtRight || dirtRight && dirtDwn && dirtLeft) {
      if (dirtRight) {
        newSrcY = newSrcY - 2;
        overRight = true;
      }
      if (dirtDwn) {
        newSrcX = newSrcX - 2;
        overDwn = true;
      }
      if (dirtLeft) {
        newSrcY = newSrcY - 1;
        overLeft = true;
      }
    } else {
      if (dirtRight) {
        newSrcX = 1;
        newSrcY = 8;
      }
      if (dirtDwn) {
        newSrcX = 2;
        newSrcY = 8;
      }
      if (dirtLeft) {
        newSrcX = 3;
        newSrcY = 8;
      }
    }
  }
  if (newSrcX === 3 && newSrcY === 1) {
    if (dirtDwn && dirtLeft || dirtLeft && dirtUp || dirtUp && dirtDwn || dirtDwn && dirtLeft && dirtUp) {
      if (dirtDwn) {
        newSrcX = newSrcX - 2;
        overDwn = true;
      }
      if (dirtLeft) {
        newSrcY = newSrcY - 1;
        overLeft = true;
      }
      if (dirtUp) {
        newSrcX = newSrcX - 1;
        overUp = true;
      }
    } else {
      if (dirtDwn) {
        newSrcX = 1;
        newSrcY = 9;
      }
      if (dirtLeft) {
        newSrcX = 2;
        newSrcY = 9;
      }
      if (dirtUp) {
        newSrcX = 3;
        newSrcY = 9;
      }
    }
  }
  if (newSrcX === 1 && newSrcY === 3) {
    if (dirtLeft && dirtUp || dirtUp && dirtRight || dirtRight && dirtLeft || dirtLeft && dirtUp && dirtRight) {
      if (dirtLeft) {
        newSrcY = newSrcY - 1;
        overLeft = true;
      }
      if (dirtUp) {
        newSrcX = newSrcX - 1;
        overUp = true;
      }
      if (dirtRight) {
        newSrcY = newSrcY - 2;
        overRight = true;
      }
    } else {
      if (dirtLeft) {
        newSrcX = 1;
        newSrcY = 10;
      }
      if (dirtUp) {
        newSrcX = 2;
        newSrcY = 10;
      }
      if (dirtRight) {
        newSrcX = 3;
        newSrcY = 10;
      }
    }
  }
  if (newSrcX === 3 && newSrcY === 2) {
    if (dirtUp && dirtRight || dirtRight && dirtDwn || dirtDwn && dirtUp || dirtUp && dirtRight && dirtDwn) {
      if (dirtUp) {
        newSrcX = newSrcX - 1;
        overUp = true;
      }
      if (dirtRight) {
        newSrcY = newSrcY - 2;
        overRight = true;
      }
      if (dirtDwn) {
        newSrcX = newSrcX - 2;
        overDwn = true;
      }
    } else {
      if (dirtUp) {
        newSrcX = 1;
        newSrcY = 11;
      }
      if (dirtRight) {
        newSrcX = 2;
        newSrcY = 11;
      }
      if (dirtDwn) {
        newSrcX = 3;
        newSrcY = 11;
      }
    }
  }
  if (newSrcX === 2 && newSrcY === 1) {
    if (dirtDwn) {
      newSrcX = newSrcX - 2;
      overDwn = true;
    }
    if (dirtLeft) {
      newSrcY = newSrcY - 1;
      overLeft = true;
    }
  }
  if (newSrcX === 1 && newSrcY === 1) {
    if (dirtLeft) {
      newSrcY = newSrcY - 1;
      overLeft = true;
    }
    if (dirtUp) {
      newSrcX = newSrcX - 1;
      overUp = true;
    }
  }
  if (newSrcX === 1 && newSrcY === 2) {
    if (dirtUp) {
      newSrcX = newSrcX - 1;
      overUp = true;
    }
    if (dirtRight) {
      newSrcY = newSrcY - 2;
      overRight = true;
    }
  }
  if (newSrcX === 2 && newSrcY === 2) {
    if (dirtRight) {
      newSrcY = newSrcY - 2;
      overRight = true;
    }
    if (dirtDwn) {
      newSrcX = newSrcX - 2;
      overDwn = true;
    }
  }
  if (newSrcX === 3 && newSrcY === 3) {
    if (dirtUp || dirtDwn || dirtLeft || dirtRight) {
      newSrcX = 0;
      newSrcY = 5;
      if (dirtUp) {
        newSrcY = newSrcY + 1;
      }
      if (dirtRight) {
        newSrcY = newSrcY + 2;
      }
      if (dirtDwn) {
        newSrcY = newSrcY + 4;
      }
      if (dirtLeft) {
        newSrcY = newSrcY + 8;
      }
    } else if (map[redrawn-clms+1] === "1" && data[0]) {
      newSrcX = 1;
      newSrcY = 12;
    } else if (map[redrawn+clms+1] === "1" && data[0]) {
      newSrcX = 1;
      newSrcY = 13;
    } else if (map[redrawn+clms-1] === "1" && data[0]) {
      newSrcX = 1;
      newSrcY = 14;
    } else if (map[redrawn-clms-1] === "1" && data[0]) {
      newSrcX = 1;
      newSrcY = 15;
    } else if (!upLeft && !upRight) {
      newSrcX = 0;
      newSrcY = 4;
    } else if (!upRight && !dwnRight) {
      newSrcX = 1;
      newSrcY = 4;
    } else if (!dwnRight && !dwnLeft) {
      newSrcX = 2;
      newSrcY = 4;
    } else if (!dwnLeft && !upLeft) {
      newSrcX = 3;
      newSrcY = 4;
    }
  }
  
  if (overUp) {
    if (override[redrawn-clms] === undefined || override[redrawn-clms][1] !== false) {
      overrideMatrix (redrawn - clms, 1, false);
      delete loaded[redrawn-clms];
    }
  }
  if (!overUp && override[redrawn-clms] !== undefined) {
    if (override[redrawn-clms][1] !== undefined) {
      overrideMatrix (redrawn - clms, 1, "delete");
      delete loaded[redrawn-clms];
    }
  }
  if (overDwn) {
    if (override[redrawn+clms] === undefined || override[redrawn+clms][0] !== false) {
      overrideMatrix (redrawn + clms, 0, false);
      delete loaded[redrawn+clms];
    }
  }
  if (!overDwn && override[redrawn+clms] !== undefined) {
    if (override[redrawn+clms][0] !== undefined) {
      overrideMatrix (redrawn + clms, 0, "delete");
      delete loaded[redrawn+clms];
    }
  }
  if (overLeft) {
    if (override[redrawn-1] === undefined || override[redrawn-1][3] !== false) {
      overrideMatrix (redrawn - 1, 3, false);
      delete loaded[redrawn-1];
    }
  }
  if (!overLeft && override[redrawn-1] !== undefined) {
    if (override[redrawn-1][3] !== undefined) {
      overrideMatrix (redrawn - 1, 3, "delete");
      delete loaded[redrawn-1];
    }
  }
  if (overRight) {
    if (override[redrawn+1] === undefined || override[redrawn+1][2] !== false) {
      overrideMatrix (redrawn + 1, 2, false);
      delete loaded[redrawn+1];
    }
  }
  if (!overRight && override[redrawn+1] !== undefined) {
    if (override[redrawn+1][2] !== undefined) {
      overrideMatrix (redrawn + 1, 2, "delete");
      delete loaded[redrawn+1];
    }
  }
  
  newSrcX = newSrcX*18+Math.round(Math.random()*2)*72;
  newSrcY = newSrcY*18;
  clear.block (placementX, placementY);
  render.spriteMap.block (map[redrawn], placementX, placementY, newSrcX, newSrcY);
  loaded[redrawn] = 1;
}
var update = {
  general : function () {
    if (leftClck) {
      if (map[Math.floor((mouseX+viewX)/16) + Math.floor((mouseY+viewY)/16)*clms] != keyNum) {
        map[Math.floor((mouseX+viewX)/16) + Math.floor((mouseY+viewY)/16)*clms] = keyNum;
        update.block(Math.floor((mouseX+viewX)/16) + Math.floor((mouseY+viewY)/16)*clms);
      }
    }
    if (rightClck) {
      if (map[Math.floor((mouseX+viewX)/16) + Math.floor((mouseY+viewY)/16)*clms] != "0") {
        map[Math.floor((mouseX+viewX)/16) + Math.floor((mouseY+viewY)/16)*clms] = "0";
        update.block(Math.floor((mouseX+viewX)/16) + Math.floor((mouseY+viewY)/16)*clms);
      }
    }
    if (arrowUp) {
      velocityY = velocityY - accel;
      if (velocityY < 0-camSpeed) {
        velocityY = 0-camSpeed;
      }
    }
    if (arrowDown) {
      velocityY = velocityY + accel;
      if (velocityY > camSpeed) {
        velocityY = camSpeed;
      }
    }
    if (arrowLeft) {
      velocityX = velocityX - accel;
      if (velocityX < 0-camSpeed) {
        velocityX = 0-camSpeed;
      }
    }
    if (arrowRight) {
      velocityX = velocityX + accel;
      if (velocityX > camSpeed) {
        velocityX = camSpeed;
      }
    }
    viewY = viewY + velocityY;
    viewX = viewX + velocityX;
    if (viewY < 0) {
      viewY = 0;
      velocityY = 0;
    }
    //if (velocityX !== 0 || velocityY !== 0) {
      for (i = -2; i < 49; i++) {
        for (I = -2; I < 87; I++) {
          if (loaded[I+Math.round(viewX/16) + i*clms+Math.round(viewY/16)*clms] !== 1) {
            blockRedraw (I+Math.round(viewX/16) + i*clms+Math.round(viewY/16)*clms);
          }
        }
      }
    //}
    if (viewY > rows*16-745) {
      viewY = rows*16-745;
      velocityY = 0;
    }
    if (viewX < 0) {
      viewX = 0;
      velocityX = 0;
    }
    if (viewX > clms*16-1349) {
      viewX = clms*16-1349;
      velocityX = 0;
    }
    if (velocityY > 0) {
      velocityY = velocityY - accel/2;
    }
    if (velocityY < 0) {
      velocityY = velocityY + accel/2;
    }
    if (velocityX > 0) {
      velocityX = velocityX - accel/2;
    }
    if (velocityX < 0) {
      velocityX = velocityX + accel/2;
    }
    update.canvas();
  },
  canvas : function () {
    clear.full("blockCanvas");
    if (canvasX !== Math.round(viewX/8400)) {
      if (canvasX > Math.round(viewX/8400) && Math.round(viewX/8400) === Math.floor(Math.round(viewX/8400)/2)*2 || canvasX < Math.round(viewX/8400) && canvasX === Math.floor((canvasX)/2)*2) {
        clear.full ("blockStaging21");
        for (i = 0; i < 301; i++) {
          for (I = 0; I < 526; I++) {
            delete loaded[I+(Math.floor(canvasX/2)*2+canvasX-Math.round(viewX/8400))*525 + (i+Math.floor((canvasY)/2)*2*300)*clms];
          }
        }
        clear.full ("blockStaging22");
        for (i = 0; i < 301; i++) {
          for (I = 0; I < 526; I++) {
            delete loaded[I+(Math.floor(canvasX/2)*2+canvasX-Math.round(viewX/8400))*525 + (i+(Math.floor((canvasY+1)/2)*2-1)*300)*clms];
          }
        }
      }
      if (canvasX < Math.round(viewX/8400) && Math.round(viewX/8400) === Math.floor(Math.round(viewX/8400)/2)*2 || canvasX > Math.round(viewX/8400) && canvasX === Math.floor((canvasX)/2)*2) {
        clear.full ("blockStaging11");
        for (i = 0; i < 301; i++) {
          for (I = 0; I < 526; I++) {
            delete loaded[I+(Math.floor((canvasX+1)/2)*2-1+canvasX-Math.round(viewX/8400))*525 + (i+Math.floor((canvasY)/2)*2*300)*clms];
          }
        }
        clear.full ("blockStaging12");
        for (i = 0; i < 301; i++) {
          for (I = 0; I < 526; I++) {
            delete loaded[I+(Math.floor((canvasX+1)/2)*2-1+canvasX-Math.round(viewX/8400))*525 + (i+(Math.floor((canvasY+1)/2)*2-1)*300)*clms];
          }
        }
      }
      canvasX = Math.round(viewX/8400);
    }
    if (canvasY !== Math.round(viewY/4800)) {
      if (canvasY > Math.round(viewY/4800) && Math.round(viewY/4800) === Math.floor(Math.round(viewY/4800)/2)*2 || canvasY < Math.round(viewY/4800) && canvasY === Math.floor((canvasY)/2)*2) {
        clear.full ("blockStaging12");
        for (i = 0; i < 301; i++) {
          for (I = 0; I < 526; I++) {
            delete loaded[I+Math.floor((canvasX)/2)*2*525 + (i+(Math.floor(canvasY/2)*2+canvasY-Math.round(viewY/4800))*300)*clms];
          }
        }
        clear.full ("blockStaging22");
        for (i = 0; i < 301; i++) {
          for (I = 0; I < 526; I++) {
            delete loaded[I+(Math.floor((canvasX+1)/2)*2-1)*525 + (i+(Math.floor(canvasY/2)*2+canvasY-Math.round(viewY/4800))*300)*clms];
          }
        }
      }
      if (canvasY < Math.round(viewY/4800) && Math.round(viewY/4800) === Math.floor(Math.round(viewY/4800)/2)*2 || canvasY > Math.round(viewY/4800) && canvasY === Math.floor((canvasY)/2)*2) {
        clear.full ("blockStaging11");
        for (i = 0; i < 301; i++) {
          for (I = 0; I < 526; I++) {
            delete loaded[I+Math.floor((canvasX)/2)*2*525 + (i+(Math.floor((canvasY+1)/2)*2-1+canvasY-Math.round(viewY/4800))*300)*clms];
          }
        }
        clear.full ("blockStaging21");
        for (i = 0; i < 301; i++) {
          for (I = 0; I < 526; I++) {
            delete loaded[I+(Math.floor((canvasX+1)/2)*2-1)*525 + (i+(Math.floor((canvasY+1)/2)*2-1+canvasY-Math.round(viewY/4800))*300)*clms];
          }
        }
      }
      canvasY = Math.round(viewY/4800);
    }
    render.simple("blockStaging11", "blockCanvas", Math.floor(canvasX/2)*2*8400-viewX, Math.floor(canvasY/2)*2*4800-viewY);
    render.simple("blockStaging21", "blockCanvas", (Math.floor((canvasX+1)/2)*2-1)*8400-viewX, Math.floor(canvasY/2)*2*4800-viewY);
    render.simple("blockStaging12", "blockCanvas", Math.floor(canvasX/2)*2*8400-viewX, (Math.floor((canvasY+1)/2)*2-1)*4800-viewY);
    render.simple("blockStaging22", "blockCanvas", (Math.floor((canvasX+1)/2)*2-1)*8400-viewX, (Math.floor((canvasY+1)/2)*2-1)*4800-viewY);
    render.simple("cursor", "blockCanvas", mouseX, mouseY);
  },
  block : function (blck) {
    overrideMatrix (blck-clms, 1, "delete");
    blockRedraw (blck-clms);
    overrideMatrix (blck-1, 3, "delete");
    blockRedraw (blck-1);
    blockRedraw (blck);
    overrideMatrix (blck+1, 2, "delete");
    blockRedraw (blck+1);
    overrideMatrix (blck+clms, 0, "delete");
    blockRedraw (blck+clms);
    if (map[blck-clms] !== "0" && map[blck-1] !== "0") {
      blockRedraw (blck-clms-1);
    }
    if (map[blck-clms] !== "0" && map[blck+1] !== "0") {
      blockRedraw (blck-clms+1);
    }
    if (map[blck+clms] !== "0" && map[blck-1] !== "0") {
      blockRedraw (blck+clms-1);
    }
    if (map[blck+clms] !== "0" && map[blck+1] !== "0") {
      blockRedraw (blck+clms+1);
    }
  }
};
var clear = {
  full : function (canvas) {
    c = document.getElementById(canvas);
    ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
  },
  partial : function (canvas, x, y, wdth, hght) {
    c = document.getElementById(canvas);
    ctx = c.getContext("2d");
    ctx.clearRect(x, y, wdth, hght);
  },
  block : function (x, y) {
    c = document.getElementById("blockStaging" + (Math.floor(x/8400)-Math.floor(Math.floor(x/8400)/2)*2+1) + (Math.floor(y/4800)-Math.floor(Math.floor(y/4800)/2)*2+1));
    ctx = c.getContext("2d");
    ctx.clearRect(x-Math.floor(x/8400)*8400, y-Math.floor(y/4800)*4800, 16, 16);
  }
};
var render = {
  spriteMap : {
    noSpec : function (id, canvas, x, y, srcx, srcy, wdth, hght) {
      c = document.getElementById(canvas);
      ctx = c.getContext("2d");
      img = document.getElementById(id);
      ctx.drawImage (img, srcx, srcy, wdth, hght, x, y, wdth, hght);
    },
    block : function (id, x, y, srcx, srcy) {
      c = document.getElementById("blockStaging" + (Math.floor(x/8400)-Math.floor(Math.floor(x/8400)/2)*2+1) + (Math.floor(y/4800)-Math.floor(Math.floor(y/4800)/2)*2+1));
      ctx = c.getContext("2d");
      img = document.getElementById(id);
      ctx.drawImage (img, srcx, srcy, 16, 16, x-Math.floor(x/8400)*8400, y-Math.floor(y/4800)*4800, 16, 16);
    }
  },
  simple : function (id, canvas, x, y) {
    c = document.getElementById(canvas);
    ctx = c.getContext("2d");
    img = document.getElementById(id);
    ctx.drawImage (img, x, y);
  }
};

function thingy () {
  document.getElementById("thingy").innerHTML = viewX.toString() + "  " + viewY.toString() + "  " + canvasX.toString() + "  " + canvasY.toString();
}

function mousePos (event) {
  mouseX = event.clientX - 7;
  mouseY = event.clientY - 7;
}
function mouseButton (event) {
  if (event === null) {
    leftClck = false;
    rightClck = false;
  }
  if (event.button === 0) {
    leftClck = true;
    rightClck = false;
  }
  if (event.button === 2) {
    leftClck = false;
    rightClck = true;
  }
}
document.onkeydown = function () {
  if (event.key === "w") {
    arrowUp = true;
  }
  if (event.key === "s") {
    arrowDown = true;
  }
  if (event.key === "a") {
    arrowLeft = true;
  }
  if (event.key === "d") {
    arrowRight = true;
  }
  if (event.key === "1" || event.key === "2" || event.key === "3") {
    keyNum = event.key;
  }
};
document.onkeyup = function () {
  if (event.key === "w") {
    arrowUp = false;
  }
  if (event.key === "s") {
    arrowDown = false;
  }
  if (event.key === "a") {
    arrowLeft = false;
  }
  if (event.key === "d") {
    arrowRight = false;
  }
};