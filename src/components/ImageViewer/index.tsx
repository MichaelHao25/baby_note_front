import { useCallback, useEffect, useRef, useState } from 'react';

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
}

export default function ImageViewer({
  images,
  initialIndex = 0,
  visible,
  onClose,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const touchStartRef = useRef({
    x: 0,
    y: 0,
    distance: 0,
    time: 0,
    isPinch: false,
  });

  // visible 变为 true 时重置状态
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setOffsetX(0);
    }
  }, [visible, initialIndex]);

  // 获取两指间距离
  const getDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touches = e.touches;

      if (touches.length === 2) {
        // 双指缩放开始
        touchStartRef.current.isPinch = true;
        touchStartRef.current.distance = getDistance(touches[0], touches[1]);
      } else if (touches.length === 1) {
        touchStartRef.current.isPinch = false;
        touchStartRef.current.x = touches[0].clientX;
        touchStartRef.current.y = touches[0].clientY;
        touchStartRef.current.time = Date.now();
        setIsAnimating(false);
      }
    },
    [],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touches = e.touches;

      if (touches.length === 2 && touchStartRef.current.isPinch) {
        // 双指缩放
        const newDistance = getDistance(touches[0], touches[1]);
        const ratio = newDistance / touchStartRef.current.distance;
        const newScale = Math.min(3, Math.max(1, scale * ratio));
        setScale(newScale);
        touchStartRef.current.distance = newDistance;
      } else if (
        touches.length === 1 &&
        !touchStartRef.current.isPinch
      ) {
        // 单指滑动
        const deltaX = touches[0].clientX - touchStartRef.current.x;

        // 缩放状态下不允许滑动切换
        if (scale > 1) return;

        // 边界橡皮筋效果
        let adjustedDelta = deltaX;
        if (
          (currentIndex === 0 && deltaX > 0) ||
          (currentIndex === images.length - 1 && deltaX < 0)
        ) {
          adjustedDelta = deltaX * 0.3;
        }
        setOffsetX(adjustedDelta);
      }
    },
    [scale, currentIndex, images.length],
  );

  const handleTouchEnd = useCallback(() => {
    if (touchStartRef.current.isPinch) {
      // 双指缩放结束
      touchStartRef.current.isPinch = false;
      if (scale < 1.2) {
        setIsAnimating(true);
        setScale(1);
      }
      return;
    }

    // 缩放状态下不处理滑动切换
    if (scale > 1) return;

    const elapsed = Date.now() - touchStartRef.current.time;
    const threshold = 50;

    setIsAnimating(true);

    if (
      (Math.abs(offsetX) > threshold && elapsed < 500) ||
      Math.abs(offsetX) > 100
    ) {
      if (offsetX < -threshold && currentIndex < images.length - 1) {
        // 向左滑，下一张
        setOffsetX(-window.innerWidth);
        setTimeout(() => {
          setIsAnimating(false);
          setCurrentIndex((prev) => prev + 1);
          setOffsetX(0);
          setScale(1);
        }, 300);
      } else if (offsetX > threshold && currentIndex > 0) {
        // 向右滑，上一张
        setOffsetX(window.innerWidth);
        setTimeout(() => {
          setIsAnimating(false);
          setCurrentIndex((prev) => prev - 1);
          setOffsetX(0);
          setScale(1);
        }, 300);
      } else {
        // 到达边界，弹回
        setOffsetX(0);
      }
    } else {
      // 未达阈值，弹回
      setOffsetX(0);
    }
  }, [offsetX, currentIndex, images.length, scale]);

  // 点击背景区域关闭
  const handleBgClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  if (!visible || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95"
      onClick={handleBgClick}
    >
      {/* 顶部栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 text-white">
        <span className="text-sm">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-2xl leading-none text-white/80 active:text-white"
        >
          &times;
        </button>
      </div>

      {/* 图片容器 */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt=""
          className="max-w-full max-h-full object-contain select-none pointer-events-none"
          style={{
            transform: `translateX(${offsetX}px) scale(${scale})`,
            transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
          }}
          draggable={false}
        />
      </div>

      {/* 底部圆点指示器 */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`block w-2 h-2 rounded-full transition-colors duration-200 ${
                i === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
