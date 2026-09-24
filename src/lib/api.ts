import { NextResponse } from 'next/server';

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ data }, { status: 200, ...init });
}

export function created(data: unknown) {
  return NextResponse.json({ data }, { status: 201 });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Turns thrown guard errors into the right HTTP status. */
export function handle(e: unknown) {
  const err = e as Error & { status?: number };
  return fail(err.message || 'Server error', err.status || 500);
}

export function searchParams(req: Request) {
  return new URL(req.url).searchParams;
}
