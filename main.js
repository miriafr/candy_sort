let selectedTheme = 'default';
let candyCount = 50;

const colorThemes = {
    classic: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffa500, 0x800080],
    pastel:  [0xffc1cc, 0xfff0a5, 0xbaffc9, 0xc5c8ff, 0xfed6ff, 0xcafffd],
    neon:    [0xff00ff, 0x00ffff, 0xffff00, 0xff6600, 0x00ff00, 0x6600ff],
    default: [0xFF733C,0xff4374, 0xff95b6, 0xfeb500, 0x4D8B31, 0x7371FC]
  };

let game;

const config = {
  type: Phaser.AUTO,
  width: 700,
  height: 700,
  backgroundColor: '#eeeeee',
  scene: {
    preload,
    create
  },
  parent: 'game-container'
};

function preload() {
    this.load.image('candy', 'assets/candy.png');
    this.load.image('highlight1', 'assets/highlight1.png');
    this.load.image('highlight2', 'assets/highlight2.png');
    this.load.image('highlight3', 'assets/highlight3.png');
}
const highlightOptions = ['highlight1', 'highlight2', 'highlight3'];


function create() {
  const scene = this;
  const candyColors = colorThemes[selectedTheme];

  // ✅ Set up drag listeners
  scene.input.on('dragstart', (_, obj) => obj.setScale(1.1));
  scene.input.on('drag', (_, obj, dragX, dragY) => {
    obj.x = dragX;
    obj.y = dragY;
  });
  scene.input.on('dragend', (_, obj) => obj.setScale(1));

  // 🍬 Scatter candies randomly
  for (let i = 0; i < candyCount; i++) {
    const color = Phaser.Utils.Array.GetRandom(candyColors);
    const x = Phaser.Math.Between(150, config.width - 100);
    const y = Phaser.Math.Between(150, config.height - 100);
    const rotation = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const scale = Phaser.Math.FloatBetween(0.9, 1.1);
  
    // 🍬 Base candy (tinted + rotated)
    const base = scene.add.image(0, 0, 'candy')
      .setTint(color)
      .setRotation(rotation)
      .setScale(1);
  
    // ✨ Highlight (static direction)
    const highlightKey = Phaser.Utils.Array.GetRandom(highlightOptions);

    const highlight = scene.add.image(0, 0, highlightKey)
      .setAlpha(0.5)
      .setScale(1);
  
    // 📦 Group them into a container
    const candyContainer = scene.add.container(x, y, [base, highlight])
      .setSize(base.width, base.height)
      .setScale(scale)
      .setInteractive({ draggable: true });
  
    scene.input.setDraggable(candyContainer);
  }
}

// 🎯 Handle theme change
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedTheme = btn.dataset.theme;
    restartGame();
  });
});

// 🎯 Handle candy count change
document.getElementById('candyCountInput').addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  if (!isNaN(val) && val >= 10 && val <= 200) {
    candyCount = val;
    restartGame();
  }
});

// 🔁 Restart the game with current settings
function restartGame() {
  if (game) {
    game.destroy(true);
  }
  game = new Phaser.Game(config);
}

// ▶️ Launch the game
restartGame();
