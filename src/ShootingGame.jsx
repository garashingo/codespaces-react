import React, { useState, useRef, useEffect } from 'react';

const ShootingGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const gameStateRef = useRef({
    player: null,
    enemies: [],
    bullets: [],
    config: null,
    ctx: null,
    isDragging: false,
    animationFrameId: null
  });

  const initGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const config = {
      width: 400,
      height: 600,
      playerSize: 40,
      enemySize: 30,
      bulletSize: 10,
      playerColor: '#4CAF50',
      enemyColor: '#F44336',
      bulletColor: '#2196F3',
    };

    gameStateRef.current = {
      player: { x: config.width / 2, y: config.height - 100 },
      enemies: [],
      bullets: [],
      config: config,
      ctx: ctx,
      isDragging: false,
      animationFrameId: null
    };

    const createEnemy = () => {
      const { enemies, config } = gameStateRef.current;
      const x = Math.random() * (config.width - config.enemySize);
      enemies.push({ x, y: 0 });
    };

    const gameLoop = () => {
      const { player, enemies, bullets, config, ctx } = gameStateRef.current;

      ctx.clearRect(0, 0, config.width, config.height);

      if (Math.random() < 0.03) createEnemy();

      for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
          const bullet = bullets[i];
          const enemy = enemies[j];
          
          if (
            bullet &&
            enemy &&
            bullet.x < enemy.x + config.enemySize &&
            bullet.x + config.bulletSize > enemy.x &&
            bullet.y < enemy.y + config.enemySize &&
            bullet.y + config.bulletSize > enemy.y
          ) {
            enemies.splice(j, 1);
            bullets.splice(i, 1);
            setScore(prevScore => prevScore + 1);
            break;
          }
        }
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.y += 3;
        ctx.fillStyle = config.enemyColor;
        ctx.fillRect(enemy.x, enemy.y, config.enemySize, config.enemySize);

        if (enemy.y > config.height) {
          enemies.splice(i, 1);
        }
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= 5;
        ctx.fillStyle = config.bulletColor;
        ctx.fillRect(bullet.x, bullet.y, config.bulletSize, config.bulletSize);

        if (bullet.y < 0) {
          bullets.splice(i, 1);
        }
      }

      ctx.fillStyle = config.playerColor;
      ctx.fillRect(
        player.x, 
        player.y, 
        config.playerSize, 
        config.playerSize
      );

      const gameOverCheck = enemies.some(enemy => 
        enemy.y + config.enemySize > config.height - 100
      );

      if (gameOverCheck) {
        setGameOver(true);
      } else {
        gameStateRef.current.animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    canvas.width = config.width;
    canvas.height = config.height;

    gameLoop();
  };

  const createBullet = (event) => {
    event.preventDefault();

    if (gameOver) {
      initGame();
      setGameOver(false);
      setScore(0);
      return;
    }

    const { player, bullets, config } = gameStateRef.current;
    const bulletX = player.x + config.playerSize / 2 - config.bulletSize / 2;
    const bulletY = player.y;
    bullets.push({ x: bulletX, y: bulletY });
  };

  const handlePlayerMove = (event) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    const { player, config } = gameStateRef.current;
    const clientX = event.touches 
      ? event.touches[0].clientX 
      : event.clientX;
    const rect = canvas.getBoundingClientRect();
    const newX = clientX - rect.left - config.playerSize / 2;
    const limitedX = Math.max(0, Math.min(newX, config.width - config.playerSize));
    if (player) {
      player.x = limitedX;
    }
  };

  const handleDragStart = (event) => {
    event.preventDefault();
    gameStateRef.current.isDragging = true;
    handlePlayerMove(event);
  };

  const handleDragMove = (event) => {
    event.preventDefault();
    if (gameStateRef.current.isDragging) {
      handlePlayerMove(event);
    }
  };

  const handleDragEnd = (event) => {
    event.preventDefault();
    gameStateRef.current.isDragging = false;
  };

  useEffect(() => {
    initGame();
    const canvas = canvasRef.current;

    canvas.style.touchAction = 'none';

    canvas.addEventListener('mousedown', handleDragStart);
    canvas.addEventListener('mousemove', handleDragMove);
    canvas.addEventListener('mouseup', handleDragEnd);
    canvas.addEventListener('mouseleave', handleDragEnd);

    canvas.addEventListener('touchstart', (event) => {
      handleDragStart(event);
      createBullet(event);
    });
    canvas.addEventListener('touchmove', handleDragMove);
    canvas.addEventListener('touchend', handleDragEnd);

    canvas.addEventListener('click', createBullet);

    return () => {
      const { animationFrameId } = gameStateRef.current;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      canvas.removeEventListener('mousedown', handleDragStart);
      canvas.removeEventListener('mousemove', handleDragMove);
      canvas.removeEventListener('mouseup', handleDragEnd);
      canvas.removeEventListener('mouseleave', handleDragEnd);
      canvas.removeEventListener('touchstart', handleDragStart);
      canvas.removeEventListener('touchmove', handleDragMove);
      canvas.removeEventListener('touchend', handleDragEnd);
      canvas.removeEventListener('click', createBullet);
    };
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">クリックシューティングゲーム</h2>
        <p>スコア: {score}</p>
        {gameOver && <p className="text-red-500">ゲームオーバー！クリックまたはタップでリスタート</p>}
      </div>
      <canvas 
        ref={canvasRef} 
        className="border-2 border-gray-300"
      />
      <p className="mt-2 text-sm text-gray-600">
        プレイヤーをドラッグまたはタッチして移動、クリックまたはタップで弾を撃つ
      </p>
    </div>
  );
};

export default ShootingGame;