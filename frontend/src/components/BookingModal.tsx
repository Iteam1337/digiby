import { useRef, useEffect, useState } from 'react';

type Props = {
  close: () => void;
  children: JSX.Element;
};

const BookingModal = ({ close, children }: Props) => {
  const [focusableElements, setFocusableElements] = useState<
    HTMLElement[] | undefined
  >();
  const ref = useRef<HTMLDivElement>(null);
  const activeElement = document.activeElement as HTMLElement;

  let scrollY = 0;
  if (typeof window !== 'undefined') {
    scrollY = window && window.scrollY;
  }

  let activeIndex = -1;

  const handleTab = (evt: KeyboardEvent) => {
    const total = focusableElements?.length;
    if (!evt.shiftKey) {
      activeIndex + 1 === total ? (activeIndex = 0) : (activeIndex += 1);
      if (focusableElements) focusableElements[activeIndex].focus();
      return evt.preventDefault();
    }
    if (evt.shiftKey) {
      total && activeIndex - 1 < 0
        ? (activeIndex = total - 1)
        : (activeIndex -= 1);
      if (focusableElements) {
        const typecastElement = focusableElements[activeIndex] as HTMLElement;
        typecastElement.focus();
      }
      return evt.preventDefault();
    }
  };

  const handleEscape = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape') close();
  };

  const keyListenersMap = new Map([
    ['Tab', handleTab],
    ['Escape', handleEscape],
  ]);

  const handleKeydown = (evt: KeyboardEvent) => {
    const listener = keyListenersMap.get(evt.key);
    return listener && listener(evt);
  };

  useEffect(() => {
    setFocusableElements(
      Array.from(
        ref.current?.querySelectorAll(
          'a, button, textarea'
        ) as NodeListOf<HTMLElement>
      )
    );
  }, [ref]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      activeElement.focus();
    };
  });

  return (
    <div
      className={`absolute inset-x-1/2 bg-[rgb(0,0,0,0.5)] top-[calc(50%+${scrollY}px)] left-1/2 z-20 h-screen w-screen translate-x-[-50%]`}
      ref={ref}
    >
      <div className="fixed top-1/3 left-1/2 flex w-full translate-y-[-50%] translate-x-[-50%] justify-center">
        <div className="flex-column mx-auto w-4/5 max-w-screen-sm rounded-md bg-pm-white p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
