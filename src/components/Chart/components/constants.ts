export enum ActivityPeriod {
  day = 'daily',
  week = 'weekly',
}

export const radioBtnPeriod = [
  {
    period: 'day',
    type: 'radio',
    name: 'period',
    value: ActivityPeriod.day,
  },
  {
    period: 'week',
    type: 'radio',
    name: 'period',
    value: ActivityPeriod.week,
  },
];
