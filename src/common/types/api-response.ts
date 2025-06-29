export type ApiResponse<T = any> = { success: true; data?: T; message?: string } | { success: false; error: string };
