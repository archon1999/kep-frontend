import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Chessboard } from 'react-chessboard';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { Chess, Move, Square } from 'chess.js';
import { ChessPuzzlePayload, Question, QuestionType } from 'modules/testing/domain';
import { ChessChallengeResult } from 'modules/challenges/domain/ports/challenges.repository.ts';
import {
  clearChessPuzzleProgress,
  getChessPuzzleProgressKey,
  readChessPuzzleProgress,
  writeChessPuzzleProgress,
} from '../lib/chessPuzzleProgress.ts';
import { decodeChessSolutionBlob } from '../lib/chessPuzzleSolution.ts';

type PromotionPiece = 'q' | 'r' | 'b' | 'n';

interface PendingPromotionMove {
  from: Square;
  to: Square;
  options: PromotionPiece[];
}

interface ChessPuzzleQuestionProps {
  challengeId?: number;
  questionNumber?: number;
  question: Question;
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (payload: {
    answer: unknown;
    isFinish?: boolean;
    forceFail?: boolean;
  }) => Promise<void> | void;
}

export interface ChessPuzzleQuestionHandle {
  forceFail: () => void;
}

const buildUciMove = (move: Move) => `${move.from}${move.to}${move.promotion ?? ''}`;

const applyUciMove = (chess: Chess, move: string) =>
  chess.move({
    from: move.slice(0, 2),
    to: move.slice(2, 4),
    promotion: move.slice(4, 5) || undefined,
  });

const buildPuzzleGame = (payload: ChessPuzzlePayload, playedLine: string[]) => {
  const chess = new Chess(payload.fen);
  if (payload.initialMove) {
    applyUciMove(chess, payload.initialMove);
  }
  playedLine.forEach((move) => applyUciMove(chess, move));
  return chess;
};

const getMatchingSolutionLines = (solutionLines: string[][], playedLine: string[]) =>
  solutionLines.filter((solutionLine) =>
    solutionLine.slice(0, playedLine.length).join('|') === playedLine.join('|'));

const hasFullSolutionMatch = (solutionLines: string[][], playedLine: string[]) =>
  solutionLines.some((solutionLine) => solutionLine.join('|') === playedLine.join('|'));

const getUniqueNextSolutionMove = (solutionLines: string[][], playedLine: string[]) => {
  const candidateMoves = Array.from(
    new Set(
      solutionLines
        .filter((solutionLine) => solutionLine.length > playedLine.length)
        .map((solutionLine) => solutionLine[playedLine.length]),
    ),
  );

  return candidateMoves.length === 1 ? candidateMoves[0] : null;
};

const ChallengeChessPuzzleQuestion = forwardRef<
  ChessPuzzleQuestionHandle,
  ChessPuzzleQuestionProps
>(
  ({ challengeId, questionNumber, question, disabled, isSubmitting, onSubmit }, ref) => {
    const { t } = useTranslation();
    const puzzle = useMemo<ChessPuzzlePayload | null>(() => {
      if (question.type !== QuestionType.ChessPuzzle || !question.payload) return null;
      return question.payload as ChessPuzzlePayload;
    }, [question.payload, question.type]);
    const solutionLines = useMemo(() => {
      if (!puzzle?.solutionBlob || !puzzle.puzzleId) return [];

      return decodeChessSolutionBlob({
        questionId: question.id,
        puzzleId: puzzle.puzzleId,
        solutionBlob: puzzle.solutionBlob,
        solutionCipher: puzzle.solutionCipher,
      });
    }, [puzzle?.puzzleId, puzzle?.solutionBlob, puzzle?.solutionCipher, question.id]);
    const storageKey = useMemo(() => {
      if (!challengeId || !questionNumber) return null;
      return getChessPuzzleProgressKey(challengeId, questionNumber);
    }, [challengeId, questionNumber]);

    const [position, setPosition] = useState('');
    const [playedLine, setPlayedLine] = useState<string[]>([]);
    const [pendingResult, setPendingResult] = useState<ChessChallengeResult | null>(null);
    const [pendingForceFail, setPendingForceFail] = useState(false);
    const [pendingPromotion, setPendingPromotion] = useState<PendingPromotionMove | null>(null);
    const [isSending, setIsSending] = useState(false);

    const playedLineRef = useRef<string[]>([]);
    const retryAttemptedRef = useRef(false);

    const syncBoard = useCallback(
      (line: string[]) => {
        if (!puzzle) return;
        const chess = buildPuzzleGame(puzzle, line);
        playedLineRef.current = line;
        setPlayedLine(line);
        setPosition(chess.fen());
      },
      [puzzle],
    );

    const persistProgress = useCallback(
      (options: {
        line: string[];
        result?: ChessChallengeResult | null;
        finalLine?: string[];
        forceFail?: boolean;
      }) => {
        if (!storageKey) return;

        writeChessPuzzleProgress(storageKey, {
          playedLine: options.line,
          pendingResult: options.result ?? null,
          finalPlayedLine: options.finalLine,
          forceFail: options.forceFail,
        });
      },
      [storageKey],
    );

    const clearProgress = useCallback(() => {
      if (!storageKey) return;
      clearChessPuzzleProgress(storageKey);
    }, [storageKey]);

    const submitResolvedAnswer = useCallback(
      async (result: ChessChallengeResult, line: string[], forceFail = false) => {
        if (!onSubmit) return;

        setIsSending(true);
        try {
          await onSubmit({
            answer: {
              playedLine: line,
              result,
            },
            forceFail,
          });

          clearProgress();
          setPendingResult(null);
          setPendingForceFail(false);
        } finally {
          setIsSending(false);
        }
      },
      [clearProgress, onSubmit],
    );

    const finalizeResult = useCallback(
      async (result: ChessChallengeResult, line: string[], options?: { forceFail?: boolean }) => {
        const shouldForceFail = Boolean(options?.forceFail);

        syncBoard(line);
        setPendingPromotion(null);
        setPendingResult(result);
        setPendingForceFail(shouldForceFail);
        persistProgress({
          line,
          result,
          finalLine: line,
          forceFail: shouldForceFail,
        });

        try {
          await submitResolvedAnswer(result, line, shouldForceFail);
        } catch {
          // Keep local state for retry after connectivity recovers.
        }
      },
      [persistProgress, submitResolvedAnswer, syncBoard],
    );

    useEffect(() => {
      retryAttemptedRef.current = false;

      if (!puzzle) {
        setPosition('');
        setPlayedLine([]);
        setPendingResult(null);
        setPendingForceFail(false);
        setPendingPromotion(null);
        return;
      }

      const storedProgress = storageKey ? readChessPuzzleProgress(storageKey) : null;
      const restoredLine = storedProgress?.pendingResult
        ? (storedProgress.finalPlayedLine ?? storedProgress.playedLine)
        : (storedProgress?.playedLine ?? []);

      syncBoard(restoredLine);
      setPendingResult(storedProgress?.pendingResult ?? null);
      setPendingForceFail(Boolean(storedProgress?.forceFail));
      setPendingPromotion(null);
    }, [puzzle, question.id, storageKey, syncBoard]);

    useEffect(() => {
      if (!pendingResult || !onSubmit || isSending || isSubmitting) return;

      const retrySubmission = () => {
        if (isSending || isSubmitting) return;

        void submitResolvedAnswer(pendingResult, playedLineRef.current, pendingForceFail).catch(
          () => undefined,
        );
      };

      if (!retryAttemptedRef.current) {
        retryAttemptedRef.current = true;
        retrySubmission();
      }

      window.addEventListener('online', retrySubmission);
      return () => {
        window.removeEventListener('online', retrySubmission);
      };
    }, [isSending, isSubmitting, onSubmit, pendingForceFail, pendingResult, submitResolvedAnswer]);

    const canInteract =
      Boolean(puzzle) &&
      solutionLines.length > 0 &&
      !disabled &&
      !isSubmitting &&
      !isSending &&
      !pendingResult;
    const boardPosition = puzzle ? position || buildPuzzleGame(puzzle, playedLine).fen() : '';

    const handleMoveResolution = async (move: string) => {
      if (!puzzle) return;

      const nextLine = [...playedLineRef.current, move];
      syncBoard(nextLine);
      persistProgress({ line: nextLine });

      const matchingLines = getMatchingSolutionLines(solutionLines, nextLine);
      if (!matchingLines.length) {
        await finalizeResult('failed', nextLine);
        return;
      }

      if (hasFullSolutionMatch(matchingLines, nextLine)) {
        await finalizeResult('solved', nextLine);
        return;
      }

      const replyMove = getUniqueNextSolutionMove(matchingLines, nextLine);
      if (!replyMove) {
        return;
      }

      const continuedLine = [...nextLine, replyMove];
      syncBoard(continuedLine);
      persistProgress({ line: continuedLine });

      if (hasFullSolutionMatch(matchingLines, continuedLine)) {
        await finalizeResult('solved', continuedLine);
      }
    };

    const commitMove = async (from: Square, to: Square, promotion?: PromotionPiece) => {
      if (!puzzle) return;

      const chess = buildPuzzleGame(puzzle, playedLineRef.current);
      const move = chess.move({ from, to, promotion });
      if (!move) return;

      await handleMoveResolution(buildUciMove(move));
    };

    const handlePieceDrop = (sourceSquare: Square, targetSquare: Square) => {
      if (!puzzle || !canInteract) return false;

      const chess = buildPuzzleGame(puzzle, playedLineRef.current);
      const legalMoves = chess
        .moves({ square: sourceSquare, verbose: true })
        .filter((move) => move.to === targetSquare);

      if (!legalMoves.length) return false;

      const promotionOptions = Array.from(
        new Set(
          legalMoves
            .map((move) => move.promotion)
            .filter((promotion): promotion is PromotionPiece => Boolean(promotion)),
        ),
      );

      if (promotionOptions.length > 1) {
        setPendingPromotion({
          from: sourceSquare,
          to: targetSquare,
          options: promotionOptions,
        });
        return false;
      }

      void commitMove(sourceSquare, targetSquare, promotionOptions[0]);
      return true;
    };

    const handleForceFail = useCallback(async () => {
      if (!puzzle || pendingResult) return;
      await finalizeResult('failed', playedLineRef.current, { forceFail: true });
    }, [finalizeResult, pendingResult, puzzle]);

    useImperativeHandle(ref, () => ({
      forceFail: () => {
        void handleForceFail();
      },
    }));

    if (!puzzle) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('challenges.notFound')}
        </Typography>
      );
    }

    return (
      <Stack spacing={2}>
        <Stack spacing={1} alignItems="center">
          <Chessboard
            options={{
              position: boardPosition,
              boardOrientation: puzzle.orientation,
              animationDurationInMs: 220,
              allowDragging: canInteract,
              boardStyle: {
                width: '100%',
                maxWidth: 520,
                marginInline: 'auto',
              },
              onPieceDrop: ({ sourceSquare, targetSquare }) =>
                targetSquare
                  ? handlePieceDrop(sourceSquare as Square, targetSquare as Square)
                  : false,
            }}
          />

          <Typography
            dangerouslySetInnerHTML={{ __html: question.body }}
            variant="body2"
            color="text.secondary"
          />
        </Stack>

        <Dialog
          open={Boolean(pendingPromotion)}
          onClose={() => setPendingPromotion(null)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>{t('challenges.chessPuzzle.promotionTitle')}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.chessPuzzle.promotionSubtitle')}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
            {pendingPromotion?.options.map((piece) => (
              <Button
                key={piece}
                variant="outlined"
                onClick={() => {
                  const move = pendingPromotion;
                  setPendingPromotion(null);
                  if (!move) return;
                  void commitMove(move.from, move.to, piece);
                }}
              >
                {t(`challenges.chessPuzzle.pieces.${piece}`)}
              </Button>
            ))}
          </DialogActions>
        </Dialog>
      </Stack>
    );
  },
);

export default ChallengeChessPuzzleQuestion;
