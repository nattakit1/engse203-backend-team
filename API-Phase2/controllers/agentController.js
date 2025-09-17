// controllers/agentController.js - Business logic ที่แยกจาก routes
const { Agent, agents } = require('../models/Agent');
const { AGENT_STATUS, VALID_STATUS_TRANSITIONS, API_MESSAGES } = require('../utils/constants');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const agentController = {
  // ✅ ตัวอย่างสำเร็จ
  // GET /api/agents/:id
  getAgentById: (req, res) => {
    try {
      const { id } = req.params;
      const agent = agents.get(id);

      if (!agent) {
        return sendError(res, API_MESSAGES.AGENT_NOT_FOUND, 404);
      }

      console.log(`📋 Retrieved agent: ${agent.agentCode}`);
      return sendSuccess(res, 'Agent retrieved successfully', agent.toJSON());
    } catch (error) {
      console.error('Error in getAgentById:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // ✅ แก้ TODO #1
  // GET /api/agents
  getAllAgents: (req, res) => {
    try {
      const { status, department } = req.query;
      console.log('📖 Getting all agents with filters:', { status, department });

      // 1. ดึงข้อมูล agents ทั้งหมดจาก Map
      let agentList = Array.from(agents.values());

      // 2. Filter ตาม query parameters
      if (status) {
        agentList = agentList.filter(agent => agent.status === status);
      }
      if (department) {
        agentList = agentList.filter(agent => agent.department === department);
      }

      console.log(`📋 Retrieved ${agentList.length} agents`);

      // 3. ส่ง response ด้วย sendSuccess
      return sendSuccess(
        res,
        'Agents retrieved successfully',
        agentList.map(agent => agent.toJSON())
      );
    } catch (error) {
      console.error('Error in getAllAgents:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // ✅ แก้ TODO #2
  // POST /api/agents
  createAgent: (req, res) => {
    try {
      const agentData = req.body;
      console.log('📝 Creating new agent:', agentData);

      // 1. ตรวจสอบว่า agentCode ซ้ำไหม
      const existingAgent = Array.from(agents.values())
        .find(agent => agent.agentCode === agentData.agentCode);

      if (existingAgent) {
        return sendError(res, `Agent code ${agentData.agentCode} already exists`, 409);
      }

      // 2. สร้าง Agent ใหม่
      const newAgent = new Agent(agentData);

      // 3. เก็บลง Map
      agents.set(newAgent.id, newAgent);

      console.log(`✅ Created agent: ${newAgent.agentCode} - ${newAgent.name}`);

      // 4. ส่ง response พร้อม status 201
      return sendSuccess(res, API_MESSAGES.AGENT_CREATED, newAgent.toJSON(), 201);
    } catch (error) {
      console.error('Error in createAgent:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // ✅ ตัวอย่างสำเร็จ
  // PUT /api/agents/:id
  updateAgent: (req, res) => {
    try {
      const { id } = req.params;
      const agent = agents.get(id);

      if (!agent) {
        return sendError(res, API_MESSAGES.AGENT_NOT_FOUND, 404);
      }

      const { name, email, department, skills } = req.body;

      if (name) agent.name = name;
      if (email) agent.email = email;
      if (department) agent.department = department;
      if (skills) agent.skills = skills;

      agent.updatedAt = new Date();

      console.log(`✏️ Updated agent: ${agent.agentCode}`);
      return sendSuccess(res, API_MESSAGES.AGENT_UPDATED, agent.toJSON());
    } catch (error) {
      console.error('Error in updateAgent:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // ✅ แก้ TODO #3
  // PATCH /api/agents/:id/status
  updateAgentStatus: (req, res) => {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      console.log(`🔄 Updating agent status: ${id} -> ${status}`);

      // 1. หา agent จาก id
      const agent = agents.get(id);

      // 2. ตรวจสอบว่า agent มีอยู่ไหม
      if (!agent) {
        return sendError(res, API_MESSAGES.AGENT_NOT_FOUND, 404);
      }

      // 3. validate status
      if (!Object.values(AGENT_STATUS).includes(status)) {
        return sendError(
          res,
          `Invalid status. Valid statuses: ${Object.values(AGENT_STATUS).join(', ')}`,
          400
        );
      }

      // 4. ตรวจสอบ valid transition
      const currentStatus = agent.status;
      const validTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];

      if (!validTransitions.includes(status)) {
        return sendError(
          res,
          `Cannot change from ${currentStatus} to ${status}. Valid transitions: ${validTransitions.join(', ')}`,
          400
        );
      }

      // 5. เรียก updateStatus
      agent.updateStatus(status, reason);

      console.log(`✅ Agent ${agent.agentCode} status updated to ${status}`);

      // 6. ส่ง response กลับ
      return sendSuccess(res, API_MESSAGES.STATUS_UPDATED, agent.toJSON());
    } catch (error) {
      console.error('Error in updateAgentStatus:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // ✅ ตัวอย่างสำเร็จ
  // DELETE /api/agents/:id
  deleteAgent: (req, res) => {
    try {
      const { id } = req.params;
      const agent = agents.get(id);

      if (!agent) {
        return sendError(res, API_MESSAGES.AGENT_NOT_FOUND, 404);
      }

      agents.delete(id);

      console.log(`🗑️ Deleted agent: ${agent.agentCode} - ${agent.name}`);
      return sendSuccess(res, API_MESSAGES.AGENT_DELETED);
    } catch (error) {
      console.error('Error in deleteAgent:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  },

  // ✅ Dashboard API
  // GET /api/agents/status/summary
  getStatusSummary: (req, res) => {
    try {
      const agentList = Array.from(agents.values());
      const totalAgents = agentList.length;

      const statusCounts = {};
      Object.values(AGENT_STATUS).forEach(status => {
        statusCounts[status] = agentList.filter(agent => agent.status === status).length;
      });

      const statusPercentages = {};
      Object.entries(statusCounts).forEach(([status, count]) => {
        statusPercentages[status] =
          totalAgents > 0 ? Math.round((count / totalAgents) * 100) : 0;
      });

      const summary = {
        totalAgents,
        statusCounts,
        statusPercentages,
        lastUpdated: new Date().toISOString()
      };

      return sendSuccess(res, 'Status summary retrieved successfully', summary);
    } catch (error) {
      console.error('Error in getStatusSummary:', error);
      return sendError(res, API_MESSAGES.INTERNAL_ERROR, 500);
    }
  }
};

module.exports = agentController;
