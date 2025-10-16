const ADMIN_SECRET = 'admin-console-2024';

const seededUsers = [
  {
    id: 'u-100',
    name: 'Alice Johnson',
    email: 'alice@classroom.io',
    role: 'admin',
    status: 'active',
    lastActive: '2024-10-16T07:20:00.000Z',
    teacherApprovalRequired: false,
  },
  {
    id: 'u-101',
    name: 'Brian Hughes',
    email: 'brian@classroom.io',
    role: 'teacher',
    status: 'active',
    lastActive: '2024-10-15T18:21:00.000Z',
    teacherApprovalRequired: false,
  },
  {
    id: 'u-102',
    name: 'Carla Mendes',
    email: 'carla@classroom.io',
    role: 'teacher',
    status: 'pending',
    lastActive: '2024-10-13T12:10:00.000Z',
    teacherApprovalRequired: true,
  },
  {
    id: 'u-103',
    name: 'Dev Shah',
    email: 'dev@classroom.io',
    role: 'member',
    status: 'active',
    lastActive: '2024-10-15T09:58:00.000Z',
    teacherApprovalRequired: false,
  },
  {
    id: 'u-104',
    name: 'Ella Rivers',
    email: 'ella@classroom.io',
    role: 'member',
    status: 'suspended',
    lastActive: '2024-10-11T21:33:00.000Z',
    teacherApprovalRequired: false,
  },
];

const seededInvites = [
  {
    id: 'inv-200',
    email: 'mentor.one@example.com',
    role: 'teacher',
    status: 'pending',
    invitedAt: '2024-10-10T15:12:00.000Z',
    invitedBy: 'Alice Johnson',
  },
  {
    id: 'inv-201',
    email: 'principal@example.com',
    role: 'admin',
    status: 'accepted',
    invitedAt: '2024-10-08T12:00:00.000Z',
    respondedAt: '2024-10-09T08:20:00.000Z',
    invitedBy: 'Alice Johnson',
  },
];

const seededCourses = [
  {
    id: 'c-300',
    title: 'Modern Art Theory',
    owner: 'Brian Hughes',
    enrolled: 128,
    status: 'active',
    capacity: 180,
    updatedAt: '2024-10-15T11:30:00.000Z',
  },
  {
    id: 'c-301',
    title: 'Calculus II',
    owner: 'Carla Mendes',
    enrolled: 45,
    status: 'pending',
    capacity: 60,
    updatedAt: '2024-10-13T08:15:00.000Z',
  },
  {
    id: 'c-302',
    title: 'Creative Writing Workshop',
    owner: 'Dev Shah',
    enrolled: 78,
    status: 'archived',
    capacity: 90,
    updatedAt: '2024-09-30T16:05:00.000Z',
  },
];

const seededHealthChecks = [
  {
    id: 'hc-api',
    name: 'Public API Gateway',
    status: 'pass',
    responseTimeMs: 92,
    lastChecked: '2024-10-16T09:00:00.000Z',
    notes: 'Latency within normal thresholds.',
  },
  {
    id: 'hc-db',
    name: 'Primary Database Cluster',
    status: 'pass',
    responseTimeMs: 34,
    lastChecked: '2024-10-16T09:00:00.000Z',
    notes: 'Replication lag below 50ms.',
  },
  {
    id: 'hc-queue',
    name: 'Background Task Queue',
    status: 'warn',
    responseTimeMs: 240,
    lastChecked: '2024-10-16T09:00:00.000Z',
    notes: 'Processing backlog increased by 18%.',
  },
  {
    id: 'hc-search',
    name: 'Search Cluster',
    status: 'fail',
    responseTimeMs: null,
    lastChecked: '2024-10-16T09:00:00.000Z',
    notes: 'Node restart in progress. Expect recovery within 3 minutes.',
  },
];

const seededAuditLogs = [
  {
    id: 'log-501',
    timestamp: '2024-10-16T08:52:00.000Z',
    actor: 'System',
    category: 'health',
    severity: 'warning',
    target: 'Background Task Queue',
    message: 'Alert raised: queue latency reached 240ms. Auto-scaling additional workers.',
  },
  {
    id: 'log-502',
    timestamp: '2024-10-15T20:32:00.000Z',
    actor: 'Alice Johnson',
    category: 'settings',
    severity: 'info',
    target: 'Global Rate Limit',
    message: 'Adjusted action limit to 40 requests per minute for administrative operations.',
  },
  {
    id: 'log-503',
    timestamp: '2024-10-15T18:30:00.000Z',
    actor: 'Alice Johnson',
    category: 'user-management',
    severity: 'warning',
    target: 'User Suspension',
    message: 'Suspended user Ella Rivers following automated abuse detection review.',
  },
  {
    id: 'log-504',
    timestamp: '2024-10-15T16:12:00.000Z',
    actor: 'System',
    category: 'security',
    severity: 'info',
    target: 'Authentication',
    message: 'Multi-factor authentication enforcement enabled for all staff accounts.',
  },
  {
    id: 'log-505',
    timestamp: '2024-10-15T09:15:00.000Z',
    actor: 'Brian Hughes',
    category: 'course-management',
    severity: 'info',
    target: 'Modern Art Theory',
    message: 'Updated course content modules and refreshed enrolment restrictions.',
  },
];

const state = {
  currentUser: null,
  users: [...seededUsers],
  invites: [...seededInvites],
  courses: [...seededCourses],
  healthChecks: [...seededHealthChecks],
  auditLogs: [...seededAuditLogs],
  auditFilters: {
    query: '',
    category: 'all',
  },
  globalSettings: {
    maintenanceMode: false,
    registrationOpen: true,
    enforce2FA: true,
    sessionTimeoutMinutes: 30,
    rateLimitPerMinute: 40,
  },
  metrics: {
    uptimePercent: 99.982,
    averageResponseMs: 182,
    incidentsPastWeek: 1,
  },
};

const dom = {};
let confirmationModal;
let rateLimiter;
let toastTimer;

class RateLimiter {
  constructor(limit, intervalMs) {
    this.limit = limit;
    this.intervalMs = intervalMs;
    this.actions = new Map();
  }

  attempt(key = 'global') {
    const now = Date.now();
    const windowStart = now - this.intervalMs;
    const timestamps = this.actions.get(key) || [];
    const recent = timestamps.filter((ts) => ts > windowStart);

    if (recent.length >= this.limit) {
      this.actions.set(key, recent);
      return false;
    }

    recent.push(now);
    this.actions.set(key, recent);
    return true;
  }

  setLimit(nextLimit) {
    const parsed = Number(nextLimit);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    this.limit = Math.max(1, Math.floor(parsed));
  }
}

class ConfirmationModal {
  constructor(root) {
    this.root = root;
    this.titleEl = root.querySelector('#modal-title');
    this.messageEl = root.querySelector('#modal-message');
    this.confirmButton = root.querySelector('#modal-confirm');
    this.cancelButton = root.querySelector('#modal-cancel');
    this.activeHandler = null;
    this.confirmLabel = 'Confirm';

    this.confirmButton.addEventListener('click', () => {
      if (typeof this.activeHandler === 'function') {
        this.activeHandler();
      }
      this.close();
    });

    this.cancelButton.addEventListener('click', () => this.close());
    this.root.addEventListener('click', (event) => {
      if (event.target === this.root) {
        this.close();
      }
    });
  }

  open({ title, message, onConfirm, confirmLabel }) {
    this.titleEl.textContent = title;
    this.messageEl.textContent = message;
    this.activeHandler = onConfirm;

    const label = confirmLabel || 'Confirm';
    this.confirmButton.textContent = label;

    this.root.classList.remove('hidden');
    this.root.setAttribute('aria-hidden', 'false');
    this.confirmButton.focus({ preventScroll: true });
  }

  close() {
    this.root.classList.add('hidden');
    this.root.setAttribute('aria-hidden', 'true');
    this.activeHandler = null;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  cacheDom();
  confirmationModal = new ConfirmationModal(dom.modalRoot);
  rateLimiter = new RateLimiter(state.globalSettings.rateLimitPerMinute, 60_000);
  bindEvents();
  renderLoginView();
  updateMetrics();
  renderAdminShell();
  renderAllPanels();
});

function cacheDom() {
  dom.loginView = document.querySelector('#login-view');
  dom.adminView = document.querySelector('#admin-view');
  dom.loginForm = document.querySelector('#admin-login-form');
  dom.loginCode = document.querySelector('#admin-login-code');
  dom.loginError = document.querySelector('#login-error');
  dom.adminName = document.querySelector('#admin-name');
  dom.signOutButton = document.querySelector('#sign-out');

  dom.metricsContainer = document.querySelector('#metrics-container');
  dom.healthChecks = document.querySelector('#health-checks');
  dom.refreshHealth = document.querySelector('#refresh-health');

  dom.inviteForm = document.querySelector('#invite-form');
  dom.inviteEmail = document.querySelector('#invite-email');
  dom.inviteRole = document.querySelector('#invite-role');
  dom.inviteList = document.querySelector('#invite-list');

  dom.userList = document.querySelector('#user-list');

  dom.courseForm = document.querySelector('#course-form');
  dom.courseTitle = document.querySelector('#course-title-input');
  dom.courseOwner = document.querySelector('#course-owner-input');
  dom.courseCapacity = document.querySelector('#course-capacity-input');
  dom.courseStatus = document.querySelector('#course-status-input');
  dom.courseList = document.querySelector('#course-list');

  dom.settingsForm = document.querySelector('#settings-form');
  dom.settingMaintenance = document.querySelector('#setting-maintenance');
  dom.settingRegistration = document.querySelector('#setting-registration');
  dom.setting2FA = document.querySelector('#setting-2fa');
  dom.settingTimeout = document.querySelector('#setting-timeout');
  dom.settingRateLimit = document.querySelector('#setting-rate-limit');

  dom.auditList = document.querySelector('#audit-log');
  dom.auditSearch = document.querySelector('#audit-search');
  dom.auditFilter = document.querySelector('#audit-filter');

  dom.activityHistory = document.querySelector('#activity-history');

  dom.modalRoot = document.querySelector('#modal-root');
  dom.modalConfirm = document.querySelector('#modal-confirm');
  dom.modalCancel = document.querySelector('#modal-cancel');

  dom.toast = document.querySelector('#toast');
}

function bindEvents() {
  dom.loginForm.addEventListener('submit', handleLoginSubmit);
  dom.signOutButton.addEventListener('click', handleSignOut);
  dom.inviteForm.addEventListener('submit', handleInviteSubmit);
  dom.inviteList.addEventListener('click', handleInviteListClick);
  dom.userList.addEventListener('click', handleUserListClick);
  dom.courseForm.addEventListener('submit', handleCourseSubmit);
  dom.courseList.addEventListener('click', handleCourseListClick);
  dom.settingsForm.addEventListener('submit', handleSettingsSubmit);
  dom.auditSearch.addEventListener('input', handleAuditFilterChange);
  dom.auditFilter.addEventListener('change', handleAuditFilterChange);
  dom.refreshHealth.addEventListener('click', handleHealthRefresh);
}

function renderLoginView() {
  dom.loginView.classList.remove('hidden');
  dom.adminView.classList.add('hidden');
  dom.loginForm.reset();
  dom.loginError.textContent = '';
}

function renderAdminShell() {
  if (state.currentUser) {
    dom.adminName.textContent = state.currentUser.name;
    dom.loginView.classList.add('hidden');
    dom.adminView.classList.remove('hidden');
  }
}

function renderAllPanels() {
  updateMetrics();
  renderMetrics();
  renderHealthChecks();
  renderInvites();
  renderUsers();
  renderCourses();
  renderSettingsForm();
  renderAuditLog();
  renderActivityHistory();
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const code = (dom.loginCode.value || '').trim();

  if (!code) {
    dom.loginError.textContent = 'Provide the administrator access code.';
    return;
  }

  if (code !== ADMIN_SECRET) {
    dom.loginError.textContent = 'Invalid access code. This attempt has been logged.';
    addAuditLog({
      category: 'security',
      severity: 'warning',
      target: 'Login',
      message: 'Rejected admin console login attempt: invalid access code.',
      actor: 'Unknown',
    });
    showToast('Access denied. Security has been notified.', 'error');
    return;
  }

  state.currentUser = {
    id: 'admin-session',
    name: 'System Administrator',
    role: 'admin',
  };

  dom.loginError.textContent = '';
  renderAdminShell();
  renderAllPanels();

  addAuditLog({
    category: 'security',
    severity: 'info',
    target: 'Login',
    message: 'Administrator signed in to the console.',
  });
  showToast('Welcome back. Administrative controls unlocked.', 'success');
}

function handleSignOut() {
  if (!state.currentUser) {
    return;
  }

  addAuditLog({
    category: 'security',
    severity: 'info',
    target: 'Logout',
    message: `${state.currentUser.name} signed out of the console.`,
  });

  state.currentUser = null;
  renderLoginView();
  showToast('You have been signed out.', 'info');
}

function ensureAdminAccess() {
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    showToast('Administrator privileges required for this action.', 'error');
    return false;
  }
  return true;
}

function handleInviteSubmit(event) {
  event.preventDefault();
  if (!ensureAdminAccess()) return;

  const email = dom.inviteEmail.value.trim().toLowerCase();
  const role = dom.inviteRole.value;

  if (!email) {
    showToast('Provide an email address to invite.', 'warning');
    return;
  }

  const alreadyExists = state.users.some((user) => user.email === email);
  const existingInvite = state.invites.find((invite) => invite.email === email && invite.status === 'pending');

  if (alreadyExists) {
    showToast('A user with that email already exists.', 'error');
    return;
  }

  if (existingInvite) {
    showToast('An active invite already exists for this email.', 'warning');
    return;
  }

  confirmAction({
    title: 'Send invitation',
    message: `Send a ${role} invitation to ${email}?`,
    confirmLabel: 'Send invite',
    rateLimitKey: 'invite',
    onConfirm: () => {
      const invite = {
        id: createId('inv'),
        email,
        role,
        status: 'pending',
        invitedAt: new Date().toISOString(),
        invitedBy: state.currentUser.name,
      };
      state.invites.unshift(invite);
      dom.inviteForm.reset();
      updateMetrics();
      renderInvites();
      showToast('Invitation dispatched successfully.', 'success');
      addAuditLog({
        category: 'user-management',
        severity: 'info',
        target: email,
        message: `Issued a ${role} invitation to ${email}.`,
      });
    },
  });
}

function handleInviteListClick(event) {
  const action = event.target.dataset.action;
  if (!action) return;
  if (!ensureAdminAccess()) return;

  const inviteEl = event.target.closest('[data-invite-id]');
  if (!inviteEl) return;
  const inviteId = inviteEl.dataset.inviteId;
  const invite = state.invites.find((item) => item.id === inviteId);
  if (!invite) return;

  if (action === 'revoke-invite' && invite.status === 'pending') {
    confirmAction({
      title: 'Revoke invitation',
      message: `Revoke the pending invitation for ${invite.email}?`,
      confirmLabel: 'Revoke invite',
      rateLimitKey: 'invite',
      onConfirm: () => {
        invite.status = 'revoked';
        invite.respondedAt = new Date().toISOString();
        renderInvites();
        updateMetrics();
        showToast('Invitation revoked.', 'info');
        addAuditLog({
          category: 'user-management',
          severity: 'warning',
          target: invite.email,
          message: 'Revoked pending invitation after administrative review.',
        });
      },
    });
  }
}

function handleUserListClick(event) {
  const action = event.target.dataset.action;
  if (!action) return;
  if (!ensureAdminAccess()) return;

  const userEl = event.target.closest('[data-user-id]');
  if (!userEl) return;
  const userId = userEl.dataset.userId;
  const user = state.users.find((item) => item.id === userId);
  if (!user) return;

  if (action === 'apply-role') {
    const select = userEl.querySelector('[data-role-select]');
    if (!select) return;
    const nextRole = select.value;
    if (nextRole === user.role && !user.teacherApprovalRequired) {
      showToast('User already has this role.', 'warning');
      return;
    }

    confirmAction({
      title: 'Confirm role change',
      message: `Apply the ${nextRole} role to ${user.name}?`,
      confirmLabel: 'Update role',
      rateLimitKey: 'role-change',
      onConfirm: () => {
        user.role = nextRole;
        user.teacherApprovalRequired = false;
        user.status = user.status === 'pending' ? 'active' : user.status;
        user.lastActive = new Date().toISOString();
        renderUsers();
        updateMetrics();
        showToast(`${user.name} is now a ${nextRole}.`, 'success');
        addAuditLog({
          category: 'user-management',
          severity: 'info',
          target: user.email,
          message: `Role updated to ${nextRole}.`,
        });
      },
    });
  }

  if (action === 'approve-teacher' && user.teacherApprovalRequired) {
    confirmAction({
      title: 'Approve teacher request',
      message: `Approve ${user.name} as a teacher?`,
      confirmLabel: 'Approve teacher',
      rateLimitKey: 'user-approval',
      onConfirm: () => {
        user.teacherApprovalRequired = false;
        user.role = 'teacher';
        user.status = 'active';
        user.lastActive = new Date().toISOString();
        renderUsers();
        updateMetrics();
        showToast(`${user.name} has been approved as a teacher.`, 'success');
        addAuditLog({
          category: 'user-management',
          severity: 'info',
          target: user.email,
          message: 'Teacher approval granted.',
        });
      },
    });
  }

  if (action === 'suspend-user' && user.status !== 'suspended') {
    confirmAction({
      title: 'Suspend user',
      message: `Suspend ${user.name}'s account? They will lose access until reinstated.`,
      confirmLabel: 'Suspend user',
      rateLimitKey: 'user-suspension',
      onConfirm: () => {
        user.status = 'suspended';
        user.lastActive = new Date().toISOString();
        renderUsers();
        updateMetrics();
        showToast(`${user.name} has been suspended.`, 'warning');
        addAuditLog({
          category: 'security',
          severity: 'critical',
          target: user.email,
          message: 'Account suspended by administrator.',
        });
      },
    });
  }

  if (action === 'reinstate-user' && user.status === 'suspended') {
    confirmAction({
      title: 'Reinstate user',
      message: `Reinstate ${user.name}'s account access?`,
      confirmLabel: 'Reinstate',
      rateLimitKey: 'user-reinstate',
      onConfirm: () => {
        user.status = 'active';
        user.lastActive = new Date().toISOString();
        renderUsers();
        updateMetrics();
        showToast(`${user.name} has been reactivated.`, 'success');
        addAuditLog({
          category: 'user-management',
          severity: 'info',
          target: user.email,
          message: 'Account reinstated after suspension.',
        });
      },
    });
  }
}

function handleCourseSubmit(event) {
  event.preventDefault();
  if (!ensureAdminAccess()) return;

  const title = dom.courseTitle.value.trim();
  const owner = dom.courseOwner.value.trim();
  const capacity = Number(dom.courseCapacity.value);
  const status = dom.courseStatus.value;

  if (!title || !owner || !capacity || capacity <= 0) {
    showToast('Provide course title, lead, and a valid capacity.', 'warning');
    return;
  }

  confirmAction({
    title: 'Add new course',
    message: `Create course “${title}” led by ${owner}?`,
    confirmLabel: 'Create course',
    rateLimitKey: 'course-create',
    onConfirm: () => {
      const course = {
        id: createId('c'),
        title,
        owner,
        enrolled: 0,
        status,
        capacity,
        updatedAt: new Date().toISOString(),
      };
      state.courses.unshift(course);
      dom.courseForm.reset();
      updateMetrics();
      renderCourses();
      showToast('Course added to catalogue.', 'success');
      addAuditLog({
        category: 'course-management',
        severity: 'info',
        target: course.title,
        message: `New course created with status ${status}.`,
      });
    },
  });
}

function handleCourseListClick(event) {
  const action = event.target.dataset.action;
  if (!action) return;
  if (!ensureAdminAccess()) return;

  const courseEl = event.target.closest('[data-course-id]');
  if (!courseEl) return;
  const courseId = courseEl.dataset.courseId;
  const course = state.courses.find((item) => item.id === courseId);
  if (!course) return;

  if (action === 'update-status') {
    const select = courseEl.querySelector('[data-course-status]');
    if (!select) return;
    const nextStatus = select.value;
    if (nextStatus === course.status) {
      showToast('Course already has that status.', 'warning');
      return;
    }

    confirmAction({
      title: 'Update course status',
      message: `Change ${course.title} to ${nextStatus}?`,
      confirmLabel: 'Update status',
      rateLimitKey: 'course-update',
      onConfirm: () => {
        course.status = nextStatus;
        course.updatedAt = new Date().toISOString();
        renderCourses();
        updateMetrics();
        showToast(`${course.title} is now ${nextStatus}.`, 'info');
        addAuditLog({
          category: 'course-management',
          severity: nextStatus === 'archived' ? 'warning' : 'info',
          target: course.title,
          message: `Status updated to ${nextStatus}.`,
        });
      },
    });
  }

  if (action === 'archive-course' && course.status !== 'archived') {
    confirmAction({
      title: 'Archive course',
      message: `Archive ${course.title}? Students will retain read-only access.`,
      confirmLabel: 'Archive course',
      rateLimitKey: 'course-archive',
      onConfirm: () => {
        course.status = 'archived';
        course.updatedAt = new Date().toISOString();
        renderCourses();
        updateMetrics();
        showToast(`${course.title} archived.`, 'warning');
        addAuditLog({
          category: 'course-management',
          severity: 'warning',
          target: course.title,
          message: 'Course archived.',
        });
      },
    });
  }

  if (action === 'remove-course') {
    confirmAction({
      title: 'Remove course',
      message: `Permanently remove ${course.title}? This cannot be undone.`,
      confirmLabel: 'Remove course',
      rateLimitKey: 'course-remove',
      onConfirm: () => {
        state.courses = state.courses.filter((item) => item.id !== courseId);
        renderCourses();
        updateMetrics();
        showToast(`${course.title} removed from catalogue.`, 'error');
        addAuditLog({
          category: 'course-management',
          severity: 'critical',
          target: course.title,
          message: 'Course permanently removed from catalogue.',
        });
      },
    });
  }
}

function handleSettingsSubmit(event) {
  event.preventDefault();
  if (!ensureAdminAccess()) return;

  const timeoutInput = Number(dom.settingTimeout.value);
  const rateLimitInput = Number(dom.settingRateLimit.value);

  const nextSettings = {
    maintenanceMode: dom.settingMaintenance.checked,
    registrationOpen: dom.settingRegistration.checked,
    enforce2FA: dom.setting2FA.checked,
    sessionTimeoutMinutes:
      Number.isFinite(timeoutInput) && timeoutInput >= 5
        ? Math.floor(timeoutInput)
        : state.globalSettings.sessionTimeoutMinutes,
    rateLimitPerMinute:
      Number.isFinite(rateLimitInput) && rateLimitInput >= 1
        ? Math.floor(rateLimitInput)
        : state.globalSettings.rateLimitPerMinute,
  };

  confirmAction({
    title: 'Apply global settings',
    message: 'Apply the updated platform-wide settings? This impacts all users immediately.',
    confirmLabel: 'Apply settings',
    rateLimitKey: 'settings-update',
    onConfirm: () => {
      state.globalSettings = nextSettings;
      rateLimiter.setLimit(nextSettings.rateLimitPerMinute);
      renderSettingsForm();
      showToast('Global settings saved.', 'success');
      addAuditLog({
        category: 'settings',
        severity: 'info',
        target: 'Platform',
        message: `Updated global settings. Maintenance: ${nextSettings.maintenanceMode ? 'on' : 'off'}, rate limit ${nextSettings.rateLimitPerMinute}/min.`,
      });
    },
  });
}

function handleAuditFilterChange() {
  state.auditFilters.query = dom.auditSearch.value.trim().toLowerCase();
  state.auditFilters.category = dom.auditFilter.value;
  renderAuditLog();
  renderActivityHistory();
}

function handleHealthRefresh() {
  if (!ensureAdminAccess()) return;

  confirmAction({
    title: 'Run health diagnostics',
    message: 'Trigger a platform health sweep? This will refresh service telemetry.',
    confirmLabel: 'Run diagnostics',
    rateLimitKey: 'health-refresh',
    onConfirm: () => {
      const now = new Date();
      state.healthChecks = state.healthChecks.map((check) => {
        const responseTime = generateResponseTime(check);
        const status = deriveHealthStatus(responseTime, check.status);
        return {
          ...check,
          responseTimeMs: responseTime,
          status,
          lastChecked: now.toISOString(),
          notes: generateHealthNotes(check.name, status),
        };
      });
      renderHealthChecks();
      addAuditLog({
        category: 'health',
        severity: 'info',
        target: 'System health',
        message: 'Manual health diagnostics executed.',
      });
      showToast('Health diagnostics completed.', 'info');
    },
  });
}

function renderMetrics() {
  const summary = [
    {
      label: 'Total users',
      value: state.metrics.totalUsers,
      trend: `${state.metrics.adminCount} admins · ${state.metrics.teacherCount} teachers`,
    },
    {
      label: 'Pending approvals',
      value: state.metrics.pendingApprovals,
      trend: `${state.metrics.pendingInvites} invites awaiting response`,
    },
    {
      label: 'Course catalogue',
      value: state.metrics.activeCourses,
      trend: `${state.metrics.pendingCourses} pending · ${state.metrics.archivedCourses} archived`,
    },
    {
      label: 'Platform uptime',
      value: `${state.metrics.uptimePercent.toFixed(3)}%`,
      trend: `${state.metrics.incidentsPastWeek} incident past 7 days`,
    },
  ];

  dom.metricsContainer.innerHTML = summary
    .map(
      (metric) => `
        <article class="metric-card">
          <span class="metric-card__label">${metric.label}</span>
          <span class="metric-card__value">${formatMetricValue(metric.value)}</span>
          <span class="metric-card__trend">${metric.trend}</span>
        </article>
      `,
    )
    .join('');
}

function renderHealthChecks() {
  dom.healthChecks.innerHTML = state.healthChecks
    .map((check) => {
      const statusClass = {
        pass: 'status-pill--pass',
        warn: 'status-pill--warn',
        fail: 'status-pill--fail',
      }[check.status] || 'status-pill--warn';

      const responseText = check.responseTimeMs == null ? 'offline' : `${check.responseTimeMs} ms`;

      return `
        <li class="health-item" data-health-id="${check.id}">
          <div class="health-item__meta">
            <strong>${check.name}</strong>
            <span class="health-item__note">Response time: ${responseText}</span>
            <span class="health-item__note">Last checked ${formatRelativeTime(check.lastChecked)}</span>
            <span class="health-item__note">${check.notes}</span>
          </div>
          <span class="status-pill ${statusClass}">${check.status}</span>
        </li>
      `;
    })
    .join('');
}

function renderInvites() {
  if (!state.invites.length) {
    dom.inviteList.innerHTML = '<p>No invitations have been issued yet.</p>';
    return;
  }

  dom.inviteList.innerHTML = state.invites
    .map((invite) => {
      const statusTag = formatInviteStatus(invite.status);
      const actions = invite.status === 'pending'
        ? '<button class="button button--ghost" data-action="revoke-invite">Revoke</button>'
        : '';

      return `
        <article class="list-item" data-invite-id="${invite.id}">
          <div class="list-item__header">
            <h3 class="list-item__title">${invite.email}</h3>
            <span class="tag tag--${invite.role}">${invite.role}</span>
          </div>
          <div class="list-item__meta">
            <span class="invite-status">Status: ${statusTag}</span>
            <span>Invited ${formatRelativeTime(invite.invitedAt)}</span>
            <span>By ${invite.invitedBy}</span>
          </div>
          ${actions ? `<div class="list-item__actions">${actions}</div>` : ''}
        </article>
      `;
    })
    .join('');
}

function renderUsers() {
  dom.userList.innerHTML = state.users
    .map((user) => {
      const roleTagClass = `tag--${user.role}`;
      const statusTag = user.status !== 'active' ? `<span class="tag tag--${user.status}">${user.status}</span>` : '';
      const approvalTag = user.teacherApprovalRequired ? '<span class="tag tag--pending">Teacher approval required</span>' : '';
      const suspendButton =
        user.status !== 'suspended'
          ? '<button class="button button--ghost" data-action="suspend-user">Suspend</button>'
          : '<button class="button button--ghost" data-action="reinstate-user">Reinstate</button>';
      const approveButton = user.teacherApprovalRequired
        ? '<button class="button button--primary" data-action="approve-teacher">Approve teacher</button>'
        : '';

      return `
        <article class="list-item" data-user-id="${user.id}">
          <div class="list-item__header">
            <div>
              <h3 class="list-item__title">${user.name}</h3>
              <div class="list-item__meta">
                <span>${user.email}</span>
                <span>Last active ${formatRelativeTime(user.lastActive)}</span>
              </div>
            </div>
            <span class="tag ${roleTagClass}">${user.role}</span>
          </div>
          <div class="list-item__meta">
            ${statusTag}
            ${approvalTag}
          </div>
          <div class="user-actions">
            <label class="form__label" for="role-${user.id}">Role</label>
            <select id="role-${user.id}" class="form__input" data-role-select>
              ${['member', 'teacher', 'admin']
                .map((role) => `<option value="${role}" ${role === user.role ? 'selected' : ''}>${capitalize(role)}</option>`)
                .join('')}
            </select>
            <button class="button button--primary" data-action="apply-role">Apply role</button>
            ${approveButton}
            ${suspendButton}
          </div>
        </article>
      `;
    })
    .join('');
}

function renderCourses() {
  if (!state.courses.length) {
    dom.courseList.innerHTML = '<p>No courses in the catalogue.</p>';
    return;
  }

  dom.courseList.innerHTML = state.courses
    .map((course) => {
      const statusTag = `<span class="tag tag--${course.status}">${course.status}</span>`;
      const archiveAction = course.status !== 'archived'
        ? '<button class="button button--ghost" data-action="archive-course">Archive</button>'
        : '';

      return `
        <article class="list-item" data-course-id="${course.id}">
          <div class="list-item__header">
            <div>
              <h3 class="list-item__title">${course.title}</h3>
              <div class="list-item__meta">
                <span>Lead: ${course.owner}</span>
                <span>${course.enrolled} enrolled</span>
                ${course.capacity ? `<span>Capacity ${course.capacity}</span>` : ''}
                <span>Updated ${formatRelativeTime(course.updatedAt)}</span>
              </div>
            </div>
            ${statusTag}
          </div>
          <div class="list-item__actions">
            <select class="form__input" data-course-status>
              ${['pending', 'active', 'archived']
                .map((status) => `<option value="${status}" ${status === course.status ? 'selected' : ''}>${capitalize(status)}</option>`)
                .join('')}
            </select>
            <button class="button button--primary" data-action="update-status">Apply status</button>
            ${archiveAction}
            <button class="button button--danger" data-action="remove-course">Remove</button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderSettingsForm() {
  dom.settingMaintenance.checked = state.globalSettings.maintenanceMode;
  dom.settingRegistration.checked = state.globalSettings.registrationOpen;
  dom.setting2FA.checked = state.globalSettings.enforce2FA;
  dom.settingTimeout.value = state.globalSettings.sessionTimeoutMinutes;
  dom.settingRateLimit.value = state.globalSettings.rateLimitPerMinute;
}

function renderAuditLog() {
  const filtered = state.auditLogs.filter((entry) => {
    const matchesCategory = state.auditFilters.category === 'all' || entry.category === state.auditFilters.category;
    const matchesQuery = !state.auditFilters.query
      || [entry.actor, entry.message, entry.target]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(state.auditFilters.query));
    return matchesCategory && matchesQuery;
  });

  if (!filtered.length) {
    dom.auditList.innerHTML = '<p>No audit events match your filters.</p>';
    return;
  }

  dom.auditList.innerHTML = filtered
    .map((entry) => `
      <article class="audit-log__item">
        <div class="audit-log__header">
          <span class="audit-log__category">${formatCategory(entry.category)}</span>
          <span class="severity severity--${entry.severity}">${entry.severity}</span>
        </div>
        <small>${formatDateTime(entry.timestamp)} · ${entry.actor}</small>
        <p class="audit-log__message">${entry.message}</p>
        <small>Target: ${entry.target}</small>
      </article>
    `)
    .join('');
}

function renderActivityHistory() {
  const recent = state.auditLogs.slice(0, 6);

  dom.activityHistory.innerHTML = recent
    .map((entry) => `
      <li class="activity-history__item">
        <span class="activity-history__time">${formatRelativeTime(entry.timestamp)}</span>
        <strong>${entry.actor}</strong> · ${entry.message}
      </li>
    `)
    .join('');
}

function updateMetrics() {
  const totalUsers = state.users.length;
  const adminCount = state.users.filter((user) => user.role === 'admin').length;
  const teacherCount = state.users.filter((user) => user.role === 'teacher' && !user.teacherApprovalRequired).length;
  const pendingApprovals = state.users.filter((user) => user.teacherApprovalRequired || user.status === 'pending').length;
  const pendingInvites = state.invites.filter((invite) => invite.status === 'pending').length;

  const activeCourses = state.courses.filter((course) => course.status === 'active').length;
  const pendingCourses = state.courses.filter((course) => course.status === 'pending').length;
  const archivedCourses = state.courses.filter((course) => course.status === 'archived').length;

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const incidentsPastWeek = state.auditLogs.filter((entry) => {
    const timestamp = new Date(entry.timestamp).getTime();
    if (Number.isNaN(timestamp)) return false;
    const withinWindow = timestamp >= sevenDaysAgo;
    const qualifies = entry.severity === 'critical' || entry.category === 'security';
    return withinWindow && qualifies;
  }).length;

  state.metrics = {
    ...state.metrics,
    totalUsers,
    adminCount,
    teacherCount,
    pendingApprovals,
    pendingInvites,
    activeCourses,
    pendingCourses,
    archivedCourses,
    incidentsPastWeek,
  };
}

function addAuditLog({ category, severity, target, message, actor }) {
  const entry = {
    id: createId('log'),
    timestamp: new Date().toISOString(),
    actor: actor || (state.currentUser ? state.currentUser.name : 'System'),
    category,
    severity,
    target,
    message,
  };

  state.auditLogs.unshift(entry);
  updateMetrics();
  renderMetrics();
  renderAuditLog();
  renderActivityHistory();
}

function showToast(message, variant = 'info') {
  clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.remove('hidden', 'toast--error', 'toast--warning', 'toast--success');

  if (variant === 'error') dom.toast.classList.add('toast--error');
  if (variant === 'warning') dom.toast.classList.add('toast--warning');
  if (variant === 'success') dom.toast.classList.add('toast--success');

  dom.toast.classList.add('toast--visible');

  toastTimer = setTimeout(() => {
    dom.toast.classList.remove('toast--visible');
  }, 3500);
}

function confirmAction({ title, message, confirmLabel, onConfirm, rateLimitKey }) {
  confirmationModal.open({
    title,
    message,
    confirmLabel,
    onConfirm: () => {
      const key = rateLimitKey || 'global';
      if (!rateLimiter.attempt(key)) {
        showToast('Rate limit exceeded. Try again shortly.', 'error');
        addAuditLog({
          category: 'security',
          severity: 'warning',
          target: 'Rate limiting',
          message: `Blocked ${title.toLowerCase()} due to rate limit.`,
        });
        return;
      }
      onConfirm();
    },
  });
}

function generateResponseTime(check) {
  if (check.status === 'fail') {
    return Math.random() > 0.6 ? Math.floor(150 + Math.random() * 220) : null;
  }
  return Math.floor(30 + Math.random() * 210);
}

function deriveHealthStatus(responseTime, previousStatus) {
  if (responseTime == null) {
    return 'fail';
  }
  if (responseTime > 220) {
    return 'fail';
  }
  if (responseTime > 160) {
    return 'warn';
  }
  return previousStatus === 'fail' && responseTime < 160 ? 'warn' : 'pass';
}

function generateHealthNotes(name, status) {
  if (status === 'fail') {
    return `${name} reporting disruption. Engineers notified.`;
  }
  if (status === 'warn') {
    return `${name} experiencing elevated load. Monitoring closely.`;
  }
  return `${name} operating nominally.`;
}

function formatInviteStatus(status) {
  if (status === 'pending') return 'Pending';
  if (status === 'accepted') return 'Accepted';
  if (status === 'revoked') return 'Revoked';
  if (status === 'expired') return 'Expired';
  return capitalize(status);
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function formatRelativeTime(isoDate) {
  if (!isoDate) return 'unknown';
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString();
}

function formatDateTime(isoDate) {
  const date = new Date(isoDate);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function formatCategory(category) {
  return category
    .split('-')
    .map((part) => capitalize(part))
    .join(' ');
}

function formatMetricValue(value) {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
}

function capitalize(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}
