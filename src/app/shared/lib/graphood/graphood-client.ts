export interface GraphoodClient {
    request<T>(endpoint: string, options?: RequestInit): Promise<T>;
}
