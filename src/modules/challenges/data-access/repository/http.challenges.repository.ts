import { hydrateQuestion } from 'modules/testing/data-access/mappers/test.mapper.ts';
import {
  challengesApiClient,
  type ChallengeListParams,
} from '../api/challenges.client.ts';
import {
  extractList,
  mapChallenge,
  mapChallengeCall,
  mapChallengeRating,
  mapChallengeRatingChange,
  mapPageResult,
} from '../mappers/challenge.mapper.ts';
import { mapChallengeUserStatistics } from '../mappers/challenge-statistics.mapper.ts';
import {
  Challenge,
  ChallengeCall,
  ChallengeRatingChange,
  ChallengeRatingRow,
  ChallengeUserStatistics,
} from '../../domain';
import {
  ChessMovePayload,
  ChessMoveResponse,
  ChallengeAntiCheatPenaltyPayload,
  ChallengeAntiCheatPenaltyResponse,
  ChallengeAnswerPayload,
  ChallengeCheckResponse,
  ChallengeStartResponse,
  ChallengesRepository,
  PageResult,
} from '../../domain/ports/challenges.repository.ts';
import { Chapter } from 'modules/testing/domain/entities/chapter.entity.ts';
import { Question } from 'modules/testing/domain/entities/question.entity.ts';

export class HttpChallengesRepository implements ChallengesRepository {
  async getChallengeCalls(): Promise<ChallengeCall[]> {
    const result = await challengesApiClient.getChallengeCalls();
    return extractList(result).map(mapChallengeCall);
  }

  async createChallengeCall(payload: { timeSeconds: number; questionsCount: number; chapters?: number[] }): Promise<void> {
    await challengesApiClient.createChallengeCall(payload);
  }

  async deleteChallengeCall(id: number): Promise<void> {
    await challengesApiClient.deleteChallengeCall(id);
  }

  async acceptChallengeCall(id: number): Promise<ChallengeStartResponse> {
    const result = await challengesApiClient.acceptChallengeCall(id);
    return {
      success: Boolean(result?.success ?? result?.challengeId),
      challengeId: result?.challengeId ?? result?.challenge_id,
    };
  }

  async listChallenges(params?: ChallengeListParams): Promise<PageResult<Challenge>> {
    const response = await challengesApiClient.listChallenges(params);
    return mapPageResult<Challenge>(response, mapChallenge);
  }

  async getChallenge(challengeId: number | string): Promise<Challenge> {
    const result = await challengesApiClient.getChallenge(challengeId);
    return mapChallenge(result);
  }

  async startChallenge(challengeId: number): Promise<void> {
    await challengesApiClient.startChallenge(challengeId);
  }

  async submitAnswer(challengeId: number, payload: ChallengeAnswerPayload): Promise<ChallengeCheckResponse> {
    const response = await challengesApiClient.submitAnswer(challengeId, {
      answer: payload.answer,
      finish: payload.isFinish,
    });
    return {
      success: Boolean(response?.success ?? response?.ok ?? response?.isCorrect),
    };
  }

  async submitChessMove(challengeId: number, payload: ChessMovePayload): Promise<ChessMoveResponse> {
    const response = await challengesApiClient.submitChessMove(challengeId, payload);
    return {
      status: response?.status ?? 'failed',
      success: Boolean(response?.success),
      replyMove: response?.replyMove ?? response?.reply_move,
      nextQuestionNumber: response?.nextQuestionNumber ?? response?.next_question_number ?? 0,
      mistakesUsed: response?.mistakesUsed ?? response?.mistakes_used ?? 0,
      challengeFinished: Boolean(response?.challengeFinished ?? response?.challenge_finished),
    };
  }

  async applyAntiCheatPenalty(
    challengeId: number,
    payload: ChallengeAntiCheatPenaltyPayload,
  ): Promise<ChallengeAntiCheatPenaltyResponse> {
    const response = await challengesApiClient.applyAntiCheatPenalty(challengeId, payload);
    return {
      success: Boolean(response?.success),
      penalized: Boolean(response?.penalized),
      remainingTimeSeconds: response?.remainingTimeSeconds ?? response?.remaining_time_seconds ?? 0,
      nextQuestionNumber: response?.nextQuestionNumber ?? response?.next_question_number ?? 0,
    };
  }

  async listRating(params?: ChallengeListParams): Promise<PageResult<ChallengeRatingRow>> {
    const response = await challengesApiClient.listRating(params);
    return mapPageResult<ChallengeRatingRow>(response, mapChallengeRating);
  }

  async listRatingChanges(username: string): Promise<ChallengeRatingChange[]> {
    const response = await challengesApiClient.listRatingChanges(username);
    return extractList(response).map(mapChallengeRatingChange);
  }

  async getUserRating(username: string): Promise<ChallengeRatingRow | null> {
    const response = await challengesApiClient.getUserRating(username);
    if (!response) return null;
    return mapChallengeRating(response);
  }

  async getUserStatistics(username: string): Promise<ChallengeUserStatistics | null> {
    const response = await challengesApiClient.getUserStatistics(username);
    if (!response) return null;
    return mapChallengeUserStatistics(response);
  }

  async listUserChallenges(params: { username: string; page?: number; pageSize?: number }): Promise<PageResult<Challenge>> {
    const response = await challengesApiClient.listUserChallenges(params);
    return mapPageResult<Challenge>(response, mapChallenge);
  }

  async listChapters(): Promise<Chapter[]> {
    const response = await challengesApiClient.listChapters();
    return extractList<Chapter>(response);
  }

  hydrateQuestion(question: Question): Question {
    return hydrateQuestion(question);
  }
}
