import { isSameMonth, parseISO } from 'date-fns';

type HasCreatedAt = {
  createdAt: string;
};

export function calculateMonthlyGrowth(data: HasCreatedAt[] = []) {
  const now = new Date();

  const currentMonthItems = data.filter((item) => {
    const date = parseISO(item.createdAt);
    return isSameMonth(date, now);
  });

  const totalNow = data.length;
  const newThisMonth = currentMonthItems.length;
  const totalLastMonth = totalNow - newThisMonth;

  if (totalLastMonth === 0) {
    return totalNow > 0 ? 100 : 0;
  }

  const growth = ((totalNow - totalLastMonth) / totalLastMonth) * 100;

  return Math.round(growth);
}
