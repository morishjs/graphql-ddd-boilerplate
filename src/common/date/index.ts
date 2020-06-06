import { addBusinessDays, eachDayOfInterval, isWednesday, isWeekend } from 'date-fns';
import { formatISOWithOptions } from 'date-fns/fp';

export const getNearestBusinessDate = (d: Date): Date => {
  if (!isWeekend(d)) {
    return d;
  }

  return getNearestBusinessDate(addBusinessDays(d, 1));
};

export const getBusinessDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  return eachDayOfInterval({ start: getNearestBusinessDate(startDate), end: getNearestBusinessDate(endDate) }).filter(
    d => !isWeekend(d),
  );
};

export const dateToString = formatISOWithOptions({ representation: 'date' });

export function isWeekdayExcludingWednesday(d: Date): boolean {
  return !isWednesday(d) && !isWeekend(d);
}

export function getBusinessDateExcludingWednesday(d: Date): Date {
  if (isWeekdayExcludingWednesday(d)) {
    return d;
  }

  return getBusinessDateExcludingWednesday(addBusinessDays(d, 1));
}

interface IDateCounterMap {
  [dateStr: string]: number;
}

export function getDateCounterMap(param: { from: Date; to: Date; desiredDates: string[] }): IDateCounterMap {
  const { from, to, desiredDates } = param;

  const datesMap: { [dateString: string]: number } = getBusinessDatesBetween(from, to)
    .map(d => dateToString(d))
    .reduce((prev, key) => {
      prev[key] = 0;
      return prev;
    }, {});

  desiredDates.forEach(desiredDate => {
    if (datesMap[desiredDate] >= 0) {
      datesMap[desiredDate] += 1;
    }
  });

  return datesMap;
}
