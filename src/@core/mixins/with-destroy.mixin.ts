import { OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export const WithDestroyMixin = <T extends Constructor>(Base: T) => {
  return class extends Base implements OnDestroy {
    private destroy$ = new Subject<void>();

    takeUntilDestroy<T>() {
      return takeUntil<T>(this.destroy$);
    }

    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
  };
};

type Constructor<T = {}> = new (...args: any[]) => T;

