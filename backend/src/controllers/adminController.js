class AdminController {
  constructor(db) {
    this.db = db;
  }

  // Get dashboard stats
  async getDashboardStats(req, res) {
    try {
      // TODO: Implement dashboard statistics
      const stats = {
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    this.db.all(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC",
      (err, users) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json(users);
      }
    );
  }

  // Update user role
  async updateUserRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    this.db.run(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update user role' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
          success: true,
          message: 'User role updated successfully'
        });
      }
    );
  }

  // Delete user
  async deleteUser(req, res) {
    const { id } = req.params;

    this.db.run("DELETE FROM users WHERE id = ?", [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete user' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    });
  }
}

module.exports = AdminController;