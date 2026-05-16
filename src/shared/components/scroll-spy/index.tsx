import {
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export type ScrollSpyOffSet =
  | {
      top?: number;
      bottom?: number;
    }
  | number;

type SectionRef = {
  [key: string]: { element: HTMLElement | null; offset?: ScrollSpyOffSet };
};

interface ScrollSpyProps {
  offset?: ScrollSpyOffSet;
}

interface ScrollSpyContextInterface {
  activeElemId: string;
  setActiveElemId: Dispatch<SetStateAction<string>>;
  sectionRefs: MutableRefObject<SectionRef>;
}

export const ScrollSpyContext = createContext({} as ScrollSpyContextInterface);

const ScrollSpy = ({ children, offset: globalOffset }: PropsWithChildren<ScrollSpyProps>) => {
  const [activeElemId, setActiveElemId] = useState('');
  const sectionRefs = useRef<SectionRef>({});
  const lastScrollTopRef = useRef(0);

  const getScrollRoot = () => {
    const firstSection = Object.values(sectionRefs.current).find((item) => item.element)?.element;
    let parent = firstSection?.parentElement;

    while (parent && parent !== document.body) {
      const styles = window.getComputedStyle(parent);
      const canScroll = /(auto|scroll|overlay)/.test(`${styles.overflow}${styles.overflowY}`);

      if (canScroll && parent.scrollHeight > parent.clientHeight) {
        return parent;
      }

      parent = parent.parentElement;
    }

    return window;
  };

  const isInView = ({
    element,
    offset,
  }: {
    element: HTMLElement | null;
    offset?: ScrollSpyOffSet;
  }) => {
    if (!element) {
      return false;
    }
    let topOffset = 0;
    let bottomOffset = 0;

    if (!offset) {
      offset = globalOffset;
    }

    if (offset) {
      if (typeof offset === 'number') {
        topOffset = offset;
        bottomOffset = offset;
      } else {
        topOffset = offset.top ?? 0;
        bottomOffset = offset.bottom ?? 0;
      }
    }

    const rect = element.getBoundingClientRect();
    const scrollRoot = getScrollRoot();
    const rootRect =
      scrollRoot instanceof Window
        ? { top: 0, height: window.innerHeight }
        : scrollRoot.getBoundingClientRect();
    const rootTop = rootRect.top;
    const rootHeight = rootRect.height;

    return (
      (rect.top >= rootTop && rect.top <= rootTop + rootHeight - topOffset) ||
      (rect.bottom >= rootTop + bottomOffset && rect.bottom <= rootTop + rootHeight - topOffset)
    );
  };

  const spy = useCallback(() => {
    const scrollRoot = getScrollRoot();
    const scrollTop =
      scrollRoot instanceof Window
        ? window.scrollY || document.documentElement.scrollTop
        : scrollRoot.scrollTop;

    let toUp = false;
    if (scrollTop > lastScrollTopRef.current) {
      toUp = false;
    } else {
      toUp = true;
    }
    lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop;

    const items: string[] = [];
    Object.values(sectionRefs.current).forEach((item) => {
      if (item.element && isInView(item)) {
        items.push(item.element.id);
      }
    });

    if (!items.length) {
      return;
    }

    if (toUp) {
      setActiveElemId(items[0]);
    } else {
      setActiveElemId(items[items.length - 1]);
    }
  }, [globalOffset]);

  useEffect(() => {
    const scrollRoot = getScrollRoot();
    spy();
    scrollRoot.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    return () => {
      scrollRoot.removeEventListener('scroll', spy);
      window.removeEventListener('resize', spy);
    };
  }, [spy]);

  return (
    <ScrollSpyContext
      value={{
        activeElemId,
        setActiveElemId,
        sectionRefs,
      }}
    >
      {children}
    </ScrollSpyContext>
  );
};

export const useScrollSpyContext = () => use(ScrollSpyContext);

export default ScrollSpy;
