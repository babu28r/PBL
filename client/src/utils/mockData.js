export const mockChecklists = [
  {
    id: 1,
    title: "GDPR Compliance Checklist",
    description: "Checklist for General Data Protection Regulation compliance",
    category: "Privacy",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
    created_by: 1,
    progress: 60
  },
  {
    id: 2,
    title: "ISO 27001 Security Audit",
    description: "Information security management system audit",
    category: "Security",
    status: "completed",
    created_at: "2024-01-10T09:15:00Z",
    updated_at: "2024-01-18T16:20:00Z",
    created_by: 1,
    progress: 100
  },
  {
    id: 3,
    title: "PCI DSS Compliance",
    description: "Payment Card Industry Data Security Standard",
    category: "Financial",
    status: "draft",
    created_at: "2024-01-05T11:00:00Z",
    updated_at: "2024-01-05T11:00:00Z",
    created_by: 1,
    progress: 20
  },
  {
    id: 4,
    title: "HIPAA Compliance Checklist",
    description: "Health Insurance Portability and Accountability Act",
    category: "Privacy",
    status: "active",
    created_at: "2024-01-12T13:45:00Z",
    updated_at: "2024-01-19T10:30:00Z",
    created_by: 1,
    progress: 75
  },
  {
    id: 5,
    title: "SOC 2 Type II Audit",
    description: "Service Organization Control compliance",
    category: "Security",
    status: "active",
    created_at: "2024-01-08T14:20:00Z",
    updated_at: "2024-01-15T11:10:00Z",
    created_by: 1,
    progress: 40
  }
];

export const mockChecklistItems = {
  1: [
    { 
      id: 1, 
      checklist_id: 1, 
      item_text: "Data Protection Officer appointed", 
      requirement: "GDPR Article 37", 
      status: "completed", 
      due_date: "2024-01-30T23:59:59Z", 
      completed_date: "2024-01-25T10:00:00Z",
      assignee_name: "John Doe",
      comments: "DPO appointed on Jan 25"
    },
    { 
      id: 2, 
      checklist_id: 1, 
      item_text: "Privacy Policy updated", 
      requirement: "GDPR Article 13", 
      status: "completed", 
      due_date: "2024-01-30T23:59:59Z", 
      completed_date: "2024-01-28T14:30:00Z",
      assignee_name: "Jane Smith",
      comments: "Policy reviewed and updated"
    },
    { 
      id: 3, 
      checklist_id: 1, 
      item_text: "Data Processing Agreements in place", 
      requirement: "GDPR Article 28", 
      status: "in-progress", 
      due_date: "2024-02-15T23:59:59Z", 
      assignee_name: "Bob Wilson",
      comments: "Draft agreements prepared"
    }
  ],
  2: [
    { 
      id: 4, 
      checklist_id: 2, 
      item_text: "Risk Assessment completed", 
      requirement: "ISO 27001:2013 A.12", 
      status: "completed", 
      due_date: "2024-01-10T23:59:59Z", 
      completed_date: "2024-01-08T09:00:00Z",
      assignee_name: "Security Team"
    },
    { 
      id: 5, 
      checklist_id: 2, 
      item_text: "Security Policies documented", 
      requirement: "ISO 27001:2013 A.5", 
      status: "completed", 
      due_date: "2024-01-12T23:59:59Z", 
      completed_date: "2024-01-10T16:45:00Z",
      assignee_name: "John Doe"
    }
  ]
};

export const mockStats = {
  totalChecklists: 5,
  completedItems: 12,
  pendingItems: 8,
  overdueItems: 2,
  totalItems: 20
};

export const categories = [
  "Security",
  "Privacy", 
  "Financial",
  "Legal",
  "Quality",
  "Safety",
  "Environmental",
  "Other"
];