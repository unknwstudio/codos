import React from 'react';

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export enum DemoState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}