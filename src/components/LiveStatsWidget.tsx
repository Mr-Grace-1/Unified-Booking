import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface LiveStat {
  label: string;
  value: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  color: string;
}

export default function LiveStatsWidget() {
  const { bookings } = useApp();
  const [stats, setStats] = useState<LiveStat[]>([]);

  useEffect(() => {
    // Calculate live stats
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Today's bookings
    const todayBookings = bookings.filter(b => {
      const bookingDate = new Date(b.startTime);
      return bookingDate >= today && bookingDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });

    // Yesterday's bookings
    const yesterdayBookings = bookings.filter(b => {
      const bookingDate = new Date(b.startTime);
      return bookingDate >= yesterday && bookingDate < today;
    });

    // This week's bookings
    const thisWeekBookings = bookings.filter(b => {
      const bookingDate = new Date(b.startTime);
      return bookingDate >= lastWeek;
    });

    // Last week's bookings
    const lastWeekBookings = bookings.filter(b => {
      const bookingDate = new Date(b.startTime);
      const twoWeeksAgo = new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
      return bookingDate >= twoWeeksAgo && bookingDate < lastWeek;
    });

    // Revenue calculations
    const todayRevenue = todayBookings.reduce((sum, b) => sum + b.amount, 0);
    const yesterdayRevenue = yesterdayBookings.reduce((sum, b) => sum + b.amount, 0);
    const thisWeekRevenue = thisWeekBookings.reduce((sum, b) => sum + b.amount, 0);
    const lastWeekRevenue = lastWeekBookings.reduce((sum, b) => sum + b.amount, 0);

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return { trend: 'stable' as const, percent: 0 };
      const percent = ((current - previous) / previous) * 100;
      return {
        trend: percent > 0 ? 'up' as const : percent < 0 ? 'down' as const : 'stable' as const,
        percent: Math.abs(percent),
      };
    };

    const todayTrend = calculateTrend(todayBookings.length, yesterdayBookings.length);
    const revenueTrend = calculateTrend(todayRevenue, yesterdayRevenue);
    const weeklyTrend = calculateTrend(thisWeekBookings.length, lastWeekBookings.length);
    const weeklyRevenueTrend = calculateTrend(thisWeekRevenue, lastWeekRevenue);

    setStats([
      {
        label: "Today's Bookings",
        value: todayBookings.length,
        previousValue: yesterdayBookings.length,
        trend: todayTrend.trend,
        trendPercent: todayTrend.percent,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        label: "Today's Revenue",
        value: todayRevenue,
        previousValue: yesterdayRevenue,
        trend: revenueTrend.trend,
        trendPercent: revenueTrend.percent,
        color: 'from-emerald-500 to-green-500',
      },
      {
        label: 'This Week',
        value: thisWeekBookings.length,
        previousValue: lastWeekBookings.length,
        trend: weeklyTrend.trend,
        trendPercent: weeklyTrend.percent,
        color: 'from-purple-500 to-pink-500',
      },
      {
        label: 'Weekly Revenue',
        value: thisWeekRevenue,
        previousValue: lastWeekRevenue,
        trend: weeklyRevenueTrend.trend,
        trendPercent: weeklyRevenueTrend.percent,
        color: 'from-amber-500 to-orange-500',
      },
    ]);
  }, [bookings]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-emerald-400" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-400" />;
      default:
        return <Minus size={16} className="text-slate-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatValue = (value: number, label: string) => {
    if (label.includes('Revenue')) {
      return `$${value.toLocaleString()}`;
    }
    return value.toString();
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{stat.label}</span>
            <div className={`flex items-center gap-1 ${getTrendColor(stat.trend)}`}>
              {getTrendIcon(stat.trend)}
              <span className="text-xs font-medium">{stat.trendPercent.toFixed(1)}%</span>
            </div>
          </div>
          <motion.div
            key={stat.value}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
          >
            {formatValue(stat.value, stat.label)}
          </motion.div>
          <div className="text-xs text-slate-500 mt-1">
            vs {formatValue(stat.previousValue, stat.label)} previous
          </div>
        </motion.div>
      ))}
    </div>
  );
}
