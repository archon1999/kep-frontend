import { Observable } from "rxjs";
import { PageResult } from "@core/common/classes/page-result";

export interface BaseRepository<DTO, T> {
  list?(params?: Record<string, any>): Observable<T[] | PageResult<T>>;
  byId?(id: string | number): Observable<T>;
  create?(payload: Partial<DTO>): Observable<T>;
  update?(id: string | number, payload: Partial<DTO>): Observable<T>;
  delete?(id: string | number): Observable<void>;
}
