import { isSameMonth, parseISO, subMonths } from 'date-fns';

type HasCreatedAt = {
  createdAt: string;
};

type HasAmountAndCreatedAt = {
  amount: number | string;
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

export function calculateMonthlyAmountGrowth(data: HasAmountAndCreatedAt[] = []) {
  const now = new Date();

  const currentMonthItems = data.filter((item) => {
    const date = parseISO(item.createdAt);
    return isSameMonth(date, now);
  });

  const lastMonthItems = data.filter((item) => {
    const date = parseISO(item.createdAt);
    return isSameMonth(date, subMonths(now, 1));
  });

  const currentTotal = currentMonthItems.reduce(
    (acc, item) => acc + Number(item.amount),
    0,
  );
  const lastTotal = lastMonthItems.reduce(
    (acc, item) => acc + Number(item.amount),
    0,
  );

  if (lastTotal === 0) {
    return currentTotal > 0 ? 100 : 0;
  }

  const growth = ((currentTotal - lastTotal) / lastTotal) * 100;

  return Math.round(growth);
}
