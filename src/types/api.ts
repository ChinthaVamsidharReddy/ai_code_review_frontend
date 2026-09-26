export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  sizeBytes?: number;
  fileId?: string;
  isBinary?: boolean;
  children?: TreeNode[];
}

export type ReviewMode = 'security' | 'performance' | 'quality';
export type ReviewScope = 'single_file' | 'multi_file' | 'project';
export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface ReviewIssue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  filePath?: string;
  lineHint?: string;
  recommendation?: string;
}

export interface Review {
  id: string;
  projectId: string;
  mode: ReviewMode;
  scope: ReviewScope;
  filePaths: string[];
  summary: string;
  generalRecommendations: string[];
  status: 'completed' | 'failed';
  errorMessage?: string;
  aiModel?: string;
  issues: ReviewIssue[];
  createdAt: string;
}

export interface AiProvider {
  id: string;
  name: string;
  providerType: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
  isDefault: boolean;
  hasApiKey: boolean;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  contextFilePaths: string[];
  createdAt: string;
}
