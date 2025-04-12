import { Configuration } from '@/configuration';
import axios from 'axios';

export const backend = axios.create({
  baseURL: Configuration.backend_url,
});
