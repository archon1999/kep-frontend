type MathJaxRuntime = {
  typesetPromise: (elements?: Element[]) => Promise<void>;
  typesetClear?: (elements?: Element[]) => void;
};

declare global {
  interface Window {
    MathJax?: Partial<MathJaxRuntime> & {
      startup?: { promise?: Promise<void>; typeset?: boolean };
    };
  }
}

export const hasMathMarkup = (html?: string | null) =>
  Boolean(
    html && /\\\(|\\\[|\$\$|\\(?:begin|eqref|ref)\{|<math\b|math\/tex|ql-mathjax/i.test(html),
  );

let loading: Promise<MathJaxRuntime> | undefined;

/** Wait for the existing async script, including MathJax's own startup. */
export const loadMathJax = (): Promise<MathJaxRuntime> => {
  if (window.MathJax?.typesetPromise)
    return Promise.resolve(window.MathJax.startup?.promise).then(
      () => window.MathJax as MathJaxRuntime,
    );
  if (loading) return loading;
  const script = document.getElementById('mathjax-script');
  if (!script) return Promise.reject(new Error('The formula renderer is unavailable.'));
  loading = new Promise<MathJaxRuntime>((resolve, reject) => {
    const cleanup = () => {
      window.clearTimeout(timeout);
      script.removeEventListener('load', ready);
      script.removeEventListener('error', fail);
    };
    const fail = () => {
      cleanup();
      loading = undefined;
      reject(new Error('Unable to load the formula renderer.'));
    };
    const ready = () => {
      void Promise.resolve(window.MathJax?.startup?.promise).then(() => {
        if (!window.MathJax?.typesetPromise) return fail();
        cleanup();
        resolve(window.MathJax as MathJaxRuntime);
      }, fail);
    };
    const timeout = window.setTimeout(fail, 15000);
    script.addEventListener('load', ready);
    script.addEventListener('error', fail);
  });
  return loading;
};

// MathJax 3 requires asynchronous typesetting to run in sequence.
let typesetting = Promise.resolve();
export const typesetMath = (element: Element, isCurrent: () => boolean) => {
  const next = typesetting.then(async () => {
    if (!isCurrent()) return;
    const renderer = await loadMathJax();
    if (!isCurrent()) return;
    try {
      await renderer.typesetPromise([element]);
    } finally {
      if (!isCurrent()) renderer.typesetClear?.([element]);
    }
  });
  typesetting = next.catch(() => {});
  return next;
};

export const clearMath = (element: Element) => {
  const next = typesetting.then(() => {
    window.MathJax?.typesetClear?.([element]);
  });
  typesetting = next.catch(() => {});
  return next;
};
