const TZ = "America/Sao_Paulo";
const LOCALE = "pt-BR";

const fmtTimeShort = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TZ,
});

const fmtDateLabel = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: TZ,
});

const fmtDateTime = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TZ,
});

export function timeShort(iso: string): string {
  return fmtTimeShort.format(new Date(iso));
}

export function dateLabel(iso: string): string {
  return fmtDateLabel.format(new Date(iso));
}

export function dateTimeLabel(iso: string): string {
  return fmtDateTime.format(new Date(iso));
}

export function relative(iso: string, nowMs: number | null): string {
  if (nowMs == null) return timeShort(iso);
  const then = new Date(iso).getTime();
  const diff = Math.max(0, nowMs - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "agora";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} d`;
  return dateLabel(iso);
}

export function isSameDayInTZ(a: string, b: string): boolean {
  return dateLabel(a) === dateLabel(b);
}

export function dayHeader(iso: string, nowMs: number | null): string {
  if (nowMs == null) return dateLabel(iso);
  const today = dateLabel(new Date(nowMs).toISOString());
  const yesterday = dateLabel(new Date(nowMs - 86400000).toISOString());
  const day = dateLabel(iso);
  if (day === today) return "Hoje";
  if (day === yesterday) return "Ontem";
  return day;
}
