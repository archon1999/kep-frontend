import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-expect-error jsdom is a test-only runtime dependency without bundled types.
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule } from '../../../../shared/testing/loadModule.ts';

const deferred = () => {
  let resolve!: (value?: any) => void;
  const promise = new Promise<any>((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

test('challenge submission and recovery use the same question-scoped lock', async (t) => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://kep.test/challenges/1',
  });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    sessionStorage: dom.window.sessionStorage,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const mount = () => {
    const request = deferred();
    const sync = deferred();
    const calls: any[] = [];
    const messages: string[] = [];
    let syncCalls = 0;
    let sessionExpired = false;
    let routeId = '1';
    const data: any = {
      id: 1,
      status: 0,
      questionsCount: 3,
      timeSeconds: 10,
      remainingTimeSeconds: 10,
      questionTimeType: 2,
      playerFirst: { username: 'user_s' },
      playerSecond: { username: 'peer' },
      nextQuestion: { number: 1, question: { id: 1, type: 1 } },
      serverTime: new Date().toISOString(),
      questionDeadline: new Date(Date.now() + 10000).toISOString(),
    };
    const navigate = () => {};
    const blocker = { state: 'unblocked' };
    const mutate = () => {
      syncCalls++;
      return sync.promise;
    };
    const searchParams = new URLSearchParams();
    const { useChallengeDetailPage } = loadModule(
      new URL('./useChallengeDetailPage.ts', import.meta.url),
      {
        'react-router': {
          useParams: () => ({ id: routeId }),
          useSearchParams: () => [searchParams],
          useNavigate: () => navigate,
          useBlocker: () => blocker,
        },
        'react-i18next': { useTranslation: () => ({ t: (key: string) => key }) },
        'app/providers/AuthProvider': {
          useAuth: () => ({ currentUser: { username: 'user_s' }, sessionExpired }),
        },
        'app/providers/DocumentTitleProvider': { useDocumentTitle: () => {} },
        'app/routes/resources': { resources: { Challenges: '/challenges' } },
        'shared/lib/authRedirect': { useLoginRedirect: () => navigate },
        'modules/challenges/application/queries.ts': {
          useChallengeDetail: () => ({ data, mutate }),
        },
        'modules/challenges/application/mutations.ts': {
          useSubmitChallengeAnswer: () => ({
            trigger: (payload: any) => {
              calls.push(payload);
              return request.promise;
            },
          }),
          useStartChallenge: () => ({}),
          useApplyChallengeAntiCheatPenalty: () => ({}),
        },
        sonner: {
          toast: {
            success: (key: string) => messages.push(key),
            error: (key: string) => messages.push(key),
          },
        },
      },
    );
    const root = createRoot(document.createElement('div'));
    let hook: any;
    const renders: { number: number; running: boolean; seconds: number }[] = [];
    const View = () => {
      hook = useChallengeDetailPage();
      renders.push({
        number: data.nextQuestion.number,
        running: hook.timerRunning,
        seconds: hook.secondsLeft,
      });
      return null;
    };
    const render = () => act(() => root.render(createElement(View)));
    render();
    return {
      request,
      sync,
      calls,
      messages,
      data,
      renders,
      render,
      hook: () => hook,
      syncCalls: () => syncCalls,
      expireSession: () => {
        sessionExpired = true;
        render();
      },
      navigate: () => {
        routeId = '2';
        render();
      },
      unmount: () => act(() => root.unmount()),
    };
  };
  try {
    await t.test('manual answer and zero timer issue one request and one verdict', async () => {
      const view = mount();
      act(() => {
        void view.hook().handleSubmit({ answer: [11] });
        void view.hook().handleTimeExpired();
      });
      assert.equal(view.calls.length, 1);
      assert.equal(view.calls[0].payload.questionNumber, 1);
      await act(async () => view.request.resolve({ accepted: true, success: true }));
      assert.equal(view.syncCalls(), 1);
      assert.equal(view.hook().submitting, true);
      act(() => {
        void view.hook().handleTimeExpired();
      });
      assert.equal(view.calls.length, 1);
      await act(async () => view.sync.resolve());
      assert.deepEqual(view.messages, ['challenges.answerCorrect']);
      act(() => {
        void view.hook().handleSubmit({ answer: [11] });
      });
      assert.equal(view.calls.length, 1);
      view.unmount();
    });
    await t.test('a stale response syncs without displaying Wrong', async () => {
      const view = mount();
      view.sync.resolve();
      act(() => {
        void view.hook().handleSubmit({ answer: [11] });
      });
      await act(async () =>
        view.request.resolve({ accepted: false, success: false, code: 'stale_question' }),
      );
      assert.deepEqual(view.messages, []);
      assert.equal(view.syncCalls(), 1);
      view.unmount();
    });
    await t.test('navigation drops the previous question response', async () => {
      const view = mount();
      act(() => {
        void view.hook().handleSubmit({ answer: [11] });
      });
      view.navigate();
      await act(async () => view.request.resolve({ accepted: true, success: true }));
      assert.deepEqual(view.messages, []);
      assert.equal(view.syncCalls(), 0);
      view.unmount();
    });
    await t.test('an expired session disables automatic answers and exit penalties', async () => {
      const view = mount();
      view.expireSession();
      act(() => {
        void view.hook().handleTimeExpired();
        view.hook().handlePageExit();
      });
      assert.equal(view.calls.length, 0);
      assert.equal(view.hook().blurProtectionActive, false);
      assert.equal(view.hook().timerRunning, false);
      view.unmount();
    });
    await t.test('polling never restarts the current question clock', async (context) => {
      context.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 1000000 });
      const view = mount();
      assert.equal(view.hook().secondsLeft, 10);
      act(() => context.mock.timers.tick(2000));
      assert.equal(view.hook().secondsLeft, 8);
      // A stale poll says ten seconds again; the displayed clock cannot increase.
      view.data.serverTime = new Date().toISOString();
      view.render();
      assert.equal(view.hook().secondsLeft, 8);
      view.unmount();
      context.mock.timers.reset();
    });
    await t.test(
      'the previous zero timer is never active for a newly displayed question',
      async (context) => {
        context.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 1000000 });
        const view = mount();
        act(() => context.mock.timers.tick(11000));
        assert.equal(view.hook().secondsLeft, 0);
        view.data.nextQuestion = { number: 2, question: { id: 2, type: 1 } };
        view.data.serverTime = new Date().toISOString();
        view.data.questionDeadline = new Date(Date.now() + 10000).toISOString();
        view.render();
        assert.equal(
          view.renders.some(
            (render) => render.number === 2 && render.running && render.seconds === 0,
          ),
          false,
        );
        assert.equal(view.hook().secondsLeft, 10);
        view.unmount();
        context.mock.timers.reset();
      },
    );
  } finally {
    dom.window.close();
  }
});
