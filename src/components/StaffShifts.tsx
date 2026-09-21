import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Plus, Edit2, Trash2, Users, X } from 'lucide-react';
import { useApp, staff } from '../store/AppContext';
import { useToast } from './Toast';

export interface StaffShift {
  id: string;
  staffId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breakStart?: string;
  breakEnd?: string;
  isActive: boolean;
}

export default function StaffShifts() {
  const { addToast } = useToast();
  const [shifts, setShifts] = useState<StaffShift[]>([
    {
      id: 'shift-1',
      staffId: 'stf-1',
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      isActive: true,
    },
    {
      id: 'shift-2',
      staffId: 'stf-1',
      dayOfWeek: 2, // Tuesday
      startTime: '09:00',
      endTime: '17:00',
      isActive: true,
    },
    {
      id: 'shift-3',
      staffId: 'stf-2',
      dayOfWeek: 1,
      startTime: '10:00',
      endTime: '18:00',
      isActive: true,
    },
  ]);

  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingShift, setEditingShift] = useState<StaffShift | null>(null);
  const [formData, setFormData] = useState({
    staffId: '',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    breakStart: '',
    breakEnd: '',
    isActive: true,
  });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredShifts = selectedStaff === 'all' 
    ? shifts 
    : shifts.filter(s => s.staffId === selectedStaff);

  const groupedShifts = daysOfWeek.map((day, index) => ({
    day,
    shortDay: shortDays[index],
    shifts: filteredShifts.filter(s => s.dayOfWeek === index),
  }));

  const handleSubmit = () => {
    if (!formData.staffId) {
      addToast('error', 'Missing Staff', 'Please select a staff member');
      return;
    }

    if (editingShift) {
      setShifts(shifts.map(s => 
        s.id === editingShift.id ? { ...s, ...formData } as StaffShift : s
      ));
      addToast('success', 'Shift Updated', 'Staff shift has been updated');
    } else {
      const newShift: StaffShift = {
        id: `shift-${Date.now()}`,
        staffId: formData.staffId,
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        breakStart: formData.breakStart || undefined,
        breakEnd: formData.breakEnd || undefined,
        isActive: formData.isActive,
      };
      setShifts([...shifts, newShift]);
      addToast('success', 'Shift Added', 'New staff shift has been added');
    }

    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingShift(null);
    setFormData({
      staffId: '',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      breakStart: '',
      breakEnd: '',
      isActive: true,
    });
  };

  const handleEdit = (shift: StaffShift) => {
    setEditingShift(shift);
    setFormData({
      staffId: shift.staffId,
      dayOfWeek: shift.dayOfWeek,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakStart: shift.breakStart || '',
      breakEnd: shift.breakEnd || '',
      isActive: shift.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      setShifts(shifts.filter(s => s.id !== id));
      addToast('success', 'Shift Deleted', 'Staff shift has been deleted');
    }
  };

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || 'Unknown';
  };

  const getStaffAvatar = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.avatar || '👤';
  };

  const calculateHours = (start: string, end: string) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return (endMinutes - startMinutes) / 60;
  };

  // Calculate weekly hours per staff
  const staffWeeklyHours = staff.map(s => {
    const staffShifts = shifts.filter(sh => sh.staffId === s.id && sh.isActive);
    const totalHours = staffShifts.reduce((sum, sh) => {
      let hours = calculateHours(sh.startTime, sh.endTime);
      if (sh.breakStart && sh.breakEnd) {
        hours -= calculateHours(sh.breakStart, sh.breakEnd);
      }
      return sum + hours;
    }, 0);
    return { staff: s, totalHours, shiftCount: staffShifts.length };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Staff Shifts</h2>
          <p className="text-slate-400 text-sm">Manage staff working hours and schedules</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
        >
          <Plus size={18} />
          Add Shift
        </motion.button>
      </div>

      {/* Staff Filter */}
      <div className="flex gap-4">
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
        >
          <option value="all">All Staff</option>
          {staff.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Weekly Hours Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {staffWeeklyHours.slice(0, 4).map(({ staff: s, totalHours, shiftCount }) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-slate-900/50 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">{s.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">{s.name}</div>
                <div className="text-xs text-slate-400">{shiftCount} shifts</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{totalHours.toFixed(1)}h</div>
            <div className="text-xs text-slate-400">Weekly hours</div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-indigo-400" />
          Weekly Schedule
        </h3>

        <div className="grid grid-cols-7 gap-3">
          {groupedShifts.map(({ day, shortDay, shifts: dayShifts }) => (
            <div key={day} className="space-y-2">
              <div className="text-center font-semibold text-white text-sm pb-2 border-b border-white/10">
                <div className="hidden sm:block">{day}</div>
                <div className="sm:hidden">{shortDay}</div>
              </div>
              {dayShifts.length === 0 ? (
                <div className="text-center text-xs text-slate-500 py-4">No shifts</div>
              ) : (
                dayShifts.map((shift) => {
                  const staffMember = staff.find(s => s.id === shift.staffId);
                  return (
                    <motion.div
                      key={shift.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-2 rounded-lg border text-xs ${
                        !shift.isActive ? 'opacity-50' : ''
                      } bg-indigo-500/10 border-indigo-500/20`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span>{staffMember?.avatar}</span>
                        <span className="font-medium text-white truncate">{staffMember?.name}</span>
                      </div>
                      <div className="text-slate-400">
                        {shift.startTime} - {shift.endTime}
                      </div>
                      {shift.breakStart && (
                        <div className="text-slate-500 text-[10px]">
                          Break: {shift.breakStart}-{shift.breakEnd}
                        </div>
                      )}
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => handleEdit(shift)}
                          className="flex-1 p-1 rounded bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        >
                          <Edit2 size={10} />
                        </button>
                        <button
                          onClick={() => handleDelete(shift.id)}
                          className="flex-1 p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingShift ? 'Edit Shift' : 'Add Shift'}
              </h3>
              <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Staff Member *</label>
                <select
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                >
                  <option value="">Select staff member</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.avatar} {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Day of Week *</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                >
                  {daysOfWeek.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">End Time *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="hasBreak"
                    checked={!!formData.breakStart}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, breakStart: '12:00', breakEnd: '13:00' });
                      } else {
                        setFormData({ ...formData, breakStart: '', breakEnd: '' });
                      }
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="hasBreak" className="text-sm text-slate-300">
                    Include break time
                  </label>
                </div>
                {formData.breakStart && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Break Start</label>
                      <input
                        type="time"
                        value={formData.breakStart}
                        onChange={(e) => setFormData({ ...formData, breakStart: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-700/50 border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Break End</label>
                      <input
                        type="time"
                        value={formData.breakEnd}
                        onChange={(e) => setFormData({ ...formData, breakEnd: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-700/50 border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-slate-300">
                  Active (include in scheduling)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
                >
                  {editingShift ? 'Update' : 'Add'} Shift
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
