'use client';
import useTimeCounter from '@/react-things/hooks/use-time-counter';

import { robotoMono } from '@/react-things/fonts';

const constructReadableTime = (timeLeft: number | null) => {
  if (timeLeft === null) {
    return '--:--:-- hours';
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const Countdown = ({ endTime }: { endTime: Date }) => {
  const { timeLeft, hasEnded } = useTimeCounter(endTime);

  if (hasEnded) {
    return 'ended';
  }

  return (
    <span className={robotoMono.className}>
      {constructReadableTime(timeLeft)}
    </span>
  );
};

export default Countdown;
