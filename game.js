const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 500,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue'
};

const dataPackets = [];
const obstacles = [];
const packetCount = 5;
const obstacleCount = 8;

let timer = 60; // 60 секунд таймера
let gameOver = false;
let score = 0;
let isWin = false; // Состояние победы

// Обработка клавиш
const keys = {};
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Создаем пакеты данных
for (let i = 0; i < packetCount; i++) {
    dataPackets.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 300 + 50,
        width: 30,
        height: 30,
        color: 'green',
        collected: false
    });
}

// Создаем препятствия
for (let i = 0; i < obstacleCount; i++) {
    obstacles.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        width: 50,
        height: 20,
        speed: Math.random() * 2 + 1,
        direction: Math.random() > 0.5 ? 1 : -1,
        color: 'red'
    });
}

// Таймер
function countdown() {
    if (timer > 0 && !gameOver && !isWin) {
        setTimeout(() => {
            timer--;
            countdown();
        }, 1000);
    } else if (timer === 0 && !isWin) {
        gameOver = true;
        alert('Время вышло! Игра окончена. Ваш счет: ' + score);
    }
}

// Обновление позиции препятствий
function moveObstacles() {
    obstacles.forEach(obs => {
        obs.x += obs.speed * obs.direction;
        if (obs.x <= 0 || obs.x + obs.width >= canvas.width) {
            obs.direction *= -1;
        }
    });
}

// Проверка столкновений
function checkCollisions() {
    // с препятствиями
    obstacles.forEach(obs => {
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
            alert('Вы столкнулись с препятствием! Игра окончена. Ваш счет: ' + score);
        }
    });

    // с пакетами данных
    dataPackets.forEach(packet => {
        if (
            !packet.collected &&
            player.x < packet.x + packet.width &&
            player.x + player.width > packet.x &&
            player.y < packet.y + packet.height &&
            player.y + player.height > packet.y
        ) {
            packet.collected = true;
            score++;
        }
    });
}

// Функция отображения окна победы
function showWinScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Поздравляем! Вы победили!', canvas.width / 2, canvas.height / 2 - 50);
    
    // Создаем кнопку
    const button = document.createElement('button');
    button.innerText = 'Дальше';
    button.style.position = 'absolute';
    button.style.left = (canvas.offsetLeft + canvas.width / 2 - 50) + 'px';
    button.style.top = (canvas.offsetTop + canvas.height / 2 + 20) + 'px';
    button.style.width = '100px';
    document.body.appendChild(button);

    button.onclick = () => {
        alert('Далее — новая игра или другой сценарий');
        location.reload(); // Перезагружаем страницу для новой игры
    };
}

// Проверка победы
function checkWinCondition() {
    const allCollected = dataPackets.every(packet => packet.collected);
    if (allCollected && !isWin) {
        isWin = true;
        showWinScreen();
    }
}

// Основной цикл игры
function gameLoop() {
    if (gameOver) {
        return; // Игра завершена, ничего не делаем
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Обработка движения игрока
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;

    // Ограничение по границам
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // Обновление препятствий
    moveObstacles();

    // Проверка столкновений
    checkCollisions();

    // Проверка победы
    checkWinCondition();

    // Рисуем игрока
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Рисуем пакеты данных
    dataPackets.forEach(packet => {
        if (!packet.collected) {
            ctx.fillStyle = packet.color;
            ctx.fillRect(packet.x, packet.y, packet.width, packet.height);
        }
    });

    // Рисуем препятствия
    obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Таймер и счет
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Время: ' + timer + ' сек', 10, 20);
    ctx.fillText('Очки: ' + score, 10, 50);

    requestAnimationFrame(gameLoop);
}

// Запуск таймера и игры
countdown();
gameLoop();




// <!-- <!DOCTYPE html>
// <html lang="ru">
// <head>
// <meta charset="UTF-8" />
// <title>Простая платформа игра</title>
// <style>
//   body { margin: 0; overflow: hidden; }
//   canvas { display: block; }
// </style>
// </head>
// <body>
// <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js"></script>
// <script>
// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 500 },
//             debug: false
//         }
//     },
//     scene: {
//         preload: preload,
//         create: create,
//         update: update
//     }
// };

// let player;
// let cursors;
// let platforms;
// let enemies;
// let gameOver = false;

// const game = new Phaser.Game(config);

// function preload() {
//     this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
//     this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
//     this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
//     this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/blue_ball.png');
// }

// function create() {
//     // фон
//     this.add.image(400, 300, 'sky');

//     // платформы
//     platforms = this.physics.add.staticGroup();
//     platforms.create(400, 590, 'ground').setScale(2).refreshBody();
//     platforms.create(600, 450, 'ground');
//     platforms.create(50, 350, 'ground');
//     platforms.create(750, 300, 'ground');

//     // игрок
//     player = this.physics.add.sprite(100, 450, 'player');
//     player.setBounce(0.2);
//     player.setCollideWorldBounds(true);

//     // враги
//     enemies = this.physics.add.group();
//     enemies.create(600, 400, 'enemy');
//     enemies.create(50, 320, 'enemy');
//      enemies.create(400, 200, 'enemy');
//     enemies.create(60, 220, 'enemy');

//     // управление
//     cursors = this.input.keyboard.createCursorKeys();

//     // коллизии
//     this.physics.add.collider(player, platforms);
//     this.physics.add.collider(enemies, platforms);
//     this.physics.add.collider(enemies, player, hitEnemy, null, this);
// }

// function update() {
//     if (gameOver) return;

//     if (cursors.left.isDown) {
//         player.setVelocityX(-160);
//     } else if (cursors.right.isDown) {
//         player.setVelocityX(160);
//     } else {
//         player.setVelocityX(0);
//     }

//     if (cursors.up.isDown && player.body.touching.down) {
//         player.setVelocityY(-330);
//     }

//     // простая логика врагов: движение туда-сюда
//     enemies.children.iterate(function(enemy) {
//         if (!enemy.direction) enemy.direction = 1;
//         enemy.setVelocityX(50 * enemy.direction);
//         if (enemy.x > 750) enemy.direction = -1;
//         if (enemy.x < 50) enemy.direction = 1;
//     });
// }

// function hitEnemy(player, enemy) {
//     // проигрыш или перезапуск
//     alert('Вы проиграли!');
//     gameOver = true;
//     this.scene.restart();
// }
// </script>
// </body>
// </html> -->


// <!-- 2 level -->


// <!-- <!DOCTYPE html>
// <html lang="ru">
// <head>
// <meta charset="UTF-8" />
// <title>Игра - Олимпиада внутри сети</title>
// <style>
//   canvas {
//     border: 1px solid #000;
//   }
// </style>
// </head>
// <body>
// <canvas id="gameCanvas" width="800" height="600"></canvas>
// <script src="game.js"></script>
// </body>
// </html> -->


// <!-- 3 уровень

// <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="utf-8" />
//     <title>Telecom Route Game</title>
//     <style>
//       body { margin: 0; overflow: hidden; background: #050510; color: #fff; font-family: monospace; }
//       canvas { display: block; }
//       #ui {
//         position: absolute;
//         bottom: 20px;
//         left: 20px;
//         width: calc(100% - 40px);
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         padding: 10px 20px;
//         background: rgba(0,0,0,0.6);
//         border-radius: 8px;
//         backdrop-filter: blur(4px);
//       }
//       .stat { font-size: 18px; text-shadow: 0 0 4px #0ff; }
//       button {
//         background: #00f;
//         color: #fff;
//         border: none;
//         padding: 12px 24px;
//         font-size: 16px;
//         cursor: pointer;
//         border-radius: 6px;
//         box-shadow: 0 0 10px rgba(0,255,255,0.4);
//       }
//       button:hover { background: #0ff; color: #000; }
//       #msg {
//         position: absolute;
//         top: 20px;
//         left: 20px;
//         font-size: 20px;
//         text-shadow: 0 0 8px #fff;
//       }
//     </style>
//   </head>
//   <body>
//     <div id="msg"></div>
//     <canvas id="game"></canvas>
//     <div id="ui">
//       <div class="stat">Бюджет: <span id="budget">100</span> / 100</div>
//       <button id="runBtn">Запустить сигнал</button>
//       <div class="stat">Статус: <span id="status">Ожидание</span></div>
//     </div>

//     <script>
//       const canvas = document.getElementById('game');
//       const ctx = canvas.getContext('2d');
//       const msgEl = document.getElementById('msg');
//       const budgetEl = document.getElementById('budget');
//       const statusEl = document.getElementById('status');
//       const runBtn = document.getElementById('runBtn');

//       let width, height;
//       let nodes = [];
//       let edges = [];
//       let packets = [];
//       const BUDGET_LIMIT = 100;
//       let budgetUsed = 0;

//       // --- Инициализация ---
//       function resize() {
//         width = canvas.width = window.innerWidth;
//         height = canvas.height = window.innerHeight;
//       }
//       window.addEventListener('resize', resize);
//       resize();

//       class Node {
//         constructor(x, y, type) {
//           this.x = x;
//           this.y = y;
//           this.r = 14;
//           this.type = type; // 'start', 'end', 'normal'
//           this.selected = false;
//         }
//         draw() {
//           const colors = { start: '#0f0', end: '#f00', normal: '#aaa' };
//           const glow = { start: '#0f0', end: '#f00', normal: '#444' };
//           ctx.save();
//           ctx.shadowBlur = 12;
//           ctx.shadowColor = glow[this.type];
//           ctx.fillStyle = colors[this.type];
//           ctx.beginPath();
//           ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
//           ctx.fill();
//           ctx.restore();
//         }
//       }

//       class Edge {
//         constructor(a, b) {
//           this.a = a;
//           this.b = b;
//           this.cost = Math.floor(Math.hypot(a.x - b.x, a.y - b.y) / 40) + 1; // чем дальше — тем дороже
//           this.load = 0; // нагрузка
//         }
//         draw() {
//           const alpha = Math.max(0.3, 1 - this.load / 10); // прозрачность от нагрузки
//           ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
//           ctx.lineWidth = 3 + this.load * 0.5;
//           ctx.setLineDash([10, 10]);
//           ctx.beginPath();
//           ctx.moveTo(this.a.x, this.a.y);
//           ctx.lineTo(this.b.x, this.b.y);
//           ctx.stroke();
//           ctx.setLineDash([]);

//           // Пульсация
//           if (this.load > 0) {
//             ctx.fillStyle = `rgba(255, 0, 0, ${Math.min(0.8, this.load / 15)})`;
//             ctx.beginPath();
//             ctx.arc((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2, 6 + this.load, 0, Math.PI*2);
//             ctx.fill();
//           }
//         }
//       }

//       class Packet {
//         constructor(start, end) {
//           this.x = start.x;
//           this.y = start.y;
//           this.target = end;
//           this.speed = 4;
//           this.done = false;
//         }
//         update() {
//           const dx = this.target.x - this.x;
//           const dy = this.target.y - this.y;
//           const dist = Math.hypot(dx, dy);
//           if (dist < this.speed) {
//             this.x = this.target.x;
//             this.y = this.target.y;
//             this.done = true;
//           } else {
//             const move = this.speed / dist;
//             this.x += dx * move;
//             this.y += dy * move;
//           }
//         }
//         draw() {
//           ctx.fillStyle = '#fff';
//           ctx.shadowBlur = 8;
//           ctx.shadowColor = '#fff';
//           ctx.beginPath();
//           ctx.arc(this.x, this.y, 6, 0, Math.PI*2);
//           ctx.fill();
//           ctx.shadowBlur = 0;
//         }
//       }

//       // Генерация узлов
//       function initLevel() {
//         nodes = [];
//         edges = [];
//         packets = [];
//         budgetUsed = 0;

//         const start = new Node(100, height/2, 'start');
//         const end = new Node(width - 100, height/2, 'end');
//         nodes.push(start);
//         nodes.push(end);

//         // Промежуточные узлы
//         for (let i = 0; i < 6; i++) {
//           nodes.push(new Node(
//             150 + Math.random() * (width - 300),
//             100 + Math.random() * (height - 200),
//             'normal'
//           ));
//         }

//         statusEl.textContent = 'Соединяй узлы';
//         msgEl.textContent = '';
//       }

//       initLevel();

//       // --- Ввод и логика ---
//       let selectedNode = null;

//       canvas.addEventListener('mousedown', e => {
//         const rect = canvas.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         const clickedNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.r + 10);
//         if (!clickedNode) return;

//         if (!selectedNode) {
//           selectedNode = clickedNode;
//           clickedNode.selected = true;
//         } else if (selectedNode === clickedNode) {
//           selectedNode.selected = false;
//           selectedNode = null;
//         } else {
//           // Создаём ребро, если его ещё нет
//           const exists = edges.some(ed => (ed.a === selectedNode && ed.b === clickedNode) || (ed.b === selectedNode && ed.a === clickedNode));
//           if (!exists && selectedNode !== clickedNode) {
//             const edge = new Edge(selectedNode, clickedNode);
//             if (budgetUsed + edge.cost <= BUDGET_LIMIT) {
//               edges.push(edge);
//               budgetUsed += edge.cost;
//               budgetEl.textContent = budgetUsed + ' / ' + BUDGET_LIMIT;
//             } else {
//               msgEl.textContent = 'Не хватает бюджета!';
//               msgEl.style.color = '#f44';
//             }
//           }
//           selectedNode.selected = false;
//           selectedNode = null;
//         }
//       });

//       runBtn.addEventListener('click', () => {
//         if (edges.length === 0) return;
        
//         // Проверка связности (BFS)
//         const visited = new Set();
//         const queue = [nodes[0]]; // start
//         visited.add(nodes[0]);
//         let connected = false;

//         while (queue.length > 0) {
//           const cur = queue.shift();
//           if (cur === nodes[1]) { // end
//             connected = true;
//             break;
//           }
//           edges.forEach(ed => {
//             let next = null;
//             if (ed.a === cur && !visited.has(ed.b)) next = ed.b;
//             else if (ed.b === cur && !visited.has(ed.a)) next = ed.a;
//             if (next) {
//               visited.add(next);
//               queue.push(next);
//             }
//           });
//         }

//         if (!connected) {
//           statusEl.textContent = 'Нет пути!';
//           statusEl.style.color = '#f44';
//           msgEl.textContent = 'Проложи соединение от старта до финиша';
//           return;
//         }

//         // Запускаем пакеты
//         packets.push(new Packet(nodes[0], nodes[1]));
//         statusEl.textContent = 'Сигнал в пути';
//         statusEl.style.color = '#0f0';
//         msgEl.textContent = '';
//       });

//       // --- Отрисовка и анимация ---
//       function drawNodes() {
//         nodes.forEach(n => n.draw());
//       }

//       function drawEdges() {
//         edges.forEach(e => e.draw());
//       }

//       function updatePackets() {
//         packets.forEach(p => p.update());
//         packets = packets.filter(p => !p.done);
//       }

//       function drawPackets() {
//         packets.forEach(p => p.draw());
//       }

//       function loop() {
//         ctx.clearRect(0, 0, width, height);

//         // Здесь можно рисовать твой фон (image.draw)
//         // ctx.drawImage(bgImage, 0, 0, width, height);

//         drawEdges();
//         drawNodes();
//         updatePackets();
//         drawPackets();

//         requestAnimationFrame(loop);
//       }
//       loop();
//     </script>
//   </body>
// </html> -->
