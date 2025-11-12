import React from 'react';

const useTimeCounter = (endTime: Date) => {
  const [timeLeft, setTimeLeft] = React.useState<number>(0);
  const [hasEnded, setHasEnded] = React.useState(false);

  React.useEffect(() => {
    const endDate = new Date(endTime);
    const calculateTimeLeft = () => {
      const now = new Date();
      const diffMs = endDate.getTime() - now.getTime();

      setHasEnded(diffMs <= 0);
      setTimeLeft(Math.max(diffMs, 0));
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return { timeLeft, hasEnded };
};

export default useTimeCounter;
