import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, BarChart3, User, Settings, Plus, Edit2, Trash2, CheckCircle, AlertCircle, FileText, Heart, TrendingUp, Activity } from 'lucide-react';

const Intelical = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    occupation: '',
    incomeStreams: [],
    profilePicture: null
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('intelical_tasks');
    const savedProfile = localStorage.getItem('intelical_userProfile');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('intelical_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('intelical_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTasksForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.date === dateStr);
  };

  const addTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id } : t));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...taskData, id: Date.now(), status: 'pending' }]);
    }
    setShowTaskModal(false);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    ));
  };

  // Constants
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  // Helper function for category totals
  const getCategoryTotals = (bills) => {
    return bills.reduce((acc, bill) => {
      const cat = bill.category || 'Uncategorized';
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += Number(bill.amount);
      return acc;
    }, {});
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">Intelical</span>
              <p className="text-xs text-white text-opacity-90">Smart Life Planner</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {[
              { id: 'home', icon: Calendar, label: 'Calendar' },
              { id: 'dashboard', icon: FileText, label: 'Tasks' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                  currentPage === item.id 
                    ? 'bg-white text-blue-600 shadow-lg font-semibold' 
                    : 'hover:bg-white hover:bg-opacity-20 backdrop-blur-sm'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  // Task Modal Component
  const TaskModal = () => {
    const [formData, setFormData] = useState(editingTask || {
      title: '',
      type: 'task',
      date: selectedDay || '',
      amount: '',
      category: '',
      description: '',
      intensity: 'medium'
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
          <div className="flex items-center space-x-3 mb-6">
            {formData.type === 'period' && <Heart className="w-8 h-8 text-pink-500" />}
            {formData.type === 'event' && <Calendar className="w-8 h-8 text-purple-500" />}
            {formData.type === 'bill' && <AlertCircle className="w-8 h-8 text-red-500" />}
            {formData.type === 'income' && <DollarSign className="w-8 h-8 text-green-500" />}
            {formData.type === 'task' && <FileText className="w-8 h-8 text-blue-500" />}
            <h3 className="text-3xl font-bold text-gray-800">{editingTask ? 'Edit' : 'Add'} {formData.type === 'period' ? 'Period Entry' : 'Task'}</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                placeholder={formData.type === 'period' ? 'Period Day 1' : 'Task Title'}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="task">📋 Task</option>
                <option value="bill">💸 Bill</option>
                <option value="income">💰 Income</option>
                <option value="reminder">🔔 Reminder</option>
                <option value="event">🎉 Event</option>
                <option value="period">🩷 Period Tracking</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                max={formData.type === 'period' ? new Date().toISOString().split('T')[0] : undefined}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {formData.type === 'period' && (
                <p className="text-xs text-gray-500 mt-1">Period entries cannot be in the future</p>
              )}
            </div>
            {(formData.type === 'bill' || formData.type === 'income') && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Groceries, Salary"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </>
            )}
            {formData.type === 'period' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Flow Intensity</label>
                <select
                  value={formData.intensity}
                  onChange={(e) => setFormData({...formData, intensity: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                >
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (optional)</label>
              <textarea
                placeholder={formData.type === 'period' ? 'Notes about symptoms, mood, etc.' : 'Additional details...'}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows="3"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => addTask(formData)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
              >
                {editingTask ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Home Page - Calendar View
  const HomePage = () => {
    const { daysInMonth, startingDayOfWeek, month, year } = getDaysInMonth(currentDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const changeMonth = (direction) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + direction);
      setCurrentDate(newDate);
    };

    // Quick stats - optimized with string comparison
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayTasks = tasks.filter(t => t.date === todayStr);
    
    const nextWeek = new Date(Date.now() + 7 * MILLISECONDS_PER_DAY);
    const nextWeekStr = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;
    const upcomingTasks = tasks.filter(t => t.date > todayStr && t.date <= nextWeekStr);

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">{monthNames[month]} {year}</h2>
              <p className="text-gray-600 mt-1">Your smart calendar at a glance</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => changeMonth(-1)} className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold">
                ←
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-5 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all font-semibold text-gray-700">
                Today
              </button>
              <button onClick={() => changeMonth(1)} className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold">
                →
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-md">
              <p className="text-sm opacity-90">Today's Tasks</p>
              <p className="text-3xl font-bold">{todayTasks.length}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-md">
              <p className="text-sm opacity-90">Upcoming (7 days)</p>
              <p className="text-3xl font-bold">{upcomingTasks.length}</p>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl p-4 shadow-md">
              <p className="text-sm opacity-90">Total Tasks</p>
              <p className="text-3xl font-bold">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-7 gap-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-bold text-gray-700 py-3 text-sm uppercase tracking-wide">{day}</div>
            ))}
            
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-gray-50 rounded-lg h-32"></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayTasks = getTasksForDay(day);
              const isToday = new Date().getDate() === day && 
                             new Date().getMonth() === month && 
                             new Date().getFullYear() === year;
              const hasPeriod = dayTasks.some(t => t.type === 'period');
              
              return (
                <div
                  key={day}
                  onClick={() => {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    setSelectedDay(dateStr);
                    setCurrentPage('dashboard');
                  }}
                  className={`rounded-xl p-3 h-32 cursor-pointer hover:shadow-xl transition-all border-2 transform hover:scale-105 ${
                    isToday 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md' 
                      : hasPeriod
                      ? 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`font-bold text-lg mb-2 ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>{day}</div>
                  <div className="space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map(task => (
                      <div key={task.id} className="flex items-center space-x-1 text-xs truncate">
                        {task.type === 'bill' && <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                        {task.type === 'income' && <DollarSign className="w-3 h-3 text-green-500 flex-shrink-0" />}
                        {task.type === 'task' && <FileText className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                        {task.type === 'event' && <Calendar className="w-3 h-3 text-purple-500 flex-shrink-0" />}
                        {task.type === 'period' && <Heart className="w-3 h-3 text-pink-500 flex-shrink-0" />}
                        {task.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />}
                        <span className={task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}>{task.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium">+{dayTasks.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedDay(`${year}-${String(month + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`);
            setShowTaskModal(true);
          }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-40"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    );
  };

  // Dashboard Page
  const DashboardPage = () => {
    const dayTasks = selectedDay ? tasks.filter(t => t.date === selectedDay) : tasks;
    const completedCount = dayTasks.filter(t => t.status === 'completed').length;
    const pendingCount = dayTasks.length - completedCount;

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              {selectedDay ? `📅 ${new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}` : '📋 All Tasks'}
            </h2>
            <div className="flex space-x-4 mt-2">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">{pendingCount}</span> pending
              </span>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{completedCount}</span> completed
              </span>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-purple-600">{dayTasks.length}</span> total
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dayTasks.map(task => {
            const borderColors = {
              'task': 'border-blue-500',
              'bill': 'border-red-500',
              'income': 'border-green-500',
              'event': 'border-purple-500',
              'period': 'border-pink-500',
              'reminder': 'border-yellow-500'
            };
            const bgColors = {
              'task': 'bg-blue-50',
              'bill': 'bg-red-50',
              'income': 'bg-green-50',
              'event': 'bg-purple-50',
              'period': 'bg-pink-50',
              'reminder': 'bg-yellow-50'
            };
            
            return (
              <div key={task.id} className={`${bgColors[task.type] || 'bg-white'} rounded-xl shadow-lg p-5 border-l-4 ${borderColors[task.type] || 'border-blue-500'} hover:shadow-2xl transition-all transform hover:scale-105`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {task.type === 'period' && <Heart className="w-5 h-5 text-pink-500" />}
                    {task.type === 'event' && <Calendar className="w-5 h-5 text-purple-500" />}
                    {task.type === 'bill' && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {task.type === 'income' && <DollarSign className="w-5 h-5 text-green-500" />}
                    {task.type === 'task' && <FileText className="w-5 h-5 text-blue-500" />}
                    <h3 className="font-bold text-lg">{task.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => {
                      setEditingTask(task);
                      setShowTaskModal(true);
                    }} className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-800 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Type:</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white">{task.type}</span>
                  </div>
                  <p><span className="font-semibold text-gray-800">Date:</span> {new Date(task.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  {task.amount && <p><span className="font-semibold text-gray-800">Amount:</span> <span className="text-lg font-bold text-green-600">${task.amount}</span></p>}
                  {task.category && <p><span className="font-semibold text-gray-800">Category:</span> {task.category}</p>}
                  {task.description && <p className="text-gray-600 italic bg-white bg-opacity-50 p-2 rounded-lg mt-2">{task.description}</p>}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`w-full py-2 rounded-lg mt-3 font-semibold transition-all ${
                      task.status === 'completed' 
                        ? 'bg-green-500 text-white shadow-md' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                    }`}
                  >
                    {task.status === 'completed' ? '✓ Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {dayTasks.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-16 h-16 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-700 mb-2">No tasks yet</p>
            <p className="text-gray-500 mb-6">Start organizing your life by adding your first task!</p>
            <button
              onClick={() => setShowTaskModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Task</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Profile Page
  const ProfilePage = () => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(userProfile);
    const [newIncome, setNewIncome] = useState({ source: '', amount: '' });

    const saveProfile = () => {
      setUserProfile(formData);
      setEditMode(false);
    };

    const addIncomeStream = () => {
      if (newIncome.source && newIncome.amount) {
        setFormData({
          ...formData,
          incomeStreams: [...formData.incomeStreams, newIncome]
        });
        setNewIncome({ source: '', amount: '' });
      }
    };

    const removeIncomeStream = (index) => {
      setFormData({
        ...formData,
        incomeStreams: formData.incomeStreams.filter((_, i) => i !== index)
      });
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-800">Profile</h2>
                <p className="text-gray-600">Manage your personal information</p>
              </div>
            </div>
            <button
              onClick={() => editMode ? saveProfile() : setEditMode(true)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                editMode 
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
              }`}
            >
              {editMode ? '💾 Save' : '✏️ Edit'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={!editMode}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-all"
              />
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
              <input
                type="text"
                placeholder="Enter your occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                disabled={!editMode}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-all"
              />
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Income Streams 💰</label>
              <div className="space-y-3">
                {formData.incomeStreams.map((stream, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{stream.source}</p>
                      <p className="text-green-600 text-lg font-bold">${Number(stream.amount).toFixed(2)}</p>
                    </div>
                    {editMode && (
                      <button
                        onClick={() => removeIncomeStream(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.incomeStreams.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No income streams added yet</p>
                )}
              </div>

              {editMode && (
                <div className="flex space-x-3 mt-4">
                  <input
                    type="text"
                    placeholder="Income source (e.g., Salary)"
                    value={newIncome.source}
                    onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                    className="w-36 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={addIncomeStream}
                    className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 shadow-md"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Monthly Income</p>
                  <p className="text-4xl font-bold">
                    ${formData.incomeStreams.reduce((sum, s) => sum + Number(s.amount || 0), 0).toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-16 h-16 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Analytics Page
  const AnalyticsPage = () => {
    const bills = tasks.filter(t => t.type === 'bill' && t.amount);
    const income = tasks.filter(t => t.type === 'income' && t.amount);
    const periods = tasks.filter(t => t.type === 'period').sort((a, b) => new Date(b.date) - new Date(a.date));
    const totalBills = bills.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalIncome = income.reduce((sum, t) => sum + Number(t.amount), 0) + 
                        userProfile.incomeStreams.reduce((sum, s) => sum + Number(s.amount || 0), 0);
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;

    // Calculate period cycle if there are multiple entries
    const calculateCycle = () => {
      if (periods.length < 2) return null;
      const dates = periods.map(p => new Date(p.date));
      const gaps = [];
      for (let i = 0; i < dates.length - 1; i++) {
        const gap = Math.floor((dates[i] - dates[i + 1]) / MILLISECONDS_PER_DAY);
        if (gap > 0) gaps.push(gap);
      }
      return gaps.length > 0 ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : null;
    };

    const avgCycle = calculateCycle();
    const lastPeriod = periods.length > 0 ? new Date(periods[0].date) : null;
    const nextPredicted = lastPeriod && avgCycle ? new Date(lastPeriod.getTime() + avgCycle * MILLISECONDS_PER_DAY) : null;

    return (
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Analytics Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Income</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">${totalIncome.toFixed(2)}</p>
            <p className="text-sm text-green-100 mt-1">{income.length} income sources</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Expenses</h3>
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">${totalBills.toFixed(2)}</p>
            <p className="text-sm text-red-100 mt-1">{bills.length} expenses</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Net Balance</h3>
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">${(totalIncome - totalBills).toFixed(2)}</p>
            <p className="text-sm text-blue-100 mt-1">{totalIncome > totalBills ? 'Surplus' : 'Deficit'}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Task Progress</h3>
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
            <p className="text-sm text-purple-100 mt-1">{completedTasks} of {totalTasks} completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-red-500" />
              <span>Spending by Category</span>
            </h3>
            <div className="space-y-3">
              {Object.entries(getCategoryTotals(bills)).map(([category, amount]) => {
                const percentage = totalBills > 0 ? (Number(amount) / totalBills * 100).toFixed(1) : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">{category}</span>
                      <span className="text-red-600 font-bold">${Number(amount).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full transition-all" style={{width: `${percentage}%`}}></div>
                    </div>
                    <p className="text-xs text-gray-500">{percentage}% of total expenses</p>
                  </div>
                );
              })}
              {bills.length === 0 && (
                <p className="text-gray-400 text-center py-8">No expenses recorded yet</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-600" />
              <span className="text-pink-800">Period Tracking</span>
            </h3>
            {periods.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-white bg-opacity-70 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Last Period Started</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {lastPeriod.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.floor((new Date() - lastPeriod) / MILLISECONDS_PER_DAY)} days ago
                  </p>
                </div>
                {avgCycle && (
                  <>
                    <div className="bg-white bg-opacity-70 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Average Cycle Length</p>
                      <p className="text-2xl font-bold text-pink-600">{avgCycle} days</p>
                    </div>
                    {nextPredicted && (
                      <div className="bg-white bg-opacity-70 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Next Period Expected</p>
                        <p className="text-2xl font-bold text-pink-600">
                          {nextPredicted.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          In {Math.ceil((nextPredicted - new Date()) / MILLISECONDS_PER_DAY)} days
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div className="bg-white bg-opacity-70 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Recent History</p>
                  <div className="space-y-1">
                    {periods.slice(0, 5).map(period => (
                      <div key={period.id} className="text-sm text-gray-700 flex items-center space-x-2">
                        <Heart className="w-3 h-3 text-pink-500" />
                        <span>{new Date(period.date).toLocaleDateString()}</span>
                        {period.intensity && <span className="text-xs text-gray-500">({period.intensity})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="w-16 h-16 mx-auto mb-4 text-pink-300 opacity-50" />
                <p className="text-gray-600">No period data tracked yet</p>
                <p className="text-sm text-gray-500 mt-2">Start tracking to see cycle predictions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Settings Page
  const SettingsPage = () => {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      periodReminders: true,
      billReminders: true,
      currency: 'USD'
    });

    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Settings</h2>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">Enable Notifications</p>
                  <p className="text-sm text-gray-500">Get reminders for tasks and events</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                  className={`w-14 h-8 rounded-full transition-all ${settings.notifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${settings.notifications ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">Period Reminders</p>
                  <p className="text-sm text-gray-500">Get notified about upcoming periods</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, periodReminders: !settings.periodReminders})}
                  className={`w-14 h-8 rounded-full transition-all ${settings.periodReminders ? 'bg-pink-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${settings.periodReminders ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">Bill Reminders</p>
                  <p className="text-sm text-gray-500">Get reminders for upcoming bills</p>
                </div>
                <button
                  onClick={() => setSettings({...settings, billReminders: !settings.billReminders})}
                  className={`w-14 h-8 rounded-full transition-all ${settings.billReminders ? 'bg-green-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${settings.billReminders ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-700">Dark Mode</p>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
                <button
                  disabled
                  className="w-14 h-8 rounded-full bg-gray-300 opacity-50 cursor-not-allowed"
                >
                  <div className="w-6 h-6 bg-white rounded-full shadow-md transform translate-x-1"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Data Management</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Export Data
              </button>
              <button className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                Import Data
              </button>
              <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                Clear All Data
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold mb-2 text-gray-800">About Intelical</h3>
            <p className="text-gray-600 mb-2">Version 1.0.0</p>
            <p className="text-sm text-gray-500">
              Your smart life planner for tracking finances, periods, events, and tasks all in one place.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navigation />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'analytics' && <AnalyticsPage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'settings' && <SettingsPage />}
      
      {showTaskModal && <TaskModal />}
    </div>
  );
};

export default Intelical;