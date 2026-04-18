import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
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
import QuestionHeader from 'modules/testing/ui/pages/test-pass/components/QuestionHeader.tsx';
import { TestPassQuestion } from 'modules/testing/ui/pages/test-pass/types.ts';
import { toast } from 'sonner';
import {
  ChessMovePayload,
  ChessMoveResponse,
} from '../../domain/ports/challenges.repository.ts';

type PromotionPiece = 'q' | 'r' | 'b' | 'n';

interface PendingPromotionMove {
  from: Square;
  to: Square;
  options: PromotionPiece[];
}

interface ChessPuzzleQuestionProps {
  question: Question;
  disabled?: boolean;
  isSubmitting?: boolean;
  onMove?: (payload: ChessMovePayload) => Promise<ChessMoveResponse | undefined>;
  onResolved?: (response: ChessMoveResponse) => Promise<void> | void;
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

const ChessPuzzleQuestion = forwardRef<ChessPuzzleQuestionHandle, ChessPuzzleQuestionProps>(
  ({ question, disabled, isSubmitting, onMove, onResolved }, ref) => {
    const { t } = useTranslation();
    const puzzle = useMemo<ChessPuzzlePayload | null>(() => {
      if (question.type !== QuestionType.ChessPuzzle || !question.payload) return null;
      return question.payload as ChessPuzzlePayload;
    }, [question.payload, question.type]);
    const [position, setPosition] = useState('');
    const [playedLine, setPlayedLine] = useState<string[]>([]);
    const [pendingPromotion, setPendingPromotion] = useState<PendingPromotionMove | null>(null);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
      if (!puzzle) {
        setPosition('');
        setPlayedLine([]);
        setPendingPromotion(null);
        return;
      }

      const chess = buildPuzzleGame(puzzle, []);
      setPosition(chess.fen());
      setPlayedLine([]);
      setPendingPromotion(null);
    }, [puzzle, question.id]);

    const canInteract = Boolean(puzzle) && !disabled && !isSubmitting && !isSending;
    const boardPosition = puzzle ? position || buildPuzzleGame(puzzle, []).fen() : '';

    const restorePosition = (line: string[]) => {
      if (!puzzle) return;
      const chess = buildPuzzleGame(puzzle, line);
      setPlayedLine(line);
      setPosition(chess.fen());
    };

    const handleResolved = async (response: ChessMoveResponse) => {
      if (response.replyMove) {
        await new Promise((resolve) => window.setTimeout(resolve, 250));
      }

      if (response.success) {
        toast.success(t('challenges.answerCorrect'));
      } else if (response.status !== 'in_progress') {
        toast.error(t('challenges.answerWrong'));
      }

      await onResolved?.(response);
    };

    const submitMove = async (line: string[]) => {
      if (!onMove) return;

      setIsSending(true);
      try {
        const response = await onMove({
          questionNumber: question.number,
          playedLine: line,
        });

        if (!response) return;

        if (response.replyMove && puzzle) {
          const nextLine = [...line, response.replyMove];
          restorePosition(nextLine);
          if (response.status === 'in_progress') {
            return;
          }
        }

        if (response.status !== 'in_progress') {
          await handleResolved(response);
        }
      } catch {
        restorePosition(playedLine);
      } finally {
        setIsSending(false);
      }
    };

    const commitMove = async (from: Square, to: Square, promotion?: PromotionPiece) => {
      if (!puzzle) return;

      const chess = buildPuzzleGame(puzzle, playedLine);
      const move = chess.move({ from, to, promotion });
      if (!move) return;

      const nextLine = [...playedLine, buildUciMove(move)];
      setPlayedLine(nextLine);
      setPosition(chess.fen());
      await submitMove(nextLine);
    };

    const handlePieceDrop = (sourceSquare: Square, targetSquare: Square) => {
      if (!puzzle || !canInteract) return false;

      const chess = buildPuzzleGame(puzzle, playedLine);
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

    const handleForceFail = async () => {
      if (!canInteract || !onMove) return;

      setIsSending(true);
      try {
        const response = await onMove({
          questionNumber: question.number,
          playedLine,
          forceFail: true,
        });

        if (!response) return;
        await handleResolved(response);
      } catch {
        restorePosition(playedLine);
      } finally {
        setIsSending(false);
      }
    };

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
        <QuestionHeader question={question as TestPassQuestion} />

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

          <Typography variant="body2" color="text.secondary">
            {isSending ? t('common.loading') : t('challenges.chessPuzzle.findBestMove')}
          </Typography>
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

export default ChessPuzzleQuestion;
