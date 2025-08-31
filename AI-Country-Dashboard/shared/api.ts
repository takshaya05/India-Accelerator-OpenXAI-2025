/**
 * Shared types
 */

export interface DemoResponse {
  message: string;
}

export interface CountrySummary {
  name: string;
  cca3: string;
  region?: string;
  subregion?: string;
  capital?: string;
  latlng?: [number, number];
  population?: number;
  area?: number;
  flagPng?: string;
  currencies?: { code: string; name: string; symbol?: string }[];
}

export interface TopCountriesResponse {
  countries: CountrySummary[];
  metric: "population";
}

export interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OllamaChatRequest {
  model: "llama3.2:1b"; 
  messages: OllamaChatMessage[];
  options?: Record<string, unknown>;
}

export interface OllamaChatResponse {
  message: OllamaChatMessage;
}
