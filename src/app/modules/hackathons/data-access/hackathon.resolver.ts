import { ResolveFn } from '@angular/router';
import { inject } from "@angular/core";
import { HackathonsApiService } from "@hackathons/data-access/hackathons-api.service";

export const hackathonResolver: ResolveFn<boolean> = (route, state) => {
  const service = inject(HackathonsApiService);
  return service.getHackathon(route.params.id);
};
