import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, BarChart3, User, Settings, Plus, Edit2, Trash2, CheckCircle, AlertCircle, FileText } from 'lucide-react';

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

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-8 h-8" />
            <span className="text-2xl font-bold">Intelical</span>
          </div>
          <div className="flex space-x-1">
            {[
              { id: 'home', icon: Calendar, label: 'Home' },
              { id: 'dashboard', icon: FileText, label: 'Dashboard' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === item.id 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'hover:bg-blue-700'
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
      description: ''
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">{editingTask ? 'Edit' : 'Add'} Task</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="task">Task</option>
              <option value="bill">Bill</option>
              <option value="income">Income</option>
              <option value="reminder">Reminder</option>
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {(formData.type === 'bill' || formData.type === 'income') && (
              <>
                <input
                  type="number"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => addTask(formData)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTask ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{monthNames[month]} {year}</h2>
          <div className="flex space-x-2">
            <button onClick={() => changeMonth(-1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">←</button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Today</button>
            <button onClick={() => changeMonth(1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">→</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold text-gray-600 py-2">{day}</div>
          ))}
          
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-100 rounded-lg h-32"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayTasks = getTasksForDay(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === month && 
                           new Date().getFullYear() === year;
            
            return (
              <div
                key={day}
                onClick={() => {
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  setSelectedDay(dateStr);
                  setCurrentPage('dashboard');
                }}
                className={`bg-white rounded-lg p-3 h-32 cursor-pointer hover:shadow-lg transition-all border-2 ${
                  isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="font-bold text-lg mb-2">{day}</div>
                <div className="space-y-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map(task => (
                    <div key={task.id} className="flex items-center space-x-1 text-xs truncate">
                      {task.type === 'bill' && <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                      {task.type === 'income' && <DollarSign className="w-3 h-3 text-green-500 flex-shrink-0" />}
                      {task.type === 'task' && <FileText className="w-3 h-3 text-blue-500 flex-shrink-0" />}
                      {task.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />}
                      <span className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>{task.title}</span>
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayTasks.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            setSelectedDay(`${year}-${String(month + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`);
            setShowTaskModal(true);
          }}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    );
  };

  // Dashboard Page
  const DashboardPage = () => {
    const dayTasks = selectedDay ? tasks.filter(t => t.date === selectedDay) : tasks;

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {selectedDay ? `Tasks for ${new Date(selectedDay + 'T00:00:00').toLocaleDateString()}` : 'All Tasks'}
          </h2>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dayTasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{task.title}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => {
                    setEditingTask(task);
                    setShowTaskModal(true);
                  }} className="text-blue-600 hover:text-blue-800">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold">Type:</span> {task.type}</p>
                <p><span className="font-semibold">Date:</span> {new Date(task.date + 'T00:00:00').toLocaleDateString()}</p>
                {task.amount && <p><span className="font-semibold">Amount:</span> ${task.amount}</p>}
                {task.category && <p><span className="font-semibold">Category:</span> {task.category}</p>}
                {task.description && <p className="text-gray-500 italic">{task.description}</p>}
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`w-full py-2 rounded-lg mt-2 ${
                    task.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {task.status === 'completed' ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {dayTasks.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No tasks found</p>
            <p className="text-sm">Click "Add Task" to create one</p>
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
            <button
              onClick={() => editMode ? saveProfile() : setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {editMode ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                disabled={!editMode}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Income Streams</label>
              <div className="space-y-2">
                {formData.incomeStreams.map((stream, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{stream.source}</p>
                      <p className="text-green-600">${stream.amount}</p>
                    </div>
                    {editMode && (
                      <button
                        onClick={() => removeIncomeStream(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {editMode && (
                <div className="flex space-x-2 mt-3">
                  <input
                    type="text"
                    placeholder="Income source"
                    value={newIncome.source}
                    onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                    className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addIncomeStream}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Total Monthly Income: <span className="text-2xl font-bold text-green-600">
                  ${formData.incomeStreams.reduce((sum, s) => sum + Number(s.amount || 0), 0).toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Analytics Page (Placeholder)
  const AnalyticsPage = () => {
    const bills = tasks.filter(t => t.type === 'bill' && t.amount);
    const income = tasks.filter(t => t.type === 'income' && t.amount);
    const totalBills = bills.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalIncome = income.reduce((sum, t) => sum + Number(t.amount), 0) + 
                        userProfile.incomeStreams.reduce((sum, s) => sum + Number(s.amount || 0), 0);

    return (
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Income</h3>
            <p className="text-3xl font-bold">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold">${totalBills.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Net Balance</h3>
            <p className="text-3xl font-bold">${(totalIncome - totalBills).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Spending by Category</h3>
          <div className="space-y-2">
            {bills.reduce((acc, bill) => {
              const cat = bill.category || 'Uncategorized';
              if (!acc[cat]) acc[cat] = 0;
              acc[cat] += Number(bill.amount);
              return acc;
            }, {})
            |> Object.entries(#)
            |> #.map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-semibold">{category}</span>
                <span className="text-red-600 font-bold">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Settings Page (Placeholder)
  const SettingsPage = () => (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">Settings options coming soon...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
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