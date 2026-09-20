import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Gift, Star, TrendingUp, Users } from 'lucide-react';
import { useApp, customers } from '../store/AppContext';
import { useToast } from './Toast';

export interface LoyaltyProgram {
  id: string;
  name: string;
  pointsPerDollar: number;
  redemptionRate: number; // points needed for $1 reward
  tiers: LoyaltyTier[];
  isActive: boolean;
}

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}

export interface CustomerLoyalty {
  customerId: string;
  points: number;
  tier: string;
  totalEarned: number;
  totalRedeemed: number;
  lastActivity: string;
}

export default function LoyaltyProgram() {
  const { bookings } = useApp();
  const { addToast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Mock loyalty program
  const program: LoyaltyProgram = {
    id: 'program-1',
    name: 'Rewards Club',
    pointsPerDollar: 1,
    redemptionRate: 100, // 100 points = $1
    tiers: [
      {
        name: 'Bronze',
        minPoints: 0,
        benefits: ['1 point per $1', 'Birthday reward'],
        color: 'from-amber-600 to-amber-800',
      },
      {
        name: 'Silver',
        minPoints: 500,
        benefits: ['1.5 points per $1', 'Priority booking', 'Birthday reward'],
        color: 'from-slate-400 to-slate-600',
      },
      {
        name: 'Gold',
        minPoints: 1500,
        benefits: ['2 points per $1', 'Priority booking', 'Free upgrade', 'Birthday reward'],
        color: 'from-yellow-500 to-yellow-700',
      },
      {
        name: 'Platinum',
        minPoints: 5000,
        benefits: ['3 points per $1', 'Priority booking', 'Free upgrades', 'Exclusive offers', 'Birthday reward'],
        color: 'from-purple-500 to-purple-700',
      },
    ],
    isActive: true,
  };

  // Calculate customer loyalty data
  const customerLoyalty: CustomerLoyalty[] = customers.map(customer => {
    const customerBookings = bookings.filter(b => b.customerId === customer.id);
    const totalSpent = customerBookings.reduce((sum, b) => sum + b.amount, 0);
    const points = Math.floor(totalSpent * program.pointsPerDollar);
    
    // Determine tier
    let tier = program.tiers[0].name;
    for (const t of program.tiers) {
      if (points >= t.minPoints) {
        tier = t.name;
      }
    }

    return {
      customerId: customer.id,
      points,
      tier,
      totalEarned: points,
      totalRedeemed: 0,
      lastActivity: customerBookings.length > 0 
        ? customerBookings[customerBookings.length - 1].createdAt 
        : customer.createdAt,
    };
  });

  const selectedLoyalty = selectedCustomer 
    ? customerLoyalty.find(l => l.customerId === selectedCustomer)
    : null;

  const selectedCustomerData = selectedCustomer
    ? customers.find(c => c.id === selectedCustomer)
    : null;

  const currentTier = program.tiers.find(t => t.name === selectedLoyalty?.tier);
  const nextTier = program.tiers[program.tiers.findIndex(t => t.name === selectedLoyalty?.tier) + 1];

  const totalPoints = customerLoyalty.reduce((sum, l) => sum + l.points, 0);
  const avgPointsPerCustomer = customerLoyalty.length > 0 ? totalPoints / customerLoyalty.length : 0;

  const getTierColor = (tierName: string) => {
    const tier = program.tiers.find(t => t.name === tierName);
    return tier?.color || 'from-slate-500 to-slate-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Loyalty Program</h2>
        <p className="text-slate-400 text-sm">Manage customer rewards and loyalty points</p>
      </div>

      {/* Program Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <Award size={24} className="text-indigo-400 mb-2" />
          <div className="text-2xl font-bold text-white">{program.name}</div>
          <div className="text-xs text-slate-400">Active Program</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
          <Users size={24} className="text-emerald-400 mb-2" />
          <div className="text-2xl font-bold text-white">{customerLoyalty.length}</div>
          <div className="text-xs text-slate-400">Members</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Star size={24} className="text-amber-400 mb-2" />
          <div className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Total Points</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <TrendingUp size={24} className="text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white">{Math.round(avgPointsPerCustomer)}</div>
          <div className="text-xs text-slate-400">Avg Points/Customer</div>
        </div>
      </div>

      {/* Tier Structure */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Award size={20} className="text-indigo-400" />
          Tier Structure
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {program.tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl bg-gradient-to-br ${tier.color} text-white`}
            >
              <div className="text-lg font-bold mb-2">{tier.name}</div>
              <div className="text-xs opacity-90 mb-3">{tier.minPoints}+ points</div>
              <ul className="space-y-1">
                {tier.benefits.map((benefit, i) => (
                  <li key={i} className="text-xs opacity-90 flex items-start gap-1">
                    <Gift size={12} className="flex-shrink-0 mt-0.5" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Customer Selection */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="font-bold text-white mb-4">Customer Loyalty Details</h3>
        <select
          value={selectedCustomer || ''}
          onChange={(e) => setSelectedCustomer(e.target.value || null)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white mb-4"
        >
          <option value="">Select a customer</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {selectedLoyalty && selectedCustomerData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Customer Info */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50">
              <div className="text-4xl">{selectedCustomerData.avatar}</div>
              <div className="flex-1">
                <div className="text-lg font-bold text-white">{selectedCustomerData.name}</div>
                <div className="text-sm text-slate-400">{selectedCustomerData.email}</div>
              </div>
              <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getTierColor(selectedLoyalty.tier)} text-white font-bold`}>
                {selectedLoyalty.tier}
              </div>
            </div>

            {/* Points Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                <div className="text-3xl font-bold text-amber-400">{selectedLoyalty.points}</div>
                <div className="text-xs text-slate-400">Current Points</div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="text-3xl font-bold text-emerald-400">{selectedLoyalty.totalEarned}</div>
                <div className="text-xs text-slate-400">Total Earned</div>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                <div className="text-3xl font-bold text-blue-400">${(selectedLoyalty.points / program.redemptionRate).toFixed(2)}</div>
                <div className="text-xs text-slate-400">Reward Value</div>
              </div>
            </div>

            {/* Progress to Next Tier */}
            {nextTier && (
              <div className="p-4 rounded-lg bg-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Progress to {nextTier.name}</span>
                  <span className="text-sm text-white font-medium">
                    {selectedLoyalty.points} / {nextTier.minPoints}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(selectedLoyalty.points / nextTier.minPoints) * 100}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full bg-gradient-to-r ${getTierColor(nextTier.name)}`}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {nextTier.minPoints - selectedLoyalty.points} points to {nextTier.name}
                </div>
              </div>
            )}

            {/* Benefits */}
            {currentTier && (
              <div className="p-4 rounded-lg bg-slate-800/50">
                <h4 className="text-sm font-semibold text-white mb-3">Your Benefits</h4>
                <ul className="space-y-2">
                  {currentTier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <Gift size={16} className="text-amber-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  addToast('success', 'Points Redeemed', `${selectedLoyalty.points} points redeemed for $${(selectedLoyalty.points / program.redemptionRate).toFixed(2)} reward`);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium"
              >
                Redeem Points
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  addToast('info', 'Points Added', `Bonus points added to ${selectedCustomerData.name}'s account`);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-medium"
              >
                Add Bonus Points
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Top Members */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
        <h3 className="font-bold text-white mb-4">Top Loyalty Members</h3>
        <div className="space-y-3">
          {customerLoyalty
            .sort((a, b) => b.points - a.points)
            .slice(0, 5)
            .map((loyalty, index) => {
              const customer = customers.find(c => c.id === loyalty.customerId);
              if (!customer) return null;

              return (
                <motion.div
                  key={loyalty.customerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50"
                >
                  <div className="text-2xl font-bold text-slate-500 w-8">#{index + 1}</div>
                  <div className="text-3xl">{customer.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{customer.name}</div>
                    <div className="text-xs text-slate-400">{customer.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-400">{loyalty.points}</div>
                    <div className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${getTierColor(loyalty.tier)} text-white inline-block`}>
                      {loyalty.tier}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
