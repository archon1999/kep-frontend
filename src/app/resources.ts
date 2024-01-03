export enum Resources {
  Problems = '/practice/problems',
  Problem = '/practice/problems/problem/:id',

  Attempts = '/practice/problems/attempts',

  Contests = '/competitions/contests',
  Contest = '/competitions/contests/contest/:id',
}

export function getResourceById(resource: Resources, id: number | string) {
  return resource.replace(':id', id.toString());
}
